import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { authenticateUser, selectAllUsers, selectCurrentUserId, selectLogInAttempts } from "../Store/UserSlice";
import { genericButtonStyle } from "../Styles";
import { Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, Grid, TextField, Typography } from "@mui/material";

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

  return (
    <>
    <div className="col-span-1 w-auto h-fit py-6 px-5 rounded-md bg-[#69D5C3] m-5">
        <p className="text-center text-4xl text-[#21345b]">Welcome to the Integrity Inspired Solutions Client Portal!</p>
        <p className="text-center text-xl text-[#21345b] mt-2">To view the information on your project, please log in.</p>
        <p className="w-full text-center text-[#21345b] text-xl">
          If you are looking for the Integrity Inspired Solutions website, please see&nbsp;
          <a className="text-blue-600 visited:text-purple-600 underline" href="https://www.integrityinspired.com/">here.</a>
        </p>
      </div>
      <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={HandleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id={LoginPageIds.email}
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
            onKeyDown={e => HandleLogin(e.key)} />
          <TextField margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            id={LoginPageIds.password}
            autoComplete="current-password"
            value={password}
            type={passwordShown ? 'text' : 'password'}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => HandleLogin(e.key)} />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <FormControlLabel control={<Checkbox value="show" color="primary" onChange={togglePasswordVisibility}/>} label="Show Password" />
          <Button type="submit" id={LoginPageIds.submitButton} disabled={isLoading} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} 
            onClick={() => Login()} className={genericButtonStyle}>
            Sign In
          </Button>
          {isLoading &&
            <div className="flex justify-center">
              <CircularProgress color="warning" />
            </div>}
          {logInAttempts > 0 &&
            <div className="outline rounded outline-red-600 p-2 flex justify-center w-3/4">
              <p className="text-red-600">Incorrect Email or Password</p>
            </div>}
        </Box>
      </Box>
    </Container>
    </>
  );
}
