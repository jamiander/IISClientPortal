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

  let span;
  if (isLoggedIn()) span = 'col-span-4 mr-1'; else span = 'col-span-5 mx-1'
  
  return (
    <div className='grid grid-cols-5 gap-[.5vh] bg-[#2ed7c3]'>
      <div className='col-span-5 bg-[#E4E1E5] h-fit mt-1 mx-1 py-1'><Header/></div>
      <div className='contents col-span-5 bg-white mx-1'>
        {
          isLoggedIn() && 
          <div className='bg-[#E4E1E5] ml-1 col-span-1'>
            <NavPanel/>
          </div>
        }
        <div className={'bg-[#E4E1E5] min-h-[83.25vh] ' + span}>
          <Content ShowToast={ShowToast}/>
          <Toast toastList={toastList} />
          <SnackbarProvider anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}/>
        </div>
      </div>
      <div className='col-span-5 bg-[#21345b] text-white h-fit mb-1 mx-1'><Footer/></div>
    </div>
  );
}

export default App;
