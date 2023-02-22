import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser } from "../Store/UserSlice";

export default function DashboardPage(){
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  const company = companyList.find(e=>e.id === user?.companyId);

  function Dashboard(){
    if(company?.initiatives === undefined || company.initiatives.length === 0){
      
      return(
        <p className="text-4xl">No Current Initiatives</p>
      )
    }else{
      return(
        <p>this is where initiatives will go when we have them</p>
      )
    }
  }

  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-2">
        <p className="text-5xl py-[10px]">Dashboard</p>
      </div>
      <div className="flex justify-end col-span-2">
        <select className="outline rounded w-[200px] h-[40px]">
          <option>Select Initiative</option>
          {company?.initiatives.map((initiative,index)=>{
            return(
              <option>{initiative.title}</option>
            )
          })}
        </select>
      </div>
      <div className="col-span-4 h-[60vh] py-[10px] outline-dotted">
        <Dashboard/>
      </div>
    </div>
  )
}