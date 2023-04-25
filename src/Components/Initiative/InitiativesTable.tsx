import { Fragment, useEffect, useMemo, useState } from "react";
import { FindItemsRemaining } from "../../Services/CompanyService";
import { InitiativeFilter } from "../../Services/Filters";
import { Company, Initiative } from "../../Store/CompanySlice";
import { useAppSelector } from "../../Store/Hooks";
import { selectCurrentUser, User } from "../../Store/UserSlice";
import { EditInitiativeButton } from "./EditInitiativeButton";
import { defaultRowStyle, greenProbabilityStyle, inputStyle, redProbabilityStyle, TableHeaderStyle, tooltipStyle } from "../../Styles";
import { GenerateProbability } from "../../Services/ProbabilitySimulationService";
import { MakeDate } from "../DateInput";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';

export const InitiativeTableIds = {
  totalItems: 'initiativeTableTotalItems',
  remainingItems: 'initiativesTableRemainingItems',
  initiativeTitle: 'initiativesTableTitle',
  companyName: 'initiativesTableCompanyName',
  initiativeTitleFilter: "initiativesTableFilterTitle",
  companyNameFilter: "initiativesTableFilterCompanyName"
}

interface InitiativesProps {
  companyList: Company[],
  radioStatus: string,
  ValidateInitiative: (initiative: Initiative, companyId: number, allCompanies: Company[]) => {success: boolean, message: string}
  admin: boolean,
}

interface InitCompanyDisplay extends Initiative {
    company: Company,
    companyName: string,
    startDateTime: Date,
    targetDateTime: Date
  }

