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
  const selectStyle = "outline outline-1 h-10 w-60 p-2 mb-4 hover:outline-2";

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  function Login(){
    let currentUser = userlist.find(user => (user.email === userEmail) && (user.password === password));
    if(currentUser){
      dispatch(setCurrentUserId(currentUser.id));
      dispatch(getCompanyInfo({employeeId: currentUser.id}));
      navigate('/Dashboard');
    }
  }

  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-1">

        <p className="text-5xl mb-5">Login</p>

        <p className='my-2'>Email</p>
        <input id="email" autoFocus value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} onKeyDown={(e)=> {if (e.key === 'Enter') Login()}}
        className={selectStyle}/>

        <div className="flex my-2 space-x-12">
          <p className="">Password</p>
          <div className="flex">
            <label>
              <input type='checkbox' className='mr-2' onChange={togglePasswordVisibility}/> 
              Show Password
            </label>
          </div>
        </div>
        <input id="password" value={password} type={passwordShown ? 'text' : 'password'} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=> {if (e.key === 'Enter') Login()}}
        className={selectStyle}/>
        
        <div className="w-full my-5">
          <button onClick={()=>Login()} className="outline outline-black rounded bg-[#21345b] text-white h-10 w-24 transition ease-in-out hover:bg-white hover:text-[#879794]">Submit</button>
        </div>

      </div>

      <div className="col-span-3 w-auto h-fit py-6 px-5 rounded-md bg-[#2ed7c3] m-5">
        <p className="text-center text-4xl">Welcome to the Integrity Inspired Solutions Client Portal!</p>
        <p className="text-center text-xl mt-2">To view the information on your project, please log in.</p>
        <p className="w-full text-center text-xl">
          If you are looking for the Integrity Inspired Solutions website, please see&nbsp;
          <a className="text-blue-600 visited:text-purple-600 underline" href="https://www.integrityinspired.com/">here.</a>
        </p>
      </div>

    </div>    
  )
}