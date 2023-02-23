import InitiativesTable from "../Components/InitiativesTable";
import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser } from "../Store/UserSlice";

export default function DashboardPage(){
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  const company = companyList.find(e=>e.id === user?.companyId);
  const tableDataStyle = "outline outline-1 text-center ";

  function Dashboard(){
    if(company?.initiatives === undefined || company.initiatives.length === 0){
      
      return(
        <p className="text-4xl">No Current Initiatives</p>
      )
    }else{
      return(
        <table className="table-auto w-[100%] outline outline-3">
          <thead className="outline outline-1">
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Target Completion</th>
              <th>Total Items</th>
              <th>Items Remaining</th>
              <th>Probability</th>
            </tr>
          </thead>
          <tbody>
            {
              company.initiatives.map((initiative, index) => {
                const itemsCompleted = initiative.itemsCompletedOnDate.map((item) => item.itemsCompleted);
                var total = 0;
                itemsCompleted.forEach((num) => total += num);
                return (
                  <tr key={index}>
                    <td className={tableDataStyle}>{initiative.id}</td>
                    <td className={tableDataStyle}>{initiative.title}</td>
                    <td className={tableDataStyle}>{initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year}</td>
                    <td className={tableDataStyle}>{initiative.totalItems}</td>
                    <td className={tableDataStyle}>{initiative.totalItems - total}</td>
                    <td></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
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
              <option key={index}>{initiative.title}</option>
            )
          })}
        </select>
      </div>
      <div className="col-span-4 h-[60vh] py-[10px]">
        <Dashboard/>
      </div>
    </div>
  )
}