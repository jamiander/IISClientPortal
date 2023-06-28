import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearCompanies, selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectCurrentUser, selectIsLoggedIn, signOut } from "../Store/UserSlice";
import { genericButtonStyle } from "../Styles";
import NavPanel from "./NavPanel";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { clearArticles } from "../Store/ArticleSlice";

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
  switch(location.pathname)
  {
    case '/Login':
      title = "Welcome to the Integrity Inspired Solutions Client Portal!";
    break;
    case '/Dashboard':
      title = `${company?.name} Dashboard`;
    break;
    case '/Initiatives':
      title = "Initiatives Management";
    break;
    case '/Users':
      title = "User Management";
    break;
    case '/Integrity':
      title = "Developer Management";
    break;
    case '/ClientPage':
      title = "Company Information";
    break;
  }

  if(!isLoggedIn)
    imageLink = './Login';

  function LogOut()
  {
    dispatch(clearCompanies());
    dispatch(clearArticles());
    dispatch(signOut());
    navigate('/Login');
  }

  return(
  <div className="mx-[1%] flex">
    <Grid container sx={{ display: 'flex',
              flexDirection: 'row',
              placeItems: 'center'
               }}>
      <Grid item xs={3} sx={{ display: 'flex',
          justifyContent: 'flex-start',
          placeItems: 'center'
          }}>
      <NavPanel />
      <Link to={imageLink}>
        <img className="w-[50%] py-2 px-2 my-4 mx-6 border-y-4 border-[#21355B]" src={logo} alt='Integrity Inspired Solutions Logo'/>
      </Link>
      </Grid>
      <Grid item xs={6} sx={{ display: 'flex',
          justifyContent: 'center'
          }}>
          <Typography sx={{fontSize:"min(calc(21px + 0.390625vw),30px)"}} textAlign={"center"} className="text-[#21355B]"><b>{title}</b></Typography>
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