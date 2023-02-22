import { Company } from "../Store/CompanySlice";
import { useAppDispatch } from "../Store/Hooks";

interface InitiativesProps {
  companyList: Company[]
}

export default function InitiativesTable(props: InitiativesProps) {
  const dispatch = useAppDispatch();
  const initiatives = props.companyList.map((company) => 
    company.initiatives
  ).flat();
  console.log(initiatives);
  
  return (
    <table className="table-auto w-[100%] outline outline-3">
      <thead className="outline outline-1">
        <tr>
          <th>Initiative Id</th>
          <th>Title</th>
          <th>Target Date</th>
          <th>Total Items</th>
          <th>Items Remaining</th>
        </tr>
      </thead>
      <tbody>
        {
          initiatives.map((init, index) => {
            const style = "outline outline-1 text-center ";
            return (
              <tr key={index}>
                {/* <td className={style}>Company Name</td> */}
                <td className={style}>{init.id}</td>
                <td className={style}>{init.title}</td>
                <td className={style}>{init.targetDate.month + "/" + init.targetDate.day + "/" + init.targetDate.year}</td>
                <td className={style}>{init.totalItems}</td>
                {/* <td className={style}>{init.ItemsRemaining}</td> */}
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}