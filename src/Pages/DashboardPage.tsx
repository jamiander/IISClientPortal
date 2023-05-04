import ManageInitiativesDisplay from "../Components/Initiative/ManageInitiativesDisplay";

export const InitiativeDashboardRadioIds = {
  all: "initDashboardShowAll",
  active: "initDashboardShowActive",
  inactive: "initDashboardShowInactive"
}

export default function DashboardPage(){
  function Dashboard(){
    
      return(
        <>
          <ManageInitiativesDisplay/>
        </>
      )
    
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