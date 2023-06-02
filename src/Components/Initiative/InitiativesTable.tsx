import { Fragment, useEffect, useMemo, useState } from "react";
import { DateInfo, FindItemsRemaining } from "../../Services/CompanyService";
import { InitiativeFilter } from "../../Services/Filters";
import { Company, Initiative, IntegrityId, upsertInitiativeInfo } from "../../Store/CompanySlice";
import { defaultRowStyle, greenProbabilityStyle, inputStyle, redProbabilityStyle, TableHeaderStyle, tooltipStyle, yellowButtonStyle } from "../../Styles";
import { GenerateProbability } from "../../Services/ProbabilitySimulationService";
import { DateInput } from "../DateInput";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import { ViewDecisionDataButton } from "./ViewDecisionDataButton";
import Pagination from "@mui/material/Pagination";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { FormControl, IconButton, Input, InputLabel, MenuItem, Select } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { v4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { User, selectCurrentUser } from "../../Store/UserSlice";
import { enqueueSnackbar } from "notistack";
import ValidateNewInitiative, { ValidationFailedPrefix } from "../../Services/Validation";
import { InitiativeActionsMenu } from "./InitiativeActionsMenu";
import { DateToDateInfo } from "../../Services/DateHelpers";

export const InitiativeTableIds = {
  table: "initiativesTable",
  totalItems: 'initiativeTableTotalItems',
  remainingItems: 'initiativesTableRemainingItems',
  initiativeTitle: 'initiativesTableTitle',
  companyName: 'initiativesTableCompanyName',
  companySelect: "initiativesTableCompanySelect",
  startDate: "initiativesTableStartDate",
  targetDate: "initiativesTableTargetDate",
  editInitiativeTitle: "initiativesTableEditTitle",
  editStartDate: "initiativesTableEditStartDate",
  editTargetDate: "initiativesTableEditTargetDate",
  editTotalItems: "initiativesTableEditTotalItems",
  initiativeTitleFilter: "initiativesTableFilterTitle",
  companyNameFilter: "initiativesTableFilterCompanyName",
  addButton: "initiativesTableAddButton",
  editButton: "initiativesTableEditButton",
  saveChangesButton: "initiativesTableSaveChangesButton",
  cancelChangesButton: "initiativesTableCancelChangesButton",
  actionMenu: {
    menuButton: "initiativesTableMenuButton",
    decisionButton: "initiativesTableDecisionButton",
    documentButton: "initiativesTableDocumentButton",
    uploadThroughputButton: "initiativesTableUploadThroughputButton",
    editThroughputButton: "initiativesTableEditThroughputButton"
  }
}

interface InitiativesProps {
  companyList: Company[],
  currentUser: User | undefined,
  radioStatus: string,
  ValidateInitiative: (initiative: Initiative, companyId: string, allCompanies: Company[]) => {success: boolean, message: string}
  addInitiative: boolean,
  setAddInitiative: (value: boolean) => void
}

interface InitCompanyDisplay extends Initiative {
  company: Company,
  probabilityValue: number | undefined,
  probabilityStatus: string,
  itemsRemaining: number
}

interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export default function InitiativesTable(props: InitiativesProps) {
  const dispatch = useAppDispatch();
  const [searchedComp, setSearchedComp] = useState('');
  const [searchedInit, setSearchedInit] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: '', direction: 'desc'});

  const [sortedDisplayItems, setSortedDisplayItems] = useState<InitCompanyDisplay[]>([]);
  const [displayItems, setDisplayItems] = useState<InitCompanyDisplay[]>([]);

  const resultsLimitOptions: number[] = [5, 10, 25];
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [resultsLimit, setResultsLimit] = useState(10);
  const [initiativesLoaded, setInitiativesLoaded] = useState(false);

  useEffect(() => {
    UpdateDisplayItems();
  },[props.companyList,searchedInit,searchedComp,props.radioStatus]);

  useEffect(() => {
    if(!InEditMode() && props.addInitiative === true)
    {
      const displayClone: InitCompanyDisplay[] = JSON.parse(JSON.stringify(displayItems));
      const myUuid = v4();
      const todayInfo = DateToDateInfo(new Date());
      let matchingCompany = props.companyList.find(c => c.id === props.currentUser?.companyId);
      if(matchingCompany?.id === IntegrityId) matchingCompany = {id: "", name: "", initiatives: ([])};
      if(matchingCompany)
      {
        const newInitiative: InitCompanyDisplay = {id: myUuid, title: "", targetDate: todayInfo, startDate: todayInfo, totalItems: 1, itemsCompletedOnDate: [], decisions: [], company: matchingCompany, itemsRemaining: 0, probabilityStatus: "", probabilityValue: -1};
        displayClone.unshift(newInitiative);
        setDisplayItems(displayClone);
        setSearchedComp("");
        setSearchedInit("");
        ResetPageNumber();
        if(props.currentUser !== undefined)
          EnterEditMode(myUuid,matchingCompany.id,displayClone,true);
      }
    }
  },[props.addInitiative]);

  useMemo(() => {
    let sortedItems = JSON.parse(JSON.stringify(displayItems));
    sortedItems.sort((a: any, b: any) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if(aValue === undefined)
        aValue = -0.001;
      if(bValue === undefined)
        bValue = -0.001;

      if(typeof(aValue) === "string")
        aValue = aValue.toUpperCase();

      if(typeof(bValue) === "string")
        bValue = bValue.toUpperCase();

      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setSortedDisplayItems(sortedItems);
  }, [sortConfig, displayItems]);
  
  const requestSort = (key: string) => {
    let direction: 'desc' | 'asc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  }

  function UpdateDisplayItems()
  {
    const displayList: InitCompanyDisplay[] = [];
    const filteredCompanies = props.companyList.filter(e => e.name.toLowerCase().includes(searchedComp.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
    for(let company of filteredCompanies)
    {
      let initiatives = InitiativeFilter(company.initiatives.filter(e => e.title.toLowerCase().includes(searchedInit.toLowerCase()))
        .sort((a, b) => a.title.localeCompare(b.title)),props.radioStatus);
      initiatives.map((init) => {
        let itemsRemaining = FindItemsRemaining(init);
        let probability = GenerateProbability(init, itemsRemaining);
        displayList.push({...init, company:company, itemsRemaining:itemsRemaining, probabilityValue:probability.value, probabilityStatus:probability.status});
      });
    }
    setDisplayItems(displayList);
    setInitiativesLoaded(true);
    LeaveEditMode();
    ResetPageNumber();
  }

  function getHealthIndicator(probability: number | undefined)
  {
    if (probability === undefined || probability < 0) return defaultRowStyle;
    if (probability < 50 && probability >= 0) return redProbabilityStyle;
    else if (probability > 90) return greenProbabilityStyle;
  }

  function ResetPageNumber()
  {
    setPageNumber(1);
  }

  const indexOfLastItem = pageNumber * resultsLimit;
  const indexOfFirstItem = indexOfLastItem - resultsLimit;
  const currentItems = sortedDisplayItems.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const count = Math.ceil(sortedDisplayItems.length/resultsLimit);
    setPageCount(count);
    if(count < pageNumber && count > 0)
    {
      setPageNumber(count);
    }
  },[sortedDisplayItems,resultsLimit]);

  const handleChange = (event: any, value: any) => {
    setPageNumber(value);
  };

  interface SortProps {
    sortKey: string
    heading: string
  }

  function SortLabel(props: SortProps)
  {
    return (
      <TableSortLabel
        sx={{ 
          ".MuiTableSortLabel-icon":{
            opacity: '1 !important',
            fontSize: 26
          },
          "&.Mui-active":{ 
            ".MuiTableSortLabel-icon": {
              //fontSize: 26
            }
          }
        }}
        IconComponent={sortConfig.key === props.sortKey ? ArrowDownwardIcon : ImportExportIcon}
        onClick={() => requestSort(props.sortKey)} active={sortConfig.key === props.sortKey} 
        direction={sortConfig.direction}
      >
        {props.heading}
      </TableSortLabel>
    )
  }

  let companyInits: Initiative[] = displayItems;
  let totalInits: number = companyInits.length;

  enum stateEnum {
    start,
    edit,
    add
  }

  const [state, setState] = useState(stateEnum.start);
  const [initToEditId, setInitToEditId] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentStartDate, setCurrentStartDate] = useState<DateInfo>();
  const [currentTargetDate, setCurrentTargetDate] = useState<DateInfo>();
  const [currentTotalItems, setCurrentTotalItems] = useState(1);
  const [companyToEditId, setCompanyToEditId] = useState("");
  
  function InEditMode()
  {
    return state === stateEnum.edit || state === stateEnum.add;
  }

  function EnterEditMode(initId: string, companyId: string, displayList: InitCompanyDisplay[], newInit: boolean)
  {
    if(!InEditMode())
    {
      const currentItem = displayList.find(i => i.id === initId);
      if(currentItem)
      {
        setState(newInit ? stateEnum.add : stateEnum.edit);
        setInitToEditId(initId);
        setCompanyToEditId(companyId);  //might not need this
        setCurrentTitle(currentItem.title);
        setCurrentStartDate(currentItem.startDate);
        setCurrentTargetDate(currentItem.targetDate);
        setCurrentTotalItems(currentItem.totalItems);
      }
    }
  }

  function LeaveEditMode()
  {
    setState(stateEnum.start);
    setInitToEditId("");
    setCompanyToEditId("");
  }

  function SaveEdit()
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const matchingCompany = props.companyList.find(c => c.id === companyToEditId);
    if(matchingCompany)
    {
      let matchingInit = matchingCompany.initiatives.find(i => i.id === initToEditId) ?? displayItems.find(i => i.id === initToEditId);
      if(matchingInit)
      {
        const invalidDate: DateInfo = {
          day: -1,
          month: -1,
          year: -1
        }
        let newInitiative: Initiative = {
          id: matchingInit.id,
          title: currentTitle,
          targetDate: currentTargetDate ?? invalidDate,
          startDate: currentStartDate ?? invalidDate,
          totalItems: currentTotalItems,
          itemsCompletedOnDate: matchingInit.itemsCompletedOnDate,
          decisions: matchingInit.decisions
        }

        const validation = ValidateNewInitiative(newInitiative, companyToEditId, props.companyList);
        if(validation.success)
        {
          let saveMessage = "Changes have been saved.";
          if(state === stateEnum.add)
            saveMessage = "New initiative added!";
          
          dispatch(upsertInitiativeInfo({isTest: isTest, initiative: newInitiative, companyId: companyToEditId}));
          props.setAddInitiative(false);
          LeaveEditMode();
          enqueueSnackbar(saveMessage, {variant: "success"});
        }
        else
          enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
      }
    }
  }

  function CancelEdit()
  {
    if(state === stateEnum.add && initToEditId !== "")
    {
      const displayClone: InitCompanyDisplay[] = displayItems.filter(i => i.id !== initToEditId);
      setDisplayItems(displayClone);
    }
    props.setAddInitiative(false);
    LeaveEditMode();
  }

  const userCompanyId = props.currentUser?.companyId;
  const isAdmin = props.currentUser?.isAdmin;

  return (
    <>
      <div className="grid grid-cols-1 w-full h-auto">
        <div className="col-span-1 h-[4vh] pb-4 space-x-4 mb-10">
          <input data-cy={InitiativeTableIds.companyNameFilter} className={inputStyle} type={'text'} placeholder="Filter by Company" value={searchedComp} onChange={(e) => setSearchedComp(e.target.value)} />
          <input data-cy={InitiativeTableIds.initiativeTitleFilter} className={inputStyle} type={'text'} placeholder="Filter by Title" value={searchedInit} onChange={(e) => setSearchedInit(e.target.value)} />
        </div>
        {totalInits !== 0 &&
        <div className="col-span-1 py=2">
          <TableContainer elevation={12} component={Paper}>
            <Table className="table-auto w-full outline outline-3 bg-gray-100">
              <colgroup>
                <col style={{ width: '15vw' }} />
                <col style={{ width: '15vw' }} />
                <col style={{ width: '13vw' }} />
                <col style={{ width: '13vw' }} />
                <col style={{ width: '7vw' }} />
                <col style={{ width: '9vw' }} />
                <col style={{ width: '12vw' }} />
                <col style={{ width: '3vw' }} />
                {isAdmin &&
                  <col style={{ width: '3vw' }} />
                }
              </colgroup>
              <TableHead className="outline outline-1">
                <TableRow sx={{
                  borderBottom: "2px solid black",
                  "& th": {
                    fontSize: "1.2vw",
                    fontWeight: "bold",
                    fontFamily: "Arial, Helvetica"
                  }
                }}>
                  <TableHeaderStyle>
                    <SortLabel heading="Company" sortKey='companyName'/>
                  </TableHeaderStyle>
                  <TableHeaderStyle>
                    <SortLabel heading="Title" sortKey='title'/>
                  </TableHeaderStyle>
                  <TableHeaderStyle>
                    <SortLabel heading="Start Date" sortKey='startDateTime'/>
                  </TableHeaderStyle>
                  <TableHeaderStyle>
                    <SortLabel heading="Target Completion" sortKey='targetDateTime'/>
                  </TableHeaderStyle>
                  <TableHeaderStyle>Total Items</TableHeaderStyle>
                  <TableHeaderStyle>Items Remaining</TableHeaderStyle>
                  <TableHeaderStyle>
                    <SortLabel heading="Probability" sortKey='probabilityValue'/>
                  </TableHeaderStyle>
                  <TableHeaderStyle>Actions</TableHeaderStyle>
                  {isAdmin &&
                    <TableHeaderStyle>Edit</TableHeaderStyle>
                  }
                </TableRow>
              </TableHead>
              <TableBody data-cy={InitiativeTableIds.table}>
                {currentItems.map((displayItem, index) => {
                  let probability = { value: displayItem.probabilityValue, status: displayItem.probabilityStatus };
                  let healthIndicator =  getHealthIndicator(probability.value);
                  let tooltipMessage = probability.value === undefined ? probability.status :
                    probability.value === 0 ? "Data may be insufficient or may indicate a very low probability of success" :
                      probability.value + "%";
                  
                  let isEdit = InEditMode() && initToEditId === displayItem.id;

                  return (
                    <Fragment key={index}>
                      <TableRow key={index} className={healthIndicator} sx={{
                        borderBottom: "1px solid black",
                        "& td": {
                          fontSize: "1vw",
                          fontFamily: "Arial, Helvetica",
                          color: "#21345b"
                        }
                      }}>
                        { isEdit ?
                          <>
                            <TableCell data-cy={InitiativeTableIds.companyName}>
                            {(userCompanyId !== IntegrityId || state !== stateEnum.add) &&
                              <>{displayItem.company.name}</>
                            }
                            {(userCompanyId === IntegrityId && state === stateEnum.add) &&
                              <>
                                <FormControl fullWidth>
                                  <InputLabel id="company-select-label">Select Company</InputLabel>
                                  <Select data-cy={InitiativeTableIds.companySelect} labelId="company-select-label" label="Select company" value={companyToEditId} onChange={(e) => setCompanyToEditId(e.target.value)}>
                                    {
                                      props.companyList.map((company,index) => {
                                        return (
                                          <MenuItem sx={{fontSize: "1vw"}} key={index} value={company.id}>
                                            {company.name}
                                          </MenuItem>
                                        )
                                      })
                                    }
                                  </Select>
                                </FormControl>
                              </>
                            }
                            </TableCell>
                            <TableCell>
                              <Input sx={{fontSize: "1vw"}} data-cy={InitiativeTableIds.editInitiativeTitle} value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)}/>
                            </TableCell>
                            <TableCell><DateInput cypressData={InitiativeTableIds.editStartDate} date={currentStartDate} setDate={setCurrentStartDate}/></TableCell>
                            <TableCell><DateInput cypressData={InitiativeTableIds.editTargetDate} date={currentTargetDate} setDate={setCurrentTargetDate}/></TableCell>
                            <TableCell>
                              <Input sx={{fontSize: "1vw"}} data-cy={InitiativeTableIds.editTotalItems} type="number" value={currentTotalItems} onChange={(e) => setCurrentTotalItems(parseInt(e.target.value))}/>
                            </TableCell>
                            <TableCell sx={{fontSize: "1vw"}} data-cy={InitiativeTableIds.remainingItems}>{displayItem.itemsRemaining}</TableCell>
                            <TableCell></TableCell>
                            <TableCell className="w-1/12">
                              <InitiativeActionsMenu cypressData={InitiativeTableIds.actionMenu} disabled={true} allCompanies={props.companyList} company={displayItem.company} initiative={displayItem} isAdmin={false}/>
                            </TableCell>
                            <TableCell className="w-1/12">
                              <IconButton data-cy={InitiativeTableIds.saveChangesButton} onClick={() => SaveEdit()}>
                                <DoneIcon sx={{ fontSize: "1.3vw" }}/>
                              </IconButton>
                              <IconButton data-cy={InitiativeTableIds.cancelChangesButton} onClick={() => CancelEdit()}>
                                <CancelIcon sx={{ fontSize: "1.3vw" }}/>
                              </IconButton>
                            </TableCell>
                          </>
                          :
                          <>
                            <TableCell data-cy={InitiativeTableIds.companyName}>{displayItem.company.name}</TableCell>
                            <TableCell data-cy={InitiativeTableIds.initiativeTitle}>{displayItem.title}</TableCell>
                            <TableCell data-cy={InitiativeTableIds.startDate}>{displayItem.startDate.month + "/" + displayItem.startDate.day + "/" + displayItem.startDate.year}</TableCell>
                            <TableCell data-cy={InitiativeTableIds.targetDate}>{displayItem.targetDate.month + "/" + displayItem.targetDate.day + "/" + displayItem.targetDate.year}</TableCell>
                            <TableCell data-cy={InitiativeTableIds.totalItems}>{displayItem.totalItems}</TableCell>
                            <TableCell data-cy={InitiativeTableIds.remainingItems}>{displayItem.itemsRemaining}</TableCell>
                            <TableCell className={tooltipStyle} title={tooltipMessage}>{probability.value === undefined ? "NA" : probability.value + "%"}
                              <i className="material-icons" style={{ fontSize: '15px', marginLeft: '15px', marginTop: '10px' }}>info_outline</i>
                            </TableCell>
                            <TableCell className="w-1/12">
                              <InitiativeActionsMenu cypressData={InitiativeTableIds.actionMenu} allCompanies={props.companyList} company={displayItem.company} initiative={displayItem} isAdmin={isAdmin ?? false}/>
                            </TableCell>
                            {isAdmin &&
                              <TableCell className="w-1/12">
                                <IconButton data-cy={InitiativeTableIds.editButton} disabled={InEditMode()} onClick={() => EnterEditMode(displayItem.id, displayItem.company.id, displayItems, false)}>
                                  <EditIcon sx={{ fontSize: "1.3vw" }} />
                                </IconButton>
                              </TableCell>
                            }
                          </>
                        }
                      </TableRow>
                    </Fragment>
                  );
                }
                )}
              </TableBody>
            </Table>
          </TableContainer>
            <div className="flex p-2 items-center">
              <p>Results Per Page</p>
              <select value={resultsLimit} onChange={(e) => { setResultsLimit(parseInt(e.target.value)); ResetPageNumber(); } }
                className='mx-2 rounded-md border border-gray-200 hover:bg-gray-100'>
                {resultsLimitOptions.map((limit, index) => {
                  return (
                    <option key={index} value={limit}>
                      {limit}
                    </option>
                  );
                })}
              </select>
              <div className="flex pl-2">
                <Pagination
                  className="my-3"
                  count={pageCount}
                  page={pageNumber}
                  variant="outlined"
                  shape="rounded"
                  onChange={handleChange} />
              </div>
            </div>
        </div>}
      </div>
      {totalInits === 0 && initiativesLoaded === true && <div className="m-2 p-2 text-3xl font-bold">No Initiatives to Display</div>}
    </>
  )
}