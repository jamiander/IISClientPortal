import { Fragment, useEffect, useMemo, useState } from "react";
import { DateInfo, FindItemsRemaining } from "../../Services/CompanyService";
import { InitiativeFilter } from "../../Services/Filters";
import { Company, Initiative, IntegrityId, upsertInitiativeInfo } from "../../Store/CompanySlice";
import { defaultRowStyle, greenProbabilityStyle, inputStyle, redProbabilityStyle, tableButtonFontSize, tableCellFontSize, tableHeaderFontSize, TableHeaderStyle, tooltipStyle } from "../../Styles";
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
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { FormControl, IconButton, Input, InputLabel, MenuItem, Select } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { v4 } from "uuid";
import { User } from "../../Store/UserSlice";
import { InitiativeActionsMenu } from "./InitiativeActionsMenu";
import { DateToDateInfo, MakeDate } from "../../Services/DateHelpers";
import { MakeClone } from "../../Services/Cloning";
import { useSorter } from "../../Services/Sorter";
import { useEditInitiative } from "../../Services/useEditInitiative";
import { usePaginator } from "../../Services/usePaginator";
import { Paginator } from "../Paginator";

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
  companyList: Company[]
  currentUser: User | undefined
  radioStatus: string
  ValidateInitiative: (initiative: Initiative, companyId: string, allCompanies: Company[]) => {success: boolean, message: string}
  addInitiative: boolean
  setAddInitiative: (value: boolean) => void
  searchedComp: string
  setSearchedComp: (value: string) => void
  searchedInit: string
  setSearchedInit: (value: string) => void
}