export default function InitiativesTable(props: InitiativesProps) {
    
  const [isCompanyHidden, setCompanyHidden] = useState(false);
  
  const [searchedComp, setSearchedComp] = useState('');
  const [searchedInit, setSearchedInit] = useState('');
  const [sortConfig, setSortConfig] = useState<Record<string, string>>({'': ''});

  const [sortedDisplayItems, setSortedDisplayItems] = useState<InitCompanyDisplay[]>([]);
  const [displayItems, setDisplayItems] = useState<InitCompanyDisplay[]>([])

  const resultsLimitOptions: number[] = [5, 10, 25];
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsLimit, setResultsLimit] = useState(10);

  let currentUser : User = useAppSelector(selectCurrentUser) ?? {id: -1, email: 'fake@fake', password: 'fake', companyId: -1};

  useEffect(() => {
    if (currentUser.id === 0) {
      setCompanyHidden(false);
    } else {
      setCompanyHidden(true);
    }
  }, [currentUser.id]);

  useEffect(() => {
    UpdateDisplayItems();
  },[props.companyList,searchedInit,searchedComp,props.radioStatus]);

  useMemo(() => {
    let sortedItems = JSON.parse(JSON.stringify(displayItems));
    sortedItems.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setSortedDisplayItems(sortedItems);
  }, [sortConfig, displayItems]);
  
  const requestSort = (key: string) => {
    let direction = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  }

  function UpdateDisplayItems()
  {
    const displayList: InitCompanyDisplay[] = []
    const filteredCompanies = (props.companyList.filter(e => e.name.toLowerCase().includes(searchedComp.toLowerCase()))).sort((a, b) => a.name.localeCompare(b.name));
  
    for(let company of filteredCompanies)
    {
      let initiatives = InitiativeFilter(company.initiatives.filter(e => e.title.toLowerCase().includes(searchedInit.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title)),props.radioStatus);
      initiatives.map((init) => { displayList.push({...init, companyName:company.name, company:company, startDateTime:MakeDate(init.startDate), targetDateTime:MakeDate(init.targetDate)}) });
    }
    setDisplayItems(displayList);
  }

  function getHealthIndicator(probability: number | undefined)
  {
    if (probability === undefined) return defaultRowStyle;
    if (probability < 50) return redProbabilityStyle;
    else if (probability > 90) return greenProbabilityStyle;
  }

  function ResetPageNumber()
  {
    setPageNumber(1);
  }

  const pageButtonStyle = "outline outline-[#445362] rounded bg-[#21345b] text-white transition ease-in-out hover:bg-white hover:text-[#445362] px-2";

  return (
    <div className="grid grid-cols-1 w-full h-auto">
      {props.admin &&
      <div className="col-span-1 h-[4vh] px-2 pb-[2%] space-x-2">
        <input id={InitiativeTableIds.initiativeTitleFilter} className={inputStyle} type={'text'} placeholder="Filter by Title" onChange={(e) => setSearchedInit(e.target.value)}/>
        <input id={InitiativeTableIds.companyNameFilter} className={inputStyle} type={'text'} placeholder="Filter by Company" onChange={(e) => setSearchedComp(e.target.value)}/>
      </div>
      }
      <div className="col-span-1 py-[2%]">
        <TableContainer component={Paper}>
        <Table className="table-auto w-full outline outline-3 bg-gray-100">
          <TableHead className="outline outline-1">
          <link href = "https://fonts.googleapis.com/icon?family=Material+Icons" rel = "stylesheet"/> 
            <TableRow sx={{
                borderBottom: "2px solid black",
                "& th": {
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  fontFamily: "Arial, Helvetica" 
                }
              }}>
              <TableHeaderStyle>Title
                <TableSortLabel onClick={() => requestSort('title')} active={true} direction={sortConfig.direction === 'descending' ? 'desc' : 'asc'}>
                  </TableSortLabel>
              </TableHeaderStyle>
              <TableHeaderStyle hidden={isCompanyHidden}>Company
              <TableSortLabel onClick={() => requestSort('companyName')} active={true} direction={sortConfig.direction === 'descending' ? 'desc' : 'asc'}>
                </TableSortLabel></TableHeaderStyle>
              <TableHeaderStyle>Start Date
              <TableSortLabel onClick={() => requestSort('startDateTime')} active={true} direction={sortConfig.direction === 'descending' ? 'desc' : 'asc'}>
                </TableSortLabel></TableHeaderStyle>
              <TableHeaderStyle >Target Completion
              <TableSortLabel onClick={() => requestSort('targetDateTime')} active={true} direction={sortConfig.direction === 'descending' ? 'desc' : 'asc'}>
              </TableSortLabel></TableHeaderStyle>
              <TableHeaderStyle >Total Items</TableHeaderStyle>
              <TableHeaderStyle >Items Remaining</TableHeaderStyle>
              <TableHeaderStyle >Probability</TableHeaderStyle>
              <TableHeaderStyle hidden={!props.admin}>Edit</TableHeaderStyle>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              sortedDisplayItems.map((displayItem,index) => {
                if (index < resultsLimit*pageNumber && index >= resultsLimit*(pageNumber-1))
                { 
                  let itemsRemaining = FindItemsRemaining(displayItem);
                  let probability = GenerateProbability(displayItem, itemsRemaining);
                  let healthIndicator = getHealthIndicator(probability.value);
                  let tooltipMessage = probability.value === undefined ? probability.status : 
                  probability.value === 0 ? "Data may be insufficient or may indicate a very low probability of success" : 
                  probability.value + "%";
                  return(
                    <Fragment key={index}>
                      <TableRow key={index} className={healthIndicator} sx={{
                        borderBottom: "1px solid black",
                          "& td": {
                            fontSize: "1.1rem",
                            fontFamily: "Arial, Helvetica" 
                          }
                        }}>
                        <TableCell id={InitiativeTableIds.initiativeTitle}>{displayItem.title}</TableCell>
                        <TableCell id={InitiativeTableIds.companyName} hidden={isCompanyHidden}>{displayItem.companyName}</TableCell>
                        <TableCell>{displayItem.startDate.month + "/" + displayItem.startDate.day + "/" + displayItem.startDate.year}</TableCell>
                        <TableCell>{displayItem.targetDate.month + "/" + displayItem.targetDate.day + "/" + displayItem.targetDate.year}</TableCell>
                        <TableCell id={InitiativeTableIds.totalItems}>{displayItem.totalItems}</TableCell>
                        <TableCell id={InitiativeTableIds.remainingItems}>{itemsRemaining}</TableCell>
                        <TableCell className={tooltipStyle} title={tooltipMessage}>{ probability.value === undefined ? "NA"  : probability.value +  "%" }
                          <i className="material-icons" style={{fontSize: '15px', marginLeft: '15px', marginTop: '10px'}}>info_outline</i>
                        </TableCell>
                        <TableCell className="w-1/12" hidden={!props.admin}><EditInitiativeButton company={displayItem.company} initiative={displayItem} index={index} ValidateInitiative={props.ValidateInitiative} /></TableCell>
                      </TableRow>
                    </Fragment>
                  )
                }
              })
            }
          </TableBody>
        </Table>
        </TableContainer>
        {props.admin &&
        <div className="flex p-2 items-center">
          <p>Results Per Page</p>
          <select value={resultsLimit} onChange={(e) => { setResultsLimit(parseInt(e.target.value)); ResetPageNumber()}}
            className='mx-2 rounded-md border border-gray-200 hover:bg-gray-100'>
            {resultsLimitOptions.map((limit,index) => {
              return (
                <option key={index} value={limit}>
                  {limit}
                </option>
              )
            })}
          </select>
          <div className="flex pl-2">
            <button className={pageButtonStyle} onClick={() => {setPageNumber(Math.max(pageNumber-1,1))}}>{"<"}</button>
            <p className='px-2'>Page: {pageNumber}</p>
            <button className={pageButtonStyle} onClick={() => {setPageNumber(pageNumber+1)}}>{">"}</button>
          </div>
        </div>
        }
      </div>
    </div>
  )
}