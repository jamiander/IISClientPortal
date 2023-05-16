import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser, selectIsLoggedIn } from "../Store/UserSlice"
import { selectCurrentUserId } from "../Store/UserSlice"
import { enqueueSnackbar } from "notistack"
import { IntegrityId } from "../Store/CompanySlice"

export const NavPanelIds = {
  dashboard: "navPanelDashboard",
  company: "navPanelCompany",
  integrity: "navPanelIntegrity"
}

export default function NavPanel(){
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const currentUser = useAppSelector(selectCurrentUser);
  const navButtonStyle = "text-[#21345b] h-12 w-[90%] hover:bg-[#21345b] hover:text-white";
  const location = useLocation();

  function NavHandler(path: string) {
    if (!isLoggedIn) {
      
      enqueueSnackbar('You must login to leave this page', {variant:'error'});
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
        currentUser?.isAdmin && currentUser?.isActive &&
        <button id={NavPanelIds.company} className={GetNavStyle("/Company")}
          onClick={() => NavHandler('/Company')}>
          Client and User Management
        </button>
      }
      {
        currentUser?.isAdmin && currentUser?.isActive &&
        <button id={NavPanelIds.company} className={GetNavStyle("/Company2")}
          onClick={() => NavHandler('/Company2')}>
          Client and User Management @
        </button>
      }
      {
        currentUser?.isAdmin && currentUser?.isActive && currentUser?.companyId === IntegrityId &&
        <button id={NavPanelIds.integrity} className={GetNavStyle("/Integrity")}
          onClick={() => NavHandler('/Integrity')}>
          Integrity User Management
        </button>
      }
    </div>  
  )
}