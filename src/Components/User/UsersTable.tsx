import { useState } from "react";
import CompanyFilter from "../../Services/CompanyFilter";
import { Company } from "../../Store/CompanySlice";
import { User } from "../../Store/UserSlice";
import EditUserButton from "./EditUserButton";

interface UsersTableProps {
  userList: User[]
  companyList: Company[]
  radioStatus: string
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
        <input disabled type={passwordShown ? 'text' : 'password'} value={user.password} className="bg-[#E4E1E5] flex justify-center"/>
        <input type={'checkbox'} className='hover:outline outline-1 -outline-offset-2' onClick={togglePasswordVisibility}/> Show Password
      </div>
    )
  }

  function ClientTable(cprops:ClientTableProps){
    return(
      <table className="table-auto w-[100%] outline outline-3">
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
            <tr key={index}>
              <td className="outline outline-1"><p className="flex justify-center">{company?.name}</p></td>
              <td className="outline outline-1"><p className="flex justify-center">{user.email}</p></td>
              <td className="outline outline-1">
                <PasswordDisplay {...(user)}/>
              </td>
              <td className="outline outline-1">
                <EditUserButton index={index} user={user} company={company} />
              </td>
            </tr>
          )
        })}
        </tbody>
      </table>
    )
  }

  if(props.radioStatus === 'active'){
    return(
      <ClientTable clients={CompanyFilter(props.userList, 'active')}/>
    )
  }
  else if(props.radioStatus === 'inactive'){
    return(
      <ClientTable clients={CompanyFilter(props.userList, 'inactive')}/>
    )
  }
  else{
    return(
      <ClientTable clients={props.userList}/>
    )
  }
}