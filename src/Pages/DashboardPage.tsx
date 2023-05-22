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
    <>
      <div className="flex col-span-4 bg-[#2ed7c3] py-6 px-5">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl font-bold w-full">Initiative Management</p>
          </div>
        </div>
      </div>
      <div className="my-[1%] mx-[2%] grid grid-cols-4">
        <div className="col-span-4 py-3">
          <Dashboard/>
        </div>
      </div>
    </>
  )
}