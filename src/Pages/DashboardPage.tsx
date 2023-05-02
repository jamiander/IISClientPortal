import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser } from "../Store/UserSlice";
import ManageInitiativesDisplay from "../Components/Initiative/ManageInitiativesDisplay";

export const InitiativeDashboardRadioIds = {
  all: "initDashboardShowAll",
  active: "initDashboardShowActive",
  inactive: "initDashboardShowInactive"
}

export default function DashboardPage(){
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  
  function Dashboard(){
    if(companyList.flatMap(c => c.initiatives).length === 0){
      
      return(
        <p className="text-4xl">No Current Initiatives</p>
      )
    }else{
      return(
        <>
          <ManageInitiativesDisplay/>
        </>
      )
    }
  }

  return(
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
      <div className="col-span-4 mb-4">
        <p className="text-5xl font-bold bg-[#2ed7c3] rounded-md py-6 px-5">Dashboard</p>
      </div>
      <div className="col-span-4 py-3">
        <Dashboard/>
      </div>
    </div>
  )
}