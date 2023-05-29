import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { authenticateUser, selectAllUsers, selectCurrentUserId, selectLogInAttempts } from "../Store/UserSlice";
import { genericButtonStyle } from "../Styles";
import { CircularProgress } from "@mui/material";

export const LoginPageIds = {
  email: "email",
  password: "password",
  submitButton: "submitButton"
}

export default function LoginPage(){
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUserId = useAppSelector(selectCurrentUserId);
  const [userEmail, setUserEmail] = useState('admin@integrityinspired.com');
  const [password, setPassword] = useState('admin');
  const [passwordShown,setPasswordShown] = useState(false);
  const selectStyle = "outline outline-1 h-10 w-60 p-2 mb-4 hover:outline-2 focus:outline-2";
  const logInAttempts = useAppSelector(selectLogInAttempts);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  async function HandleLogin(key: any)
  {
    if(key === 'Enter')
    {
      await Login();
    }
  }
  
  async function Login()
  {
    if(!isLoading)
    {
      setIsLoading(true);
      try
      {
        await dispatch(authenticateUser({creds: { username: userEmail, password: password }}));
      }
      catch(e)
      {
        console.log((e as Error).message);
      }
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(currentUserId !== "-1")
    {
      navigate('/Initiatives');
    }
  },[currentUserId]);

  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-1">

        <p className="text-5xl text-[#21345b] mb-5">Login</p>

        <p className='my-2 text-[#21345b]'>Email</p>
        <input id={LoginPageIds.email} autoFocus value={userEmail} onChange={e => setUserEmail(e.target.value)} onKeyDown={e => HandleLogin(e.key)}
        className={selectStyle}/>

        <div className="flex my-2 space-x-12">
          <p className="text-[#21345b]">Password</p>
          <div className="flex">
            <label>
              <input type='checkbox' className='mr-2' onChange={togglePasswordVisibility}/>
              Show Password
            </label>
          </div>
        </div>
        <input id={LoginPageIds.password} value={password} type={passwordShown ? 'text' : 'password'} onChange={e => setPassword(e.target.value)} onKeyDown={e => HandleLogin(e.key)}
        className={selectStyle}/>
        
        <div className="w-full my-5 flex justify-between">
          <button id={LoginPageIds.submitButton} disabled={isLoading} onClick={()=>Login()} className={genericButtonStyle}>Submit</button>
          {isLoading &&
            <div className="flex justify-center">
              <CircularProgress color="warning"/>
            </div>
          }
        </div>

        {logInAttempts > 0 && 
        <div className="outline rounded outline-red-600 p-2 flex justify-center w-3/4">
          <p className="text-red-600">Incorrect Email or Password</p>
        </div>
        }

      </div>

      <div className="col-span-3 w-auto h-fit py-6 px-5 rounded-md bg-[#69D5C3] m-5">
        <p className="text-center text-4xl text-[#21345b]">Welcome to the Integrity Inspired Solutions Client Portal!</p>
        <p className="text-center text-xl text-[#21345b] mt-2">To view the information on your project, please log in.</p>
        <p className="w-full text-center text-[#21345b] text-xl">
          If you are looking for the Integrity Inspired Solutions website, please see&nbsp;
          <a className="text-blue-600 visited:text-purple-600 underline" href="https://www.integrityinspired.com/">here.</a>
        </p>
      </div>

    </div>    
  )
}