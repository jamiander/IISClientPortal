import { useEffect, useState } from 'react';
import './App.css';
import Toast, { ToastDetails } from './Components/Toast';
import Content from './Layout/Content';
import Footer from './Layout/Footer';
import Header from './Layout/Header';
import NavPanel from './Layout/NavPanel';
import { getCompanyInfo } from './Store/CompanySlice';
//import { getCompanyData } from './Store/CompanySlice';
import { useAppDispatch } from './Store/Hooks';
//import { getUserData } from './Store/UserSlice';

function App() {
  const dispatch = useAppDispatch();

  const emptyToast : ToastDetails[] = []
  const [toastList, setToastList] = useState(emptyToast);

  function ShowToast(message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') {
    const id = Math.floor((Math.random() * 101) + 1);
    const toastDetails : ToastDetails = {message: message, id: id, type: type};
    setToastList([...toastList, toastDetails]);
  }

  useEffect(() => {
    //dispatch(getUserData());
    //dispatch(getCompanyData());
    dispatch(getCompanyInfo({})); //TODO: remove this when we add logging in
  })
  return (
    <div className='grid grid-cols-5 gap-[.5vh] bg-[#2ed7c3]'>
      <div className='col-span-5 bg-white h-30px'><Header/></div>
      <div className='bg-white h-auto'><NavPanel ShowToast={ShowToast}/></div>
      <div className='col-span-4 bg-white min-h-[85vh] h-auto'>
        <Content ShowToast={ShowToast}/>
        <Toast toastList={toastList} />
      </div>
      <div className='col-span-5 bg-[#21345b] text-white h-[9vh]'><Footer/></div>
    </div>
  );
}

export default App;
