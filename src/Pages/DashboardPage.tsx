import { useAppDispatch } from "../Store/Hooks"
import { getUserData } from "../Store/UserSlice";

export default function DashboardPage(){
  const dispatch = useAppDispatch();
    
  return(
    <div className="m-[2%]">
      <text className="text-5xl">DashBoard</text>
      <button className="bg-[#21345b] h-[40px] w-[80px] rounded" onClick={() => {dispatch(getUserData())}}></button>
    </div>
  )
}