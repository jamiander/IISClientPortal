import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectIsLoggedIn, signOut } from "../Store/UserSlice";

export default function Header(){
  const logo = 'https://static.wixstatic.com/media/4f8b60_2899998071014662a534db34be03a3d1~mv2.png/v1/fill/w_438,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Integrity-Logo_2x%20(3)_edited.png'
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  return(
  <div className="mr-[1%] ml-[1%] flex">
    <div className="flex min-h-[100%] h-auto justify-start self-start">
      <img className="min-h-full h-auto" src={logo} alt='Integrity Inspired Solutions Logo'/>
    </div>
    <div className="flex w-[100%] justify-end self-end">
    {!isLoggedIn && <button className="bg-[#21345b] text-white h-[40px] w-[80px] my-[5px] rounded outline" onClick={()=>navigate('/Login')}>Log In</button>}
    {isLoggedIn && <button className="bg-[#21345b] text-white h-[40px] w-[80px] my-[5px] rounded outline" onClick={()=>{dispatch(signOut()); navigate('/Login')}}>Log Out</button>}
    </div>
  </div>
  )
}