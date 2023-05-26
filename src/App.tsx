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

function App() {
  const dispatch = useAppDispatch();

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
    <div className='gap-[.7vh] bg-[#ebeff2]'>
      <div className='bg-[#E4E1E5] h-fit mt-1 mx-1 py-1'><Header/></div>
      <div className='contents bg-white mx-1'>
        {
          isLoggedIn() && 
          <div className='ml-10 text-left'>
            <NavPanel/>
          </div>
        }
        <div className={'bg-[#E4E1E5] min-h-[83.25vh] mx-1'}>
          <Content ShowToast={ShowToast}/>
          <Toast toastList={toastList} />
          <SnackbarProvider maxSnack={1} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}/>
        </div>
      </div>
      <div className='bg-[#21345b] text-white h-fit mb-1 mx-1'><Footer/></div>
    </div>
  );
}

export default App;
