import { useState } from "react";
import { Company } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks"
import { selectAllUsers, User } from "../Store/UserSlice"

interface UsersTableProps {
  companyList: Company[]
}

export default function UsersTable(props: UsersTableProps){
    const userList = useAppSelector(selectAllUsers);

    function PasswordDisplay(user:User){
        const [passwordShown, setPasswordShown] = useState(false);
        const togglePasswordVisibility = () => {
          setPasswordShown(passwordShown ? false:true);
        };
        return(
          <>
          <input disabled type={passwordShown ? 'text' : 'password'} value={user.password} className="flex justify-center"/>
          <input type={'checkbox'} onClick={togglePasswordVisibility}/> Show Password
          </>
        )
      }

    return(
        <table className="table-auto w-[100%] outline">
        <thead>
          <tr>
            <th>Company</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, index)=>{
            return(
              <tr key={index}>
                <td className="outline"><p className="flex justify-center">{props.companyList.find(company => company.id === user.companyId)?.name}</p></td>
                <td className="outline"><p className="flex justify-center">{user.name}</p></td>
                <td className="outline"><p className="flex justify-center">{user.email}</p></td>
                <td className="outline">
                  <PasswordDisplay {...(user)}/>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
}