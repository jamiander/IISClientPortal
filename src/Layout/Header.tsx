import { useNavigate } from "react-router-dom";
import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectCurrentUser, selectIsLoggedIn, signOut } from "../Store/UserSlice";

export default function Header(){
  const logo = 'https://static.wixstatic.com/media/4f8b60_2899998071014662a534db34be03a3d1~mv2.png/v1/fill/w_438,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Integrity-Logo_2x%20(3)_edited.png'
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies);
  const company = companyList.find(e=>e.id === user?.companyId);
  var date = new Date();
  var hrs = date.getHours();
  var greet;

  if(hrs < 12){
    greet = 'Good Morning ' + company?.name
  }
  else if(hrs >= 12 && hrs <=17){
    greet = 'Good Afternoon ' + company?.name
  }
  else if(hrs >= 17 && hrs <= 24){
    greet = 'Good Evening ' + company?.name
  }

  return(
  <div className="mr-[1%] ml-[1%] flex">
    <div className="flex min-h-[100%] h-auto justify-start self-start">
      <img className="min-h-full h-auto" src={logo} alt='Integrity Inspired Solutions Logo'/>
      
    </div>
    <div className="flex w-[50%] justify-center">
      {isLoggedIn && <p className="text-2xl self-center">{greet}</p>}
    </div>
    <div className="flex w-[50%] justify-end self-end">
    {
      !isLoggedIn ?
        <button className="bg-[#21345b] text-white p-2 px-3 my-1 rounded-md outline hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" onClick={()=>navigate('/Login')}>Log In</button> :
        <button className="bg-[#21345b] text-white p-2 px-3 my-1 rounded-md outline hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" onClick={()=>{dispatch(signOut()); navigate('/Login')}}>Log Out</button>
    }
    </div>
  </div>
  )
}