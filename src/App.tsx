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
    <div className='gap-1 bg-[#FAB947]'>
      <div className='bg-[#E4E1E5] h-[2%] mx-2 shadow-lg shadow-[#21355B] py-1 rounded-md'>
        <Header/>
      </div>
      <div className='contents mx-1 bg-[#E4E1E5]'>
        <div className={'bg-[#E4E1E5] min-h-[80vh] mx-2 shadow-lg shadow-[#21355B] rounded-md mt-3 mb-3'}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Content/>
            <SnackbarProvider maxSnack={1} anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}/>
          </LocalizationProvider>
        </div>
      </div>
      <div className='bg-[#21345b] text-white h-[2%] mx-2 shadow-xl pb-1 rounded-md'>
        <Footer/>
      </div>
    </div>
  );
}

export default App;
