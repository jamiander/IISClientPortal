import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser, selectIsLoggedIn } from "../Store/UserSlice"
import { enqueueSnackbar } from "notistack"
import { IntegrityId } from "../Store/CompanySlice"
import { useState } from "react"
import { IconButton, Menu } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';

export const NavPanelIds = {
  initiatives: "navPanelInitiatives",
  users: "navPanelUsers",
  integrity: "navPanelIntegrity",
  client: "navPanelClient",
  menuButton: "navPanelMenuButton"
}

export default function NavPanel(){
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const currentUser = useAppSelector(selectCurrentUser);
  const navButtonStyle = "text-[#21345b] h-[6vh] w-[90%] hover:bg-[#21345b] hover:text-white";
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function NavHandler(path: string) {
    if (!isLoggedIn) {
      enqueueSnackbar('You must login to leave this page', {variant:'error'});
    }
    else 
    {
      navigate(path);
      handleClose();
    }
  }

  function IsActivePath(pathToCheck: string)
  {
    return location.pathname === pathToCheck;
  }

  function GetNavStyle(path: string) : string
  {
    return navButtonStyle + (IsActivePath(path) ? " border-4 border-[#fab947] rounded-t-md h-auto" : " rounded-md");
  }

  return(
    <div className="ml-4 mr-4 space-x-2 flex mt-4 mb-4">
    {currentUser?.isActive && currentUser.isAdmin && currentUser.companyId === IntegrityId &&
    <>
      <IconButton className="text-xl"
          id="basic-button"
          data-cy={NavPanelIds.menuButton}
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
        <MenuIcon sx={{fontSize: "calc(30px + 0.390625vw)"}} />
      </IconButton>
      <Menu id="basic-menu"
        className="w-[16vw] rounded-lg"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': "basic-button"
        }}>
          <button style={{fontSize: "calc(10px + 0.390625vw)", marginTop: '5px', marginBottom: '10px', marginLeft: '10px', paddingBottom: '5px', textAlign: "left" }} data-cy={NavPanelIds.initiatives} className={GetNavStyle("/Initiatives")}
            onClick={() => NavHandler('/Initiatives')}>
            <i className="material-icons" style={{fontSize: "calc(16px + 0.390625vw)", marginRight: '10px' }}>info_outline</i>
            Initiative Management
          </button>
          {currentUser?.isAdmin &&
            <button style={{fontSize: "calc(10px + 0.390625vw)", marginTop: '5px', marginBottom: '10px', marginLeft: '10px', paddingBottom: '5px', textAlign: "left" }} data-cy={NavPanelIds.users} className={GetNavStyle("/Users")}
              onClick={() => NavHandler('/Users')}>
              <i className="material-icons" style={{fontSize: "calc(16px + 0.390625vw)", marginRight: '10px' }}>person_outline</i>
              User Management
            </button>}
          {currentUser?.isAdmin && currentUser?.companyId === IntegrityId &&
            <button style={{fontSize: "calc(10px + 0.390625vw)", marginTop: '5px', marginBottom: '10px', marginLeft: '10px', paddingBottom: '5px', textAlign: "left" }} data-cy={NavPanelIds.integrity} className={GetNavStyle("/Integrity")}
              onClick={() => NavHandler('/Integrity')}>
              <i className="material-icons" style={{fontSize: "calc(16px + 0.390625vw)", marginRight: '10px' }}>keyboard</i>
              Developer Management
            </button>}
          <button style={{fontSize: "calc(10px + 0.390625vw)", marginTop: '5px', marginBottom: '5px', marginLeft: '10px', paddingBottom: '5px', textAlign: "left" }} data-cy={NavPanelIds.client} className={GetNavStyle("/ClientPage")}
            onClick={() => NavHandler('/ClientPage')}>
            <i className="material-icons" style={{fontSize: "calc(16px + 0.390625vw)", marginRight: '10px' }}>manage_accounts</i>
            Company Information
          </button>
        </Menu>
      </>
    }
    </div>
  )
}