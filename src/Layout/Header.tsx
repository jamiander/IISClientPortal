import { Link, useNavigate } from "react-router-dom";
import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectCurrentUser, selectIsLoggedIn, signOut } from "../Store/UserSlice";
import { genericButtonStyle } from "../Styles";

export default function Header(){
  const logo = 'https://static.wixstatic.com/media/4f8b60_2899998071014662a534db34be03a3d1~mv2.png/v1/fill/w_438,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Integrity-Logo_2x%20(3)_edited.png'
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  const company = companyList.find(e=>e.id === user?.companyId);
  var hrs = new Date().getHours();
  var greet;
  let imageLink = './Dashboard';

  if(hrs < 12)
    greet = 'Good Morning ' + company?.name;
  else if(hrs >= 12 && hrs <= 17)
    greet = 'Good Afternoon ' + company?.name;
  else
    greet = 'Good Evening ' + company?.name;

  if(!isLoggedIn)
    imageLink = './Login';

  return(
  <div className="mr-[1%] ml-[1%] flex">
    <div className="flex min-h-[100%] h-auto justify-start self-start">
      <Link to={imageLink}>
        <img className="min-h-full h-auto" src={logo} alt='Integrity Inspired Solutions Logo'/>
      </Link>
      
    </div>
    <div className="flex w-[50%] justify-center">
      {/*isLoggedIn && <p className="text-2xl self-center">{greet}</p>*/}
    </div>
    <div className="flex w-[50%] justify-end self-end">
    {
      !isLoggedIn ?
        <button className={genericButtonStyle + " my-1"} onClick={()=>navigate('/Login')}>Log In</button> :
        <button className={genericButtonStyle + " my-1"} onClick={()=>{dispatch(signOut()); navigate('/Login')}}>Log Out</button>
    }
    </div>
  </div>
  )
}