import { selectAllCompanies } from "../Store/CompanySlice"
import { useAppSelector } from "../Store/Hooks"

export default function CompaniesTable(){
  const companyList = useAppSelector(selectAllCompanies);
  return(
      <table className="table-auto w-[100%] outline outline-3">
      <thead className="outline outline-1">
        <tr>
          <th>Company Name</th>
          <th>Initiatives</th>
        </tr>
      </thead>
      <tbody>
        {companyList.map((company, index)=>{
          return(
            <tr key={index}>
              <td className="outline outline-1"><p className="flex justify-center">{company.name}</p></td>
              {company.initiatives.map((init, jndex) => {
                return (
                  <td className="outline outline-1"><p className="flex justify-center">{init.title}</p></td>
                )})
              }
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}