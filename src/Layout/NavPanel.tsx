import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser, selectIsLoggedIn } from "../Store/UserSlice"
import { selectCurrentUserId } from "../Store/UserSlice"

export const NavPanelIds = {
  dashboard: "navPanelDashboard",
  company: "navPanelCompany"
}

interface NavProps {
  ShowToast: (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void
}

export default function NavPanel(props: NavProps){
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const currentUser = useAppSelector(selectCurrentUser);
  const navButtonStyle = "text-[#21345b] h-12 w-[90%] hover:bg-[#21345b] hover:text-white";
  const location = useLocation();

  function NavHandler(path: string) {
    if (!isLoggedIn) {
      
      props.ShowToast('You must login to leave this page', 'Error');
    }
    else navigate(path);
  }

  function IsActivePath(pathToCheck: string)
  {
    return location.pathname === pathToCheck;
  }

  function GetNavStyle(path: string) : string
  {
    return navButtonStyle + (IsActivePath(path) ? " border-b-4 border-[#fab947] rounded-t-md" : " rounded-md");
  }

  return(
    <div className="grid place-items-center p-[2%] py-3 space-y-3">
      
      <button id={NavPanelIds.dashboard} className={GetNavStyle("/Dashboard")}
        onClick={() => NavHandler('/Dashboard')}>
        Dashboard
      </button>
      {
        currentUser?.isAdmin === true &&
        <button id={NavPanelIds.company} className={GetNavStyle("/Company")}
          onClick={() => NavHandler('/Company')}>
          Client and User Management
        </button>
      }
    </div>  
  )
}