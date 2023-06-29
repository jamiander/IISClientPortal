import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { authenticateUser, selectCurrentUser, selectLogInAttempts } from "../Store/UserSlice";
import { IntegrityTheme, tableCellFontSize, tableHeaderFontSize } from "../Styles";
import { Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, TextField, Typography } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { IntegrityId } from "../Store/CompanySlice";

export const LoginPageIds = {
  email: "email",
  password: "password",
  submitButton: "submitButton"
}

export default function LoginPage(){
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
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
    if(currentUser)
    {
      if(currentUser.companyId === IntegrityId)
        navigate('/Initiatives');
      else
        navigate('/Dashboard');
    }
    else
    {
      navigate('/Login');
    }
  },[currentUser?.id]);

  return (
    <ThemeProvider theme={IntegrityTheme}>
      <div className="h-fit ml-30 mr-30 py-4 px-5 rounded-lg bg-[#21355B]">
        <p className={`text-center text-white mt-2 text-${tableCellFontSize}`}>To view the information on your project, please log in.</p>
        <p className={`w-full text-center text-white text-${tableCellFontSize}`}>
          If you are looking for the Integrity Inspired Solutions website, please go&nbsp;
          <a className="text-blue-600 visited:text-[#00C4FF] underline" href="https://www.integrityinspired.com/">here.</a>
        </p>
      </div>
      <Container component="main" maxWidth="xs" className="bg-gray-100 py-4 px-6 mt-[2%] mb-[2%] rounded-md shadow-md">
        <Box component="form" onSubmit={HandleLogin} noValidate sx={{
          marginTop: 6,
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "auto",
          borderRadius: 3
          }} >
          <Typography component="h1" variant="h5" sx={{fontSize: tableHeaderFontSize, mb:4}}>
            Sign in
          </Typography>
          <TextField
            InputProps={{ style: {fontSize: tableCellFontSize}}}
            color="darkBlue"
            margin="normal"
            required
            fullWidth
            data-cy={LoginPageIds.email}
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
            onKeyDown={e => HandleLogin(e.key)} />
          <TextField 
            InputProps={{ style: {fontSize: tableCellFontSize}}}
            color="darkBlue"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            data-cy={LoginPageIds.password}
            autoComplete="current-password"
            value={password}
            type={passwordShown ? 'text' : 'password'}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => HandleLogin(e.key)} />
          <FormControlLabel control={<Checkbox value="show" color="darkBlue" onChange={togglePasswordVisibility}/>} label="Show Password" />
          <Button color="lightGray" data-cy={LoginPageIds.submitButton} disabled={isLoading || !password || !userEmail} fullWidth variant="contained" sx={{ mt: 6, mb: 2}} 
            onClick={() => Login()} >
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
      </Container>
    </ThemeProvider>
  );
}
