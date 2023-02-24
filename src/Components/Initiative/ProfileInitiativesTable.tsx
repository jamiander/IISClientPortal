import { selectAllCompanies } from "../../Store/CompanySlice";
import { useAppSelector } from "../../Store/Hooks";
import { selectCurrentUser } from "../../Store/UserSlice";

export default function ProfileInitiativesTable(){
    const user = useAppSelector(selectCurrentUser);
    const companyList = useAppSelector(selectAllCompanies);
    const company = companyList.find(e=>e.id === user?.companyId);

    return(
        <table className="table-auto w-[100%] outline">
          <thead>
            <tr>
              <th>Initiative</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {company?.initiatives.map((initiative, index)=>{
              return(
                <tr key={index}>
                  <td className="outline"><p className="flex justify-center">{initiative.title}</p></td>
                  <td className="outline"><p className="flex justify-center">placeholder</p></td>
                </tr>
              )
            })}
          </tbody>
        </table>
    )
}