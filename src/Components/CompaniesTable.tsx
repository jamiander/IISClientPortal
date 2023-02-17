import { selectAllCompanies } from "../Store/CompanySlice"
import { useAppSelector } from "../Store/Hooks"

export default function CompaniesTable(){
  const companyList = useAppSelector(selectAllCompanies);
  return(
      <table className="table-auto w-[100%] outline">
      <thead>
        <tr>
          <th>Company Name</th>
          <th>Initiatives</th>
        </tr>
      </thead>
      <tbody>
        {companyList.map((company, index)=>{
          return(
            <tr key={index}>
              <td className="outline"><p className="flex justify-center">{company.name}</p></td>
              <td className="outline"><p className="flex justify-center">{company.initiatives}</p></td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}