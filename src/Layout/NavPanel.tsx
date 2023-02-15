import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser } from "../Store/UserSlice"

export default function NavPanel(){
  const navigate = useNavigate()
  const currentuser = useAppSelector(selectCurrentUser);
  return(
    <div className="m-[2%] space-y-3">
      <text className="text-3xl w-[100%]">Nav Panel</text>
      <button className="outline bg-[#21345b] text-white h-[40px] w-[100%] rounded" onClick={()=>navigate('/Dashboard')}>Dashboard</button>
      <button className="outline bg-[#21345b] text-white h-[40px] w-[100%] rounded" onClick={()=>navigate('/Admin')}>Admin</button>
      <button className="outline bg-[#21345b] text-white h-[40px] w-[100%] rounded" onClick={()=>navigate('/Profile')}>Proflie</button>
    </div>  
  )
}