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
    <div className="grid place-items-center p-[2%] space-y-3">
      
      <p className="text-3xl">Navigation</p>
      
      <button className="outline bg-[#21345b] text-white h-12 w-[90%] rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" 
          onClick={() => navHandler('/Dashboard')}>
          Dashboard
      </button>
      
      {
        currentuser?.companyId === 0 ? 
          <button className="outline bg-[#21345b] text-white h-12 w-[90%] rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]"
            disabled={!isLoggedIn} onClick={() => navHandler('/Admin')}>
              Admin
          </button> :
          <button className="outline bg-[#21345b] text-white h-12 w-[90%] rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" 
            onClick={() => navHandler('/Profile')}>
              Profile
          </button>
      }
      
    </div>  
  )
}