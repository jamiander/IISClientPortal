import { useNavigate } from "react-router-dom"
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
    if (!isLoggedIn) {
      
      props.ShowToast('You must login to leave this page', 'Error');
    }
    else navigate(path);
  }

  return(
    <div className="m-[2%] space-y-3">
      {isLoggedIn && <p className="text-3xl w-[100%]">Navigation</p>}
      
      {isLoggedIn && <button className="outline bg-[#21345b] text-white h-[40px] w-[100%] rounded-md" 
          onClick={() => navHandler('/Dashboard')}>
          Dashboard
      </button>}
      
      {
        currentuser?.companyId === 0 && 
          <button className="outline bg-[#21345b] text-white h-[40px] w-[100%] rounded-md"
            disabled={!isLoggedIn} onClick={() => navHandler('/Admin')}>
              Admin
          </button>
      }
      
      {isLoggedIn && <button className="outline bg-[#21345b] text-white h-[40px] w-[100%] rounded-md" 
         onClick={() => navHandler('/Profile')}>
          Profile
      </button>}

    </div>  
  )
}