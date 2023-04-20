import { Fragment, useEffect, useState } from "react";
import { DateInfo, FindItemsRemaining } from "../../Services/CompanyService";
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
  ValidateInitiative : (initiative: Initiative, companyId: number, allCompanies: Company[]) => {success: boolean, message: string}
  admin:boolean,
}

export default function InitiativesTable(props: InitiativesProps) {
  const tableDataStyle = "outline outline-1 text-center ";
  const [isCompanyHidden, setCompanyHidden] = useState(false);
  
  const [searchedComp, setSearchedComp] = useState('');
  const [searcehdInit, setSearchedInit] = useState('');

  const filteredCompanies = (props.companyList.filter(e => e.name.toLowerCase().includes(searchedComp.toLowerCase()))).sort((a, b) => a.name.localeCompare(b.name));

  let currentUser : User = useAppSelector(selectCurrentUser) ?? {id: -1, email: 'fake@fake', password: 'fake', companyId: -1};
  useEffect(() => {
    if (currentUser.id === 0) {
      setCompanyHidden(false);
    } else {
      setCompanyHidden(true);
    }
  }, [currentUser.id]);

  function getHealthIndicator(probability: number | undefined)
  {
    if (probability === undefined) return;
    if (probability < 50) return redProbabilityStyle;
    else if (probability > 90) return greenProbabilityStyle;
  }
  
  return (
    <div className="grid grid-cols-1 w-full h-auto">
      {props.admin &&
      <div className="col-span-1 h-[4vh] px-2 pb-[2%] space-x-2">
        <input className={inputStyle} type={'text'} placeholder="Filter by Title" onChange={(e)=> setSearchedInit(e.target.value)}/>
        <input className={inputStyle} type={'text'} placeholder="Filter by Company" onChange={(e)=> setSearchedComp(e.target.value)}/>
      </div>
      }
      <div className="col-span-1 py-[2%]">
        <table className="table-auto w-full outline outline-3 bg-gray-100">
          <thead className="outline outline-1">
            <tr>
              <th>Title</th>
              <th hidden={isCompanyHidden}>Company</th>
              <th>Start Date</th>
              <th>Target Completion</th>
              <th>Total Items</th>
              <th>Items Remaining</th>
              <th>Probability</th>
              <th hidden={!props.admin}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredCompanies.map((company) => {
                const filteredInits = company.initiatives.filter(e => e.title.toLowerCase().includes(searcehdInit.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title))
                return (
                  InitiativeFilter(filteredInits, props.radioStatus).map((initiative, index) => {
                      let itemsRemaining = FindItemsRemaining(initiative);
                      let probability = GenerateProbability(initiative, itemsRemaining);
                      let healthIndicator = getHealthIndicator(probability.value);
                      let tooltipMessage = probability.value === undefined ? probability.status : 
                      probability.value === 0 ? "Data may be insufficient or may indicate a very low probability of success" : 
                      probability.value + "%";

                      return (
                      <Fragment key={index}>
                        <tr key={index} className={healthIndicator}>
                          <td id={InitiativeTableIds.initiativeTitle} className={tableDataStyle}>{initiative.title}</td>
                          <td id={InitiativeTableIds.companyName} className={tableDataStyle} hidden={isCompanyHidden}>{company.name}</td>
                          <td className={tableDataStyle}>{initiative.startDate.month + "/" + initiative.startDate.day + "/" + initiative.startDate.year}</td>
                          <td className={tableDataStyle}>{initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year}</td>
                          <td id={InitiativeTableIds.totalItems} className={tableDataStyle}>{initiative.totalItems}</td>
                          <td id={InitiativeTableIds.remainingItems} className={tableDataStyle}>{itemsRemaining}</td>
                          <td className={tableDataStyle + "tooltipStyle"} title={tooltipMessage}>{ probability.value === undefined ? "NA"  : probability.value +  "%" }</td>
                          <td className={tableDataStyle + " w-1/12"} hidden={!props.admin}><EditInitiativeButton company={company} initiative={initiative} index={index} ValidateInitiative={props.ValidateInitiative} /></td>
                        </tr>
                      </Fragment>
                    )
                  })
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}