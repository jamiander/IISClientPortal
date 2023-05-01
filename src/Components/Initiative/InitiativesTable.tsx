import { Fragment, useEffect, useMemo, useState } from "react";
import { FindItemsRemaining } from "../../Services/CompanyService";
import { InitiativeFilter } from "../../Services/Filters";
import { Company, Initiative } from "../../Store/CompanySlice";
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
import { ViewDecisionDataButton } from "./ViewDecisionDataButton";
import Pagination from "@mui/material/Pagination";

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
  pageNumber: number,
  radioStatus: string,
  ValidateInitiative: (initiative: Initiative, companyId: number, allCompanies: Company[]) => {success: boolean, message: string}
  admin: boolean
}

interface InitCompanyDisplay extends Initiative {
    company: Company,
    companyName: string,
    startDateTime: Date,
    targetDateTime: Date,
    probabilityValue: number | undefined,
    probabilityStatus: string,
    itemsRemaining: number
  }

export default function InitiativesTable(props: InitiativesProps) {
  
  const [searchedComp, setSearchedComp] = useState('');
  const [searchedInit, setSearchedInit] = useState('');
  const [sortConfig, setSortConfig] = useState<Record<string, string>>({'': ''});

  const [sortedDisplayItems, setSortedDisplayItems] = useState<InitCompanyDisplay[]>([]);
  const [displayItems, setDisplayItems] = useState<InitCompanyDisplay[]>([])

  const resultsLimitOptions: number[] = [5, 10, 25];
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsLimit, setResultsLimit] = useState(10);
  const pageNumbers: number[] = [];

  useEffect(() => {
    UpdateDisplayItems();
  },[props.companyList,searchedInit,searchedComp,props.radioStatus]);

  function Define(value: string | number) : string | number
  {
    if(value === undefined)
    {
      if(typeof(value) === 'string')
        value = "";
      else
        value = -0.00001;
    }
    return value;
  }

  useMemo(() => {
    let sortedItems = JSON.parse(JSON.stringify(displayItems));
    sortedItems.sort((a: any, b: any) => {
      let aValue = Define(a[sortConfig.key]);
      let bValue = Define(b[sortConfig.key]);

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
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
      initiatives.map((init) => {
        let itemsRemaining = FindItemsRemaining(init);
        let probability = GenerateProbability(init, itemsRemaining);
        displayList.push({...init, companyName:company.name, company:company, startDateTime:MakeDate(init.startDate), targetDateTime:MakeDate(init.targetDate), itemsRemaining:itemsRemaining, probabilityValue:probability.value, probabilityStatus:probability.status})
      });
    }
    setDisplayItems(displayList);
    ResetPageNumber();
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

  const indexOfLastItem = pageNumber * resultsLimit;
  const indexOfFirstItem = indexOfLastItem - resultsLimit;
  const currentItems = sortedDisplayItems.slice(indexOfFirstItem, indexOfLastItem);
  const count = Math.ceil(sortedDisplayItems.length/resultsLimit);

  const handleChange = (event: any, value: any) => {
    setPageNumber(value);
};

  return (
    <div className="grid grid-cols-1 w-full h-auto">
      {props.admin &&
      <div className="col-span-1 h-[4vh] px-2 pb-[2%] space-x-2">
        <input id={InitiativeTableIds.initiativeTitleFilter} className={inputStyle} type={'text'} placeholder="Filter by Title" onChange={(e) => setSearchedInit(e.target.value)}/>
        <input id={InitiativeTableIds.companyNameFilter} className={inputStyle} type={'text'} placeholder="Filter by Company" onChange={(e) => setSearchedComp(e.target.value)}/>
      </div>
      }
      <div className="col-span-1 py-[2%]">
      <link href = "https://fonts.googleapis.com/icon?family=Material+Icons" rel = "stylesheet"/> 
        <TableContainer component={Paper}>
        <Table className="table-auto w-full outline outline-3 bg-gray-100">
          <TableHead className="outline outline-1">
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
              {props.admin && <TableHeaderStyle>Company
                <TableSortLabel onClick={() => requestSort('companyName')} active={true} direction={sortConfig.direction === 'descending' ? 'desc' : 'asc'}>
                </TableSortLabel>
              </TableHeaderStyle>}
              <TableHeaderStyle>Start Date
                <TableSortLabel onClick={() => requestSort('startDateTime')} active={true} direction={sortConfig.direction === 'descending' ? 'desc' : 'asc'}>
                </TableSortLabel>
              </TableHeaderStyle>
              <TableHeaderStyle>Target Completion
                <TableSortLabel onClick={() => requestSort('targetDateTime')} active={true} direction={sortConfig.direction === 'descending' ? 'desc' : 'asc'}>
                </TableSortLabel>
              </TableHeaderStyle>
              <TableHeaderStyle>Total Items</TableHeaderStyle>
              <TableHeaderStyle>Items Remaining</TableHeaderStyle>
              <TableHeaderStyle>Probability
                <TableSortLabel onClick={() => requestSort('probabilityValue')} active={true} direction={sortConfig.direction === 'descending' ? 'desc' : 'asc'}>
                </TableSortLabel>
              </TableHeaderStyle>
              {props.admin && <TableHeaderStyle>View Decisions</TableHeaderStyle>}
              {props.admin && <TableHeaderStyle>Edit</TableHeaderStyle>}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              currentItems.map((displayItem,index) => {
                let probability = {value:displayItem.probabilityValue, status:displayItem.probabilityStatus};
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
                        {props.admin && <TableCell id={InitiativeTableIds.companyName}>{displayItem.companyName}</TableCell>}
                        <TableCell>{displayItem.startDate.month + "/" + displayItem.startDate.day + "/" + displayItem.startDate.year}</TableCell>
                        <TableCell>{displayItem.targetDate.month + "/" + displayItem.targetDate.day + "/" + displayItem.targetDate.year}</TableCell>
                        <TableCell id={InitiativeTableIds.totalItems}>{displayItem.totalItems}</TableCell>
                        <TableCell id={InitiativeTableIds.remainingItems}>{displayItem.itemsRemaining}</TableCell>
                        <TableCell className={tooltipStyle} title={tooltipMessage}>{ probability.value === undefined ? "NA"  : probability.value +  "%" }
                          <i className="material-icons" style={{fontSize: '15px', marginLeft: '15px', marginTop: '10px'}}>info_outline</i>
                        </TableCell>
                        {props.admin && <TableCell className="w-1/12">
                          <ViewDecisionDataButton company={displayItem.company} initiative={displayItem} index={index}/>
                        </TableCell>}
                        {props.admin && <TableCell className="w-1/12">
                          <EditInitiativeButton company={displayItem.company} initiative={displayItem} index={index} ValidateInitiative={props.ValidateInitiative} />
                        </TableCell>}
                      </TableRow>
                    </Fragment>
                  )
                }
              )
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
            <Pagination
            className="my-3"
            count={count}
            page={pageNumber}
            variant="outlined"
            shape="rounded"
            onChange={handleChange}
          />
          </div>
        </div>
        }
      </div>
    </div>
  )
}