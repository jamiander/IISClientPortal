import { useState } from "react";
import { selectAllCompanies } from "../../Store/CompanySlice";
import { useAppSelector } from "../../Store/Hooks"
import { selectCurrentUser } from "../../Store/UserSlice"

export default function ProfileTable(){
    const user = useAppSelector(selectCurrentUser);
    const companyList = useAppSelector(selectAllCompanies);
    const company = companyList.find(e=>e.id === user?.companyId);
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordShown(passwordShown ? false : true);
    };
    
    return(
        <table className="table-auto w-[100%] outline outline-3">
          <thead className="outline outline-1">
            <tr>
              <th>Company</th>
              {/*<th>Name</th>*/}
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="outline outline-1"><p className="flex justify-center">{company?.name}</p></td>
              {/*<td className="outline outline-1"><p className="flex justify-center">{user?.name}</p></td>*/}
              <td className="outline outline-1"><p className="flex justify-center">{user?.email}</p></td>
              <td className="outline outline-1">
                <input disabled type={passwordShown ? 'text' : 'password'} value={user?.password} className="bg-[#E4E1E5] flex justify-center"/>
                <input type={'checkbox'} onClick={togglePasswordVisibility}/> Show Password
              </td>
            </tr>
          </tbody>
        </table>
    )
}