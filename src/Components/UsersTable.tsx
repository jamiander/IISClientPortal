import { useState } from "react";
import { Company } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice"

interface UsersTableProps {
  userList: User[]
  companyList: Company[]
}

export default function UsersTable(props: UsersTableProps){

    function PasswordDisplay(user:User){
        const [passwordShown, setPasswordShown] = useState(false);
        const togglePasswordVisibility = () => {
          setPasswordShown(passwordShown ? false:true);
        };
        return(
          <div className="px-4 w-4/5">
            <input disabled type={passwordShown ? 'text' : 'password'} value={user.password} className="flex justify-center"/>
            <input type={'checkbox'} onClick={togglePasswordVisibility}/> Show Password
          </div>
        )
      }

    return(
        <table className="table-auto w-[100%] outline outline-3">
        <thead className="outline outline-1">
          <tr>
            <th>Company</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {props.userList.map((user, index)=>{
            return(
              <tr key={index}>
                <td className="outline outline-1"><p className="flex justify-center">{props.companyList.find(company => company.id === user.companyId)?.name}</p></td>
                <td className="outline outline-1"><p className="flex justify-center">{user.name}</p></td>
                <td className="outline outline-1"><p className="flex justify-center">{user.email}</p></td>
                <td className="outline outline-1">
                  <PasswordDisplay {...(user)}/>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
}