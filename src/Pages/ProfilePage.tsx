import { useState } from "react";
import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser } from "../Store/UserSlice"

export default function ProfilePage(){
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  const company = companyList.find(e=>e.id === user?.companyId);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-4">
        <p className="text-5xl">Profile</p>
      </div>
      <div className="col-span-4 py-[5px]">
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
            <tr>
              <td className="outline"><p className="flex justify-center">{company?.name}</p></td>
              <td className="outline"><p className="flex justify-center">{user?.name}</p></td>
              <td className="outline"><p className="flex justify-center">{user?.email}</p></td>
              <td className="outline">
                <input disabled type={passwordShown ? 'text' : 'password'} value={user?.password} className="flex justify-center"/>
                <input type={'checkbox'} onClick={togglePasswordVisibility}/> Show Password
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-span-4">
        <p className="text-5xl">Company Initiatives</p>
      </div>
      <div className="col-span-4 py-[5px]">
        <table className="table-auto w-[100%] outline">
          <thead>
            <tr>
              <th>Initiative</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {company?.initiatives?.map((initiative, index)=>{
              return(
                <tr key={index}>
                  <td className="outline"><p className="flex justify-center">{initiative}</p></td>
                  <td className="outline"><p className="flex justify-center">placeholder</p></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}