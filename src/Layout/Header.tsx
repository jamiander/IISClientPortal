import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearCompanies, selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectCurrentUser, selectIsLoggedIn, signOut } from "../Store/UserSlice";
import { genericButtonStyle } from "../Styles";
import NavPanel from "./NavPanel";
import Grid from "@mui/material/Grid";
import { wrap } from "module";

export default function Header(){
  const logo = 'https://static.wixstatic.com/media/4f8b60_2899998071014662a534db34be03a3d1~mv2.png/v1/fill/w_438,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Integrity-Logo_2x%20(3)_edited.png'
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  const company = companyList.find(e=>e.id === user?.companyId);
  let imageLink = './Initiatives';
  let title = "";

  const location = useLocation();
  console.log(location.pathname);

  if(location.pathname === '/Initiatives') title = "Initiatives Management";
  if(location.pathname === '/Users') title = "User Management";
  if(location.pathname === '/Integrity') title = "Developer Management";
  if(location.pathname === '/ClientPage') title = "Client Management";

  if(!isLoggedIn)
    imageLink = './Login';

  function LogOut()
  {
    dispatch(clearCompanies());
    dispatch(signOut());
  }

  return(
  <div className="mr-[1%] ml-[1%] flex">
    <Grid container sx={{ display: 'flex',
              flexDirection: 'row',
              placeItems: "center"
               }}>
      <Grid item xs={3} sx={{ display: 'flex',
          justifyContent: 'flex-start',
          placeItems: 'center'
          }}>
      <NavPanel />
      <Link to={imageLink}>
        <img className="w-[50%]" src={logo} alt='Integrity Inspired Solutions Logo'/>
      </Link>
      </Grid>
      <Grid item xs={6} sx={{ display: 'flex',
          justifyContent: 'center',
          fontSize: "calc(25px + 0.390625vw)"
          }}> 
        {isLoggedIn && 
          <p className="text-[1.5vw] text-[#21355B] font-bold">{title}</p>
        }
      </Grid>
      <Grid item xs={3} sx={{ display: 'flex',
          justifyContent: 'flex-end',
          }}> 
        {
          isLoggedIn &&
            <button className={genericButtonStyle + " my-1"} onClick={() => LogOut()}>Log Out</button>
        }
      </Grid>
    </Grid>
  </div>
  )
}