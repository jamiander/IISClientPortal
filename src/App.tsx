import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Layout/Footer';
import Header from './Layout/Header';
import { useAppSelector } from './Store/Hooks';
import { selectCurrentUserId } from './Store/UserSlice';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Content from './Layout/Content';

function App() {
  const currentUserId = useAppSelector(selectCurrentUserId);
  const navigate = useNavigate();
  const isLoggedIn = () => currentUserId !== "-1";

  useEffect(() => {
    if(!isLoggedIn())
      navigate('/Login');
  }, [currentUserId])

  return (
    <div className='bg-[#FAB947] min-h-screen'>
      <div className='bg-[#E4E1E5] mx-2 shadow-lg shadow-[#21355B] py-1 rounded-md h-[2%]'>
        <Header/>
      </div>
      <div className={'bg-[#E4E1E5] mx-2 shadow-lg min-h-[80vh] shadow-[#21355B] rounded-md mt-3 mb-3'}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Content/>
          <SnackbarProvider maxSnack={1} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}/>
        </LocalizationProvider>
      </div>
      <div className='bg-[#21345b] mx-2 pb-1 rounded-md h-[2%] shadow-[#21355B] shadow-lg'>
        <Footer/>
      </div>
    </div>
  );
}

export default App;
