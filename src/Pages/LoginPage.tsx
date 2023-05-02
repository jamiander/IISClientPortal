import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser, selectLogInAttempts } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { selectAllUsers, selectCurrentUserId } from "../Store/UserSlice";
import { genericButtonStyle } from "../Styles";

export default function LoginPage(){
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUserId = useAppSelector(selectCurrentUserId);
  const [userEmail, setUserEmail] = useState('info@integrityinspired.com');
  const [password, setPassword] = useState('password');
  const [passwordShown,setPasswordShown] = useState(false);
  const selectStyle = "outline outline-1 h-10 w-60 p-2 mb-4 hover:outline-2 focus:outline-2";
  const logInAttempts = useAppSelector(selectLogInAttempts);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  function Login()
  {
    dispatch(authenticateUser({creds: { username: userEmail, password: password }}))
  }

  useEffect(() => {
    if(currentUserId !== "-1")
    {
      navigate('/Dashboard');
    }
  },[currentUserId]);

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
          <button onClick={()=>Login()} className={genericButtonStyle}>Submit</button>
        </div>

        {logInAttempts > 0 && 
        <div className="outline rounded outline-red-600 p-2 flex justify-center w-3/4">
          <p className="text-red-600">Incorrect Email or Password</p>
        </div>
        }

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