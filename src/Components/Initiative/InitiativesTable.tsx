import { Fragment, useEffect, useMemo, useState } from "react";
import { FindItemsRemaining } from "../../Services/CompanyService";
import { InitiativeFilter } from "../../Services/Filters";
import { Company, Initiative } from "../../Store/CompanySlice";
import { useAppSelector } from "../../Store/Hooks";
import { selectCurrentUser, User } from "../../Store/UserSlice";
import { EditInitiativeButton } from "./EditInitiativeButton";
import { greenProbabilityStyle, inputStyle, redProbabilityStyle } from "../../Styles";
import { GenerateProbability } from "../../Services/ProbabilitySimulationService";
import { MakeDate } from "../DateInput";

export const InitiativeTableIds = {
  totalItems: 'totalItems',
  remainingItems: 'remainingItems',
  initiativeTitle: 'initiativeTitle',
  companyName: 'companyName'
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
  const tableHeaderStyle = "px-2 ";
  const tableDataStyle = "outline outline-1 text-center ";
  const [isCompanyHidden, setCompanyHidden] = useState(false);
  
  const [searchedComp, setSearchedComp] = useState('');
  const [searchedInit, setSearchedInit] = useState('');
  const [sortConfig, setSortConfig] = useState<Record<string, string>>({'': ''});

  const [sortedDisplayItems, setSortedDisplayItems] = useState<InitCompanyDisplay[]>([]);
  const [displayItems, setDisplayItems] = useState<InitCompanyDisplay[]>([])

  const resultsLimitOptions: number[] = [5, 10, 25];
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsLimit, setResultsLimit] = useState(10);


  const filteredCompanies = (props.companyList.filter(e => e.name.toLowerCase().includes(searchedComp.toLowerCase()))).sort((a, b) => a.name.localeCompare(b.name));
  
  let currentUser : User = useAppSelector(selectCurrentUser) ?? {id: -1, email: 'fake@fake', password: 'fake', companyId: -1};

  useEffect(() => {
    if (currentUser.id === 0) {
      setCompanyHidden(false);
    } else {
      setCompanyHidden(true);
    }
  }, [currentUser.id]);

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
    console.log(key)
    console.log(direction)
    setSortConfig({ key, direction });
  }
    

  function getHealthIndicator(probability: number | undefined)
  {
    if (probability === undefined) return;
    if (probability < 50) return redProbabilityStyle;
    else if (probability > 90) return greenProbabilityStyle;
  }

  function ResetPageNumber()
  {
    setPageNumber(1);
  }

  const pageButtonStyle = "outline outline-[#445362] rounded bg-[#21345b] text-white transition ease-in-out hover:bg-white hover:text-[#445362] px-2";

  function UpdateDisplayItems()
  {
    const displayList: InitCompanyDisplay[] = []
    for(let company of filteredCompanies)
    {
      let initiatives = InitiativeFilter(company.initiatives.filter(e => e.title.toLowerCase().includes(searchedInit.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title)),props.radioStatus);
      initiatives.map((init) => { displayList.push({...init, companyName:company.name, company:company, startDateTime:MakeDate(init.startDate), targetDateTime:MakeDate(init.targetDate)}) });
    }
    setDisplayItems(displayList);
  }

  useEffect(() => {
    UpdateDisplayItems();
  },[props.companyList])

  return (
    <div className="grid grid-cols-1 w-full h-auto">
      {props.admin &&
      <div className="col-span-1 h-[4vh] px-2 pb-[2%] space-x-2">
        <input className={inputStyle} type={'text'} placeholder="Filter by Title" onChange={(e) => setSearchedInit(e.target.value)}/>
        <input className={inputStyle} type={'text'} placeholder="Filter by Company" onChange={(e) => setSearchedComp(e.target.value)}/>
      </div>
      }
      <div className="col-span-1 py-[2%]">
        <table className="table-auto w-full outline outline-3 bg-gray-100">
          <thead className="outline outline-1">
          <link href = "https://fonts.googleapis.com/icon?family=Material+Icons" rel = "stylesheet"/> 
            <tr>
              <th className={tableHeaderStyle}>Title
              <button className="sort-by" onClick={() => requestSort('title')}>
                </button></th>
              <th className={tableHeaderStyle} hidden={isCompanyHidden}>Company
                <button className="sort-by" onClick={() => requestSort('companyName')}>
                </button></th>
              <th className={tableHeaderStyle}>Start Date
              <button className="sort-by" onClick={() => requestSort('startDateTime')}>
                </button></th>
              <th className={tableHeaderStyle}>Target Completion
              <button className="sort-by" onClick={() => requestSort('targetDateTime')}>
                </button></th>
              <th className={tableHeaderStyle}>Total Items</th>
              <th className={tableHeaderStyle}>Items Remaining</th>
              <th className={tableHeaderStyle}>Probability</th>
              <th className={tableHeaderStyle} hidden={!props.admin}>Edit</th>
            </tr>
          </thead>
          <tbody>
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
                      <tr key={index} className={healthIndicator}>
                        <td id={InitiativeTableIds.initiativeTitle} className={tableDataStyle}>{displayItem.title}</td>
                        <td id={InitiativeTableIds.companyName} className={tableDataStyle} hidden={isCompanyHidden}>{displayItem.companyName}</td>
                        <td className={tableDataStyle}>{displayItem.startDate.month + "/" + displayItem.startDate.day + "/" + displayItem.startDate.year}</td>
                        <td className={tableDataStyle}>{displayItem.targetDate.month + "/" + displayItem.targetDate.day + "/" + displayItem.targetDate.year}</td>
                        <td id={InitiativeTableIds.totalItems} className={tableDataStyle}>{displayItem.totalItems}</td>
                        <td id={InitiativeTableIds.remainingItems} className={tableDataStyle}>{itemsRemaining}</td>
                        <td className={tableDataStyle + " tooltipStyle"} title={tooltipMessage}>{ probability.value === undefined ? "NA"  : probability.value +  "%" }
                          <i className="material-icons max-w-24px max-h-24px">info_outline</i>
                          </td>
                        <td className={tableDataStyle + " w-1/12"} hidden={!props.admin}><EditInitiativeButton company={displayItem.company} initiative={displayItem} index={index} ValidateInitiative={props.ValidateInitiative} /></td>
                      </tr>
                    </Fragment>
                  )
                }
              })
            }
          </tbody>
        </table>
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