import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser } from "../Store/UserSlice";

export default function DashboardPage(){
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  const company = companyList.find(e=>e.id === user?.companyId);
    
  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-2">
        <p className="text-5xl py-[10px]">Dashboard</p>
      </div>
      <div className="flex justify-end col-span-2">
        <select className="outline rounded w-[200px] h-[40px]">
          <option>Select Initiative</option>
          {company?.initiatives?.map((initiative)=>{
            return(
              <option>{initiative}</option>
            )
          })}
        </select>
      </div>
      <div className="col-span-4 h-[60vh] py-[10px] outline-dotted">
        this is where the data will go.
        the outline is there so we know how much space it takes up
      </div>
    </div>
  )
}