import { useAppDispatch } from "../Store/Hooks"
import { getUserData } from "../Store/UserSlice";

export default function DashboardPage(){
  const dispatch = useAppDispatch();
    
  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-2">
        <p className="text-5xl">DashBoard</p>
      </div>
      <div className="flex justify-end col-span-2">
        <select className="outline rounded w-[200px] h-[40px]">
          <option>Select Initiative</option>
        </select>
      </div>
      <div className="col-span-4 h-[60vh] outline">
        this is where the data will go
        the outline is there so we know how much space it takes up
      </div>
    </div>
  )
}