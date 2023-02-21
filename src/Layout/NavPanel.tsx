import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Toast, { ToastDetails } from "../Components/Toast";
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser, selectIsLoggedIn } from "../Store/UserSlice"

interface NavProps {
  ShowToast: (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void
}

export default function NavPanel(props: NavProps){
  const navigate = useNavigate()
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const currentuser = useAppSelector(selectCurrentUser);

  function navHandler(path: string) {
    console.log('clicked')
    if (!isLoggedIn) {
      props.ShowToast('Must Login', 'Error');
    }
    else navigate(path);
  }

  return(
    <div className="m-[2%] space-y-3">
      <p className="text-3xl w-[100%]">Navigation</p>
      
      <button className="outline disabled:opacity-75 bg-[#21345b] text-white h-[40px] w-[100%] rounded-md" 
          onClick={() => navHandler('/Dashboard')}>
          Dashboard
      </button>
      
      {
        currentuser?.companyId === 0 && 
          <button className="outline disabled:opacity-75 bg-[#21345b] text-white h-[40px] w-[100%] rounded-md"
            disabled={!isLoggedIn} onClick={() => navHandler('/Admin')}>
              Admin
          </button>
      }
      
      <button className="outline disabled:opacity-75 bg-[#21345b] text-white h-[40px] w-[100%] rounded-md" 
         onClick={() => navHandler('/Profile')}>
          Profile
      </button>

    </div>  
  )
}