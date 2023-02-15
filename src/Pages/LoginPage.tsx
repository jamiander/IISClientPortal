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
        <text className="text-5xl">Login</text>
        <button className="bg-[#21345b] h-[40px] w-[80px] rounded" onClick={() => {dispatch(getUserData())}}></button>
      </div>
      <div className="col-span-4">
        <text>Email:</text>
        <input onChange={(e)=>setUserEmail(e.target.value)} className="outline rounded h-[40px]"/>
      </div>
      <div className="col-span-4">
        <text>Password</text>
        <input onChange={(e)=>setPassword(e.target.value)} className="outline rounded h-[40px]"/>
      </div>
      <div className="col-span-4">
        <button onClick={()=>Login()} className="outline rounded bg-[#21345b] text-white h-[40px] w-[80px]">Submit</button>
      </div>
    </div>
  )
}