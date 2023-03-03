import { Fragment, useEffect, useState } from "react";
import { FindItemsRemaining } from "../../Services/CompanyService";
import { InitiativeFilter } from "../../Services/Filters";
import { Company, Initiative } from "../../Store/CompanySlice";
import { useAppSelector } from "../../Store/Hooks";
import { selectCurrentUser, User } from "../../Store/UserSlice";
import { EditInitiativeButton } from "./EditInitiativeButton";

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
}

export default function InitiativesTable(props: InitiativesProps) {
  const tableDataStyle = "outline outline-1 text-center ";

  const [isCompanyHidden, setCompanyHidden] = useState(false);
  
  const [searchedComp, setSearchedComp] = useState('');
  const [searcehdInit, setSearchedInit] = useState('');

  const filteredCompanies = props.companyList.filter(e => e.name.toLowerCase().includes(searchedComp.toLowerCase()))

  let currentUser : User = useAppSelector(selectCurrentUser) ?? {id: -1, email: 'fake@fake', password: 'fake', companyId: -1};
  useEffect(() => {
    if (currentUser.id === 0) {
      setCompanyHidden(false);
    } else {
      setCompanyHidden(true);
    }
  }, [currentUser.id]);
  
  return (
    <div className="grid grid-cols-1 w-full h-auto">
      <div className="col-span-1 h-[4vh] px-2 pb-[2%] space-x-2">
        <input className="rounded outline outline-1 p-2 " type={'text'} placeholder="Filter by Title" onChange={(e)=> setSearchedInit(e.target.value)}/>
        <input hidden={isCompanyHidden} className="rounded outline outline-1 p-2" type={'text'} placeholder="Filter by Company" onChange={(e)=> setSearchedComp(e.target.value)}/>
      </div>
      <div className="col-span-1 py-[2%]">
        <table className="table-auto w-[98%] outline outline-3">
          <thead className="outline outline-1">
            <tr>
              <th className="w-8">Id</th>
              <th>Title</th>
              <th hidden={isCompanyHidden}>Company</th>
              <th>Target Completion</th>
              <th>Total Items</th>
              <th>Items Remaining</th>
              <th>Probability</th>
              <th hidden={isCompanyHidden}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredCompanies.map((company, index) => {
                const filteredInits = company.initiatives.filter(e => e.title.toLowerCase().includes(searcehdInit.toLowerCase()))
                return (
                  (props.radioStatus !== 'all' ? InitiativeFilter(filteredInits, props.radioStatus) : company.initiatives).map((initiative, index) => {
                    let itemsRemaining = FindItemsRemaining(initiative);
                    return (
                      <Fragment key={index}>
                        <tr key={index}>
                          <td className={tableDataStyle + ' p-1'}>{initiative.id}</td>
                          <td id={InitiativeTableIds.initiativeTitle} className={tableDataStyle}>{initiative.title}</td>
                          <td id={InitiativeTableIds.companyName} className={tableDataStyle} hidden={isCompanyHidden}>{company.name}</td>
                          <td className={tableDataStyle}>{initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year}</td>
                          <td id={InitiativeTableIds.totalItems} className={tableDataStyle}>{initiative.totalItems}</td>
                          <td id={InitiativeTableIds.remainingItems} className={tableDataStyle}>{itemsRemaining}</td>
                          <td className={tableDataStyle}></td>
                          <td className={tableDataStyle} hidden={isCompanyHidden}><EditInitiativeButton company={company} initiative={initiative} index={index} ValidateInitiative={props.ValidateInitiative} /></td>
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