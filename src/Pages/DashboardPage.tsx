import { useAppDispatch } from "../Store/Hooks"
import { getUserData } from "../Store/UserSlice";

export default function DashboardPage(){
    const dispatch = useAppDispatch();
    
    return(
        <>
            <text className="text-5xl">DashBoard</text>
            <button className="bg-[#2ed7c3] h-[40px] w-[80px] rounded" onClick={() => {dispatch(getUserData())}}></button>
        </>
    )
}