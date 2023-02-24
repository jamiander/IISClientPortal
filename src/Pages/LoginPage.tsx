import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanyInfo } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { selectAllUsers, setCurrentUserId } from "../Store/UserSlice";

export default function LoginPage(){
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('info@integrityinspired.com');
  const [password, setPassword] = useState('password');
  const userlist = useAppSelector(selectAllUsers);
  const [passwordShown,setPasswordShown]=useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  function Login(){
    let currentUser = userlist.find(user => (user.email === userEmail) && (user.password === password));
    if(currentUser){
      dispatch(setCurrentUserId(currentUser.id));
      dispatch(getCompanyInfo({employeeId: currentUser.id}));
      navigate('/DashBoard');
    }
  }

  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-4 mb-5">
        <p className="text-5xl">Login</p>
      </div>
      <div className="col-span-4 my-2">
        <p>Email:</p>
        <input id="email" autoFocus value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} onKeyDown={(e)=> {if (e.key === 'Enter') Login()}} className="outline outline-1 rounded-md h-[40px] w-[220px] p-2"/>
      </div>
      <div className="col-span-4 my-2">
        <p>Password:</p>
        <input id="password" value={password} type={passwordShown ? 'text' : 'password'} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=> {if (e.key === 'Enter') Login()}} className="outline outline-1 rounded-md h-[40px] w-[220px] p-2"/>
        
      </div>
      <div className="col-span-4">
        <input type={'checkbox'} onClick={togglePasswordVisibility}/> Show Password
      </div>
      <div className="col-span-4 py-[2%]">
        <button onClick={()=>Login()} className="outline rounded bg-[#21345b] hover:bg-[#445362] text-white h-[40px] w-[80px]">Submit</button>
      </div>
    </div>
    
  )
}