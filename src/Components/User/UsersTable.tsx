import { useState } from "react";
import ActiveCompaniesFilter from "../../Services/ActiveCompaniesFilter";
import InactiveCompaniesFilter from "../../Services/InactiveCompaniesFilter";
import { Company } from "../../Store/CompanySlice";
import { User } from "../../Store/UserSlice";

interface UsersTableProps {
  userList: User[]
  companyList: Company[]
  radioStatus: string
}
interface ClientTableProps{
  clients:User[]
}

export default function UsersTable(props: UsersTableProps){
  const activeClients = ActiveCompaniesFilter(props.userList);
  const inactiveClients = InactiveCompaniesFilter(props.userList);

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

      function ClientTable(cprops:ClientTableProps){
        return(
          <table className="table-auto w-[100%] outline outline-3">
          <thead className="outline outline-1">
            <tr>
              <th>Company</th>
              <th>Email</th>
              <th>Password</th>
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
                </tr>
              )
            })}
            </tbody>
          </table>
        )
      }

    if(props.radioStatus === 'active'){
      return(
        <ClientTable clients={activeClients}/>
    )
  }
  else if(props.radioStatus === 'inactive'){
    return(
      <ClientTable clients={inactiveClients}/>
    )
  }
  else{
    return(
      <ClientTable clients={props.userList}/>
    )
  }
}