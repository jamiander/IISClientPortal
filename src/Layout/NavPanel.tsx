import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser, selectIsLoggedIn } from "../Store/UserSlice"

export default function NavPanel(){
  const navigate = useNavigate()
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const currentuser = useAppSelector(selectCurrentUser);
  return(
    <div className="m-[2%] space-y-3">
      <p className="text-3xl w-[100%]">Nav Panel</p>
      <button disabled={!isLoggedIn} className="outline disabled:opacity-75 bg-[#21345b] text-white h-[40px] w-[100%] rounded" onClick={()=>navigate('/Dashboard')}>Dashboard</button>
      {currentuser?.companyId === 0 && <button disabled={!isLoggedIn} className="outline disabled:opacity-75 bg-[#21345b] text-white h-[40px] w-[100%] rounded" onClick={()=>navigate('/Admin')}>Admin</button>}
      <button disabled={!isLoggedIn} className="outline disabled:opacity-75 bg-[#21345b] text-white h-[40px] w-[100%] rounded" onClick={()=>navigate('/Profile')}>Proflie</button>
    </div>  
  )
}