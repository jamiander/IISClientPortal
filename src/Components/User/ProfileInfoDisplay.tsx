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
    <div className="">
      <b>Company:</b> <p>{company?.name}</p>
      <div className="my-3">
        <b>Email:</b> <p>{user?.email}</p>
      </div>
      <div className="w-full">
        <div className="flex space-x-12">
          <b>Password:</b>
          <div className="flex">
            <input className="mr-2" type={'checkbox'} onClick={togglePasswordVisibility}/>
            <p>Show Password</p>
          </div>
        </div>
        <input disabled type={passwordShown ? 'text' : 'password'} value={user?.password} className="bg-[#445362] flex justify-center"/>

      </div>
    </div>
  )
}