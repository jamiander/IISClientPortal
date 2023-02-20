import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser, selectIsLoggedIn } from "../Store/UserSlice"

export default function NavPanel(){
  const navigate = useNavigate()
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const currentuser = useAppSelector(selectCurrentUser);

  function navHandler(path: string) : void {
    if (!isLoggedIn) {
      //displayToast for not logged in
    }
    else navigate(path);
  }

  return(
    <div className="m-[2%] space-y-3">
      <p className="text-3xl w-[100%]">Navigation</p>
      
      <button className="outline disabled:opacity-75 bg-[#21345b] text-white h-[40px] w-[100%] rounded" 
        disabled={!isLoggedIn} onClick={() => navHandler('/Dashboard')}>
          Dashboard
      </button>
      
      {
        currentuser?.companyId === 0 && 
          <button className="outline disabled:opacity-75 bg-[#21345b] text-white h-[40px] w-[100%] rounded"
            disabled={!isLoggedIn} onClick={() => navHandler('/Admin')}>
              Admin
          </button>
      }
      
      <button className="outline disabled:opacity-75 bg-[#21345b] text-white h-[40px] w-[100%] rounded" 
        disabled={!isLoggedIn} onClick={() => navHandler('/Profile')}>
          Profile
      </button>
    
    </div>  
  )
}