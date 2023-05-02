import { useState } from "react";
import { selectAllCompanies } from "../../Store/CompanySlice";
import { useAppSelector } from "../../Store/Hooks"
import { selectCurrentUser } from "../../Store/UserSlice"

export default function ProfileInfoDisplay(){
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  const company = companyList.find(e=>e.id === user?.companyId);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
      setPasswordShown(passwordShown ? false : true);
  };
  
  return(
    <div>
      <table className="table-auto border-separate border border-spacing-2 border-transparent">
        <tbody>
          <tr>
            <td>Company:</td>
            <td>{company?.name}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{user?.email}</td>
          </tr>
          <tr>
            <td>Password:</td>
            <td><input disabled type={passwordShown ? 'text' : 'password'} value={user?.password} className="bg-[#445362] w-40"/></td>
          </tr>
        </tbody>
      </table>
      <div className="ml-2">
        <label className="flex">
          <input className="mr-2" type={'checkbox'} onClick={togglePasswordVisibility}/>
          <p>Show Password</p>
        </label>
      </div>
      {/*<div className="grid grid-cols-3">
      <div className="col-span-1 h-fit p-2">
        <p className="font-bold flex justify-end mb-2">Company:</p>
        <p className="font-bold flex justify-end mb-2">Email:</p>
        <p className="font-bold flex justify-end">Password:</p>
      </div>
      <div className="col-span-2 h-fit p-2">
        <p className="mb-2">{company?.name}</p>
        <p className="mb-2">{user?.email}</p>
        <input disabled type={passwordShown ? 'text' : 'password'} value={user?.password} className="bg-[#445362] w-40"/>
      </div>
      <div className="flex col-span-3 w-full h-fit">
        <input className="mr-2" type={'checkbox'} onClick={togglePasswordVisibility}/>
        <p>Show Password</p>
      </div>
    </div>*/}
    </div>
  )
}