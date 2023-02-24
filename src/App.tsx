import { useEffect, useState } from 'react';
import Toast, { ToastDetails } from './Components/Toast';
import Content from './Layout/Content';
import Footer from './Layout/Footer';
import Header from './Layout/Header';
import NavPanel from './Layout/NavPanel';
import { getCompanyInfo } from './Store/CompanySlice';
//import { getCompanyData } from './Store/CompanySlice';
import { useAppDispatch, useAppSelector } from './Store/Hooks';
import { selectCurrentUser } from './Store/UserSlice';
//import { getUserData } from './Store/UserSlice';

function App() {
  const dispatch = useAppDispatch();

  const emptyToast : ToastDetails[] = [];
  const [toastList, setToastList] = useState(emptyToast);
  const isLoggedIn = useAppSelector(selectCurrentUser);

  function ShowToast(message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') {
    const id = Math.floor((Math.random() * 101) + 1);
    const toastDetails : ToastDetails = {message: message, id: id, type: type};
    setToastList([...toastList, toastDetails]);
  }

  useEffect(() => {
    //dispatch(getUserData());
    //dispatch(getCompanyData());
    dispatch(getCompanyInfo({})); //TODO: remove this when we add logging in
  },[])

  let span;
  if (isLoggedIn) span = 'col-span-4 mr-1'; else span = 'col-span-5 mx-1'
  
  return (
    <div className='grid grid-cols-5 gap-[.5vh] bg-[#2ed7c3]'>
      <div className='col-span-5 bg-white h-fit mt-1 mx-1 py-1'><Header/></div>
      <div className='contents col-span-5 bg-white mx-1'>
        {
          isLoggedIn && 
          <div className='bg-white ml-1 col-span-1'>
            <NavPanel ShowToast={ShowToast}/>
          </div>
        }
        <div className={'bg-white h-full ' + span}>
          <Content ShowToast={ShowToast}/>
          <Toast toastList={toastList} />
        </div>
      </div>
      <div className='col-span-5 bg-[#21345b] text-white h-fit mb-1 mx-1'><Footer/></div>
    </div>
  );
}

export default App;
