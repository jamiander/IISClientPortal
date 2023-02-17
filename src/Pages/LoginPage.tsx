import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { getUserData, selectAllUsers, setCurrentUserId } from "../Store/UserSlice";

export default function LoginPage(){
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const userlist = useAppSelector(selectAllUsers);
  var currentuser = -1
  const [passwordShown,setPasswordShown]=useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  function Login(){
    if(userlist.find(user=>(user.email === userEmail)&&(user.password === password))){
      currentuser = (userlist.find(user=>(user.email === userEmail)&&(user.password === password)))?.id ?? -1
      dispatch(setCurrentUserId(currentuser))
      navigate('/DashBoard')
    }
  }

  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-4">
        <p className="text-5xl">Login</p>
      </div>
      <div className="col-span-4">
        <p>Email:</p>
        <input autoFocus onChange={(e)=>setUserEmail(e.target.value)} onKeyDown={(e)=> {if (e.key === 'Enter') Login()}} className="outline rounded h-[40px]"/>
      </div>
      <div className="col-span-4">
        <p>Password:</p>
        <input type={passwordShown ? 'text' : 'password'} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=> {if (e.key === 'Enter') Login()}} className="outline rounded h-[40px]"/>
        
      </div>
      <div className="col-span-4">
        <input type={'checkbox'} onClick={togglePasswordVisibility}/> Show Password
      </div>
      <div className="col-span-4 py-[2%]">
        <button onClick={()=>Login()} className="outline rounded bg-[#21345b] text-white h-[40px] w-[80px]">Submit</button>
      </div>
    </div>
    
  )
}