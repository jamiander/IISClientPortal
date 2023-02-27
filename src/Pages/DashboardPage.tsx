import InitiativesTable from "../Components/Initiative/InitiativesTable";
import ValidateNewInitiative from "../Services/ValidateNewInitiative";
import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser } from "../Store/UserSlice";

export default function DashboardPage(){
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  const company = companyList.find(e=>e.id === user?.companyId);
  const comp = useAppSelector(selectAllCompanies).filter((company) => company.id === user?.companyId);
  const tableDataStyle = "outline outline-1 text-center ";

  function Dashboard(){
    if(company?.initiatives === undefined || company.initiatives.length === 0){
      
      return(
        <p className="text-4xl">No Current Initiatives</p>
      )
    }else{
      return(
        <InitiativesTable companyList={comp} radioStatus={'active'} ValidateInitiative={ValidateNewInitiative}/>
      )
    }
  }

  return(
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
      <div className="col-span-2 mb-4">
        <p className="text-5xl">Dashboard</p>
      </div>
      {/*<div className="flex justify-end col-span-2">
        <select className="outline rounded w-[200px] h-[40px]">
          <option>Select Initiative</option>
          {company?.initiatives.map((initiative,index)=>{
            return(
              <option key={index}>{initiative.title}</option>
            )
          })}
        </select>  This select isn't needed in the current version of the project but will be when we want to display more information
      </div>*/}
      <div className="col-span-4 bg-[#2ed7c3] rounded-md p-2 pl-5">
        <p className="text-3xl h-[90%]">Company Initiatives</p>
      </div>
      <div className="col-span-4 h-[60vh] py-3">
        <Dashboard/>
      </div>
    </div>
  )
}