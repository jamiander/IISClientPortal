import { useState } from "react";
import { Company } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice"
import EditUserModal from "./EditUserModal";

interface UsersTableProps {
  userList: User[]
  companyList: Company[]
}

export default function UsersTable(props: UsersTableProps){
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);

    function PasswordDisplay(user:User){
        const [passwordShown, setPasswordShown] = useState(false);
        const togglePasswordVisibility = () => {
          setPasswordShown(passwordShown ? false:true);
        };
        return(
          <div className="px-4 w-4/5">
            <input disabled type={passwordShown ? 'text' : 'password'} value={user.password} className="bg-white flex justify-center"/>
            <input type={'checkbox'} onClick={togglePasswordVisibility}/> Show Password
          </div>
        )
      }

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
          {props.userList.map((user, index)=>{
            const companyName = props.companyList.find(company => company.id === user.companyId)?.name ?? "n/a";
            return(
              <tr key={index}>
                <td className="outline outline-1"><p className="flex justify-center">{companyName}</p></td>
                {/*<td className="outline outline-1"><p className="flex justify-center">{user.name}</p></td>*/}
                <td className="outline outline-1"><p className="flex justify-center">{user.email}</p></td>
                <td className="outline outline-1">
                  <PasswordDisplay {...(user)}/>
                </td>
                {/* <td className="outline outline-1">
                  <EditUserModal EditUserIsOpen={EditUserIsOpen} setEditUserIsOpen={setEditUserIsOpen} user={user} companyName={companyName}/>
                </td> */}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
}