import { useState } from "react";
import InitiativesTable from "../Components/Initiative/InitiativesTable";
import { RadioSet } from "../Components/RadioSet";
import ValidateNewInitiative from "../Services/Validation";
import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser } from "../Store/UserSlice";

export const InitiativeDashboardRadioIds = {
  all: "initDashboardShowAll",
  active: "initDashboardShowActive",
  inactive: "initDashboardShowInactive"
}

export default function DashboardPage(){
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  const company = companyList.find(c => c.id === user?.companyId);
  const comp = useAppSelector(selectAllCompanies).filter((company) => company.id === user?.companyId);
  const [radioValue, setRadioValue] = useState("active");

  function Dashboard(){
    if(companyList.flatMap(c => c.initiatives).length === 0){
      
      return(
        <p className="text-4xl">No Current Initiatives</p>
      )
    }else{
      return(
        <>
          <InitiativesTable companyList={companyList} pageNumber={1} radioStatus={radioValue} ValidateInitiative={ValidateNewInitiative} admin={false}/>
        </>
      )
    }
  }

  return(
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
      <div className="col-span-4 mb-4">
        <p className="text-5xl font-bold bg-[#2ed7c3] rounded-md py-6 px-5">Dashboard</p>
      </div>
      <div className="col-span-4 bg-[#445362] rounded-md py-3 pl-5">
        <p className="text-3xl text-white">{company?.name} Initiatives</p>
        <RadioSet options={[
            {id: InitiativeDashboardRadioIds.all, label: "Show All", value: "all"},
            {id: InitiativeDashboardRadioIds.active, label: "Only Active", value: "active", default: true},
            {id: InitiativeDashboardRadioIds.inactive, label: "Only Inactive", value: "inactive"}
            ]} 
            setter={setRadioValue} name="dashboardInitiatives"/>
      </div>
      <div className="col-span-4 py-3">
        <Dashboard/>
      </div>
    </div>
  )
}