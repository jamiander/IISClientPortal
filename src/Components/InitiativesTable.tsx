import { Company } from "../Store/CompanySlice";
import { useAppDispatch } from "../Store/Hooks";

interface InitiativesProps {
  companyList: Company[]
}

export default function InitiativesTable(props: InitiativesProps) {
  const dispatch = useAppDispatch();
  const tableDataStyle = "outline outline-1 text-center ";
  const companies = props.companyList.map((company) => {
      return {'init': company.initiatives, 'name': company.name };
    }
  );
  
  return (
    <table className="table-auto w-[100%] outline outline-3">
      <thead className="outline outline-1">
        <tr>
          <th>Company Name</th>
          <th>Initiative Id</th>
          <th>Title</th>
          <th>Target Date</th>
          <th>Total Items</th>
          <th>Items Remaining</th>
        </tr>
      </thead>
      <tbody>
        {
          companies.map((company, index) => {
            return (
              company.init.map((initiative, index) => {
                return (
                  <tr key={index}>
                    <td className={tableDataStyle}>{company.name}</td>
                    <td className={tableDataStyle}>{initiative.id}</td>
                    <td className={tableDataStyle}>{initiative.title}</td>
                    <td className={tableDataStyle}>{initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year}</td>
                    <td className={tableDataStyle}>{initiative.totalItems}</td>
                    {/* <td className={tableDataStyle}>{initiative.ItemsRemaining}</td> */}
                  </tr>
                )
              })
            )
          })
        }
      </tbody>
    </table>
  )
}