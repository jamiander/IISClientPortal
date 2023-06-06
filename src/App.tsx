import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast, { ToastDetails } from './Components/Toast';
import Content from './Layout/Content';
import Footer from './Layout/Footer';
import Header from './Layout/Header';
import NavPanel from './Layout/NavPanel';
import { useAppDispatch, useAppSelector } from './Store/Hooks';
import { selectCurrentUserId } from './Store/UserSlice';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  const emptyToast : ToastDetails[] = [];
  const [toastList, setToastList] = useState(emptyToast);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const navigate = useNavigate();
  const isLoggedIn = () => currentUserId !== "-1";

  function ShowToast(message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') {
    const id = Math.floor((Math.random() * 101) + 1);
    const toastDetails : ToastDetails = {message: message, id: id, type: type};
    setToastList([...toastList, toastDetails]);
  }

  useEffect(() => {
    if(!isLoggedIn())
      navigate('/Login');
  }, [currentUserId])

  return (
    <div className='gap-1 bg-[#FAB947]'>
      <div className='bg-[#E4E1E5] h-[2%] mx-3 shadow-xl py-1 rounded-md'><Header/></div>
        <div className='contents mx-1 bg-[#E4E1E5]'>
          <div className={'bg-[#E4E1E5] min-h-[82vh] mx-3 shadow-xl rounded-md mt-4'}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Content ShowToast={ShowToast}/>
              <Toast toastList={toastList} />
              <SnackbarProvider maxSnack={1} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}/>
            </LocalizationProvider>
          </div>
        </div>
      <div className='bg-[#21345b] text-white h-fit mb-1 mx-3 shadow-xl pb-1 rounded-md'><Footer/></div>
    </div>
  );
}

export default App;
