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

    if(props.radioStatus === 'active'){
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
          {activeClients.map((user, index)=>{
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
  else if(props.radioStatus === 'inactive'){
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
          {inactiveClients.map((user, index)=>{
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
  else{
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
          {props.userList.map((user, index)=>{
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
}