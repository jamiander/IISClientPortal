import { useState } from "react";
import { CompanyFilter } from "../../Services/Filters";
import { Company } from "../../Store/CompanySlice";
import { User } from "../../Store/UserSlice";
import EditUserButton from "./EditUserButton";

interface UsersTableProps {
  userList: User[],
  companyList: Company[],
  radioStatus: string,
  SubmitUpdateUser:(companyName: string, email: string, password: string) => void,
  handleEditUser:(user:User,company?:Company) => void,
  handleCloseEditUser:() => void
}
interface ClientTableProps{
  clients:User[]
}

export default function UsersTable(props: UsersTableProps){

  function PasswordDisplay(user:User){
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisibility = () => {
      setPasswordShown(passwordShown ? false:true);
    };
    return(
      <div className="px-4 w-4/5">
        <input disabled type={passwordShown ? 'text' : 'password'} value={user.password} className="bg-inherit flex justify-center"/>
        <input type={'checkbox'} className='hover:outline outline-1 -outline-offset-2' onClick={togglePasswordVisibility}/> Show Password
      </div>
    )
  }

  function ClientTable(cprops:ClientTableProps){
    return(
      <table className="table-auto w-[100%] outline outline-3 my-3 bg-gray-100">
      <thead className="outline outline-1">
        <tr>
          <th>Company</th>
          <th>Email</th>
          <th>Password</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {cprops.clients.map((user, index)=>{
          const company = props.companyList.find(company => company.id === user.companyId);
          return(
            <tr key={index} className="odd:bg-gray-200">
              <td className="outline outline-1"><p className="flex justify-center">{company?.name}</p></td>
              <td className="outline outline-1"><p className="flex justify-center">{user.email}</p></td>
              <td className="outline outline-1">
                <PasswordDisplay {...(user)}/>
              </td>
              <td className="outline outline-1">
                <EditUserButton index={index} user={user} company={company} SubmitUpdateUser={props.SubmitUpdateUser} handleEditUser={props.handleEditUser} handleCloseEditUser={props.handleCloseEditUser}/>
              </td>
            </tr>
          )
        })}
        </tbody>
      </table>
    )
  }
  return(
    <ClientTable clients={CompanyFilter(props.userList,props.radioStatus)}/>
  )
}