export interface InitCompanyDisplay extends Initiative {
  company: Company,
  companyName: string,
  startDateTime: Date,
  targetDateTime: Date,
  probabilityValue: number | undefined,
  probabilityStatus: string,
  itemsRemaining: number
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export default function InitiativesTable(props: InitiativesProps) {
  const paginator = usePaginator();
  const [initiativesLoaded, setInitiativesLoaded] = useState(false);

  const {
    SetupSortItems,
    SortItems,
    sortedDisplayItems,
    sortConfig
  } = useSorter();

  const {
    SetupEditInitiative,
    EnterEditMode,
    LeaveEditMode,
    InEditMode,
    SaveEdit,
    CancelEdit,
    initToEditId,
    currentTitle,
    setCurrentTitle,
    currentStartDate,
    setCurrentStartDate,
    currentTargetDate,
    setCurrentTargetDate,
    currentTotalItems,
    setCurrentTotalItems,
    companyToEditId,
    setCompanyToEditId,
    displayItems
  } = useEditInitiative();

  useEffect(() => 
  {
    const paginatedItems = paginator.PaginateItems(sortedDisplayItems);
    SetupEditInitiative(paginatedItems);
  }, [sortedDisplayItems,paginator.page,paginator.rowsPerPage])

  useEffect(() => {
    UpdateDisplayItems();
  },[props.companyList,props.searchedInit,props.searchedComp,props.radioStatus]);

  useEffect(() => {
    if(!InEditMode() && props.addInitiative === true)
    {
      const displayClone = MakeClone(sortedDisplayItems);
      const myUuid = v4();
      const todayInfo = DateToDateInfo(new Date());
      const date = new Date();
      let matchingCompany = props.companyList.find(c => c.id === props.currentUser?.companyId);
      if(matchingCompany?.id === IntegrityId) matchingCompany = {id: "", name: "", initiatives: ([])};
      if(matchingCompany)
      {
        const newInitiative: InitCompanyDisplay = {
          id: myUuid, title: "", 
          targetDate: todayInfo, 
          startDate: todayInfo, 
          totalItems: 1, 
          itemsCompletedOnDate: [], 
          decisions: [], 
          company: matchingCompany, 
          itemsRemaining: 0, 
          probabilityStatus: "", 
          probabilityValue: -1,
          companyName: matchingCompany.name,
          startDateTime: date,
          targetDateTime: date
        };
        displayClone.unshift(newInitiative);
        SetupSortItems(displayClone);
        props.setSearchedComp("");
        props.setSearchedInit("");
        ResetPageNumber();
        if(props.currentUser !== undefined)
          EnterEditMode(myUuid,matchingCompany.id,displayClone,true);
      }
    }
  },[props.addInitiative]);
  
  const requestSort = (key: string) => {
    let direction: 'desc' | 'asc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    if (sortConfig.key != key) sortConfig.key = key;
    sortConfig.direction = direction;
    SortItems(sortConfig, sortedDisplayItems);
    ResetPageNumber();
  }

  function UpdateDisplayItems()
  {
    const displayList: InitCompanyDisplay[] = [];
    const filteredCompanies = props.companyList.filter(e => e.name.toLowerCase().includes(props.searchedComp.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
    for(let company of filteredCompanies)
    {
      let initiatives = InitiativeFilter(company.initiatives.filter(e => e.title.toLowerCase().includes(props.searchedInit.toLowerCase()))
        .sort((a, b) => a.title.localeCompare(b.title)),props.radioStatus);
      initiatives.map((init) => {
        let itemsRemaining = FindItemsRemaining(init);
        let probability = GenerateProbability(init, itemsRemaining);
        displayList.push({
          ...init, company: company, itemsRemaining: itemsRemaining, probabilityValue: probability.value, probabilityStatus: probability.status,
          companyName: company.name,
          startDateTime: MakeDate(init.startDate),
          targetDateTime: MakeDate(init.targetDate)
        });
      });
    }
    SetupSortItems(displayList);
    setInitiativesLoaded(true);
    LeaveEditMode();
  }

  function getHealthIndicator(probability: number | undefined)
  {
    if (probability === undefined || probability < 0) return defaultRowStyle;
    if (probability < 50 && probability >= 0) return redProbabilityStyle;
    else if (probability > 90) return greenProbabilityStyle;
  }

  function ResetPageNumber()
  {
    paginator.HandlePaginationChange(null,1);
  }


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

  const userCompanyId = props.currentUser?.companyId;
  const isAdmin = props.currentUser?.isAdmin;

  return (
    <>
      <div className="grid grid-cols-1 w-full h-auto">
        <div className="col-span-1 h-[4vh] space-x-4 mb-2">

        </div>
        {totalInits !== 0 &&
        <div className="col-span-1 mt-2">
          <TableContainer elevation={12} component={Paper}>
            <Table className="table-auto w-full outline outline-3 bg-gray-100">
              <colgroup>
                <col style={{ width: '24vw' }} />
                <col style={{ width: '24vw' }} />
                <col style={{ width: '16vw' }} />
                <col style={{ width: '16vw' }} />
                <col style={{ width: '12vw' }} />
                <col style={{ width: '12vw' }} />
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
                    fontSize: tableHeaderFontSize,
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
                {displayItems.map((displayItem, index) => {
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
                          fontSize: tableCellFontSize,
                          fontFamily: "Arial, Helvetica",
                          color: "#21345b"
                        }
                      }}>
                        { isEdit ?
                          <>
                            <TableCell data-cy={InitiativeTableIds.companyName}>
                            {(userCompanyId !== IntegrityId || !props.addInitiative) &&
                              <>{displayItem.company.name}</>
                            }
                            {(userCompanyId === IntegrityId && props.addInitiative) &&
                              <>
                                <FormControl fullWidth>
                                  <InputLabel id="company-select-label">Select Company</InputLabel>
                                  <Select sx={{fontSize: tableCellFontSize}} data-cy={InitiativeTableIds.companySelect} labelId="company-select-label" label="Select company" value={companyToEditId} onChange={(e) => setCompanyToEditId(e.target.value)}>
                                    {
                                      props.companyList.map((company,index) => {
                                        return (
                                          <MenuItem sx={{fontSize: tableCellFontSize}} key={index} value={company.id}>
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
                              <Input sx={{fontSize: tableCellFontSize}} data-cy={InitiativeTableIds.editInitiativeTitle} value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)}/>
                            </TableCell>
                            <TableCell><DateInput cypressData={InitiativeTableIds.editStartDate} date={currentStartDate} setDate={setCurrentStartDate}/></TableCell>
                            <TableCell><DateInput cypressData={InitiativeTableIds.editTargetDate} date={currentTargetDate} setDate={setCurrentTargetDate}/></TableCell>
                            <TableCell>
                              <Input sx={{fontSize: tableCellFontSize}} data-cy={InitiativeTableIds.editTotalItems} type="number" value={currentTotalItems} onChange={(e) => setCurrentTotalItems(parseInt(e.target.value))}/>
                            </TableCell>
                            <TableCell sx={{fontSize: tableCellFontSize}} data-cy={InitiativeTableIds.remainingItems}>{displayItem.itemsRemaining}</TableCell>
                            <TableCell></TableCell>
                            <TableCell className="w-1/12">
                              <InitiativeActionsMenu cypressData={InitiativeTableIds.actionMenu} disabled={true} allCompanies={props.companyList} company={displayItem.company} initiative={displayItem} isAdmin={false}/>
                            </TableCell>
                            <TableCell className="w-1/12">
                              <IconButton data-cy={InitiativeTableIds.saveChangesButton} onClick={() => SaveEdit(props.companyList)}>
                                <DoneIcon sx={{fontSize: tableButtonFontSize}}/>
                              </IconButton>
                              <IconButton data-cy={InitiativeTableIds.cancelChangesButton} onClick={() => CancelEdit()}>
                                <CancelIcon sx={{fontSize: tableButtonFontSize}}/>
                              </IconButton>
                            </TableCell>
                          </>
                          :
                          <>
                            <TableCell data-cy={InitiativeTableIds.companyName} sx={{fontSize: tableCellFontSize}}>{displayItem.company.name}</TableCell>
                            <TableCell data-cy={InitiativeTableIds.initiativeTitle}>{displayItem.title}</TableCell>
                            <TableCell data-cy={InitiativeTableIds.startDate}>{displayItem.startDate.month + "/" + displayItem.startDate.day + "/" + displayItem.startDate.year}</TableCell>
                            <TableCell data-cy={InitiativeTableIds.targetDate}>{displayItem.targetDate.month + "/" + displayItem.targetDate.day + "/" + displayItem.targetDate.year}</TableCell>
                            <TableCell data-cy={InitiativeTableIds.totalItems}>{displayItem.totalItems}</TableCell>
                            <TableCell data-cy={InitiativeTableIds.remainingItems}>{displayItem.itemsRemaining}</TableCell>
                            <TableCell className={tooltipStyle} title={tooltipMessage}>{probability.value === undefined ? "NA" : probability.value + "%"}
                              <i className="material-icons" style={{ fontSize: '15px', marginLeft: '15px', marginTop: '10px' }}>info_outline</i>
                            </TableCell>
                            <TableCell className="w-1/12">
                              <InitiativeActionsMenu cypressData={InitiativeTableIds.actionMenu} allCompanies={props.companyList} company={displayItem.company} initiative={displayItem} isAdmin={isAdmin ?? false} size={tableButtonFontSize}/>
                            </TableCell>
                            {isAdmin &&
                              <TableCell className="w-1/12">
                                <IconButton data-cy={InitiativeTableIds.editButton} disabled={InEditMode()} onClick={() => EnterEditMode(displayItem.id, displayItem.company.id, displayItems, false)}>
                                  <EditIcon sx={{fontSize: tableButtonFontSize}} />
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
          <Paginator paginator={paginator}/>
        </div>}
      </div>
      {totalInits === 0 && initiativesLoaded === true && <div className="m-2 p-2 text-3xl font-bold">No Initiatives to Display</div>}
    </>
  )
}