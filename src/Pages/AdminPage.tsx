import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManageUsersDisplay from "../Components/User/ManageUsersDisplay";
import ManageInitiativesDisplay from "../Components/Initiative/ManageInitiativesDisplay";
import { getCompanyInfo } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectCurrentUser } from "../Store/UserSlice";

export default function AdminPage(){
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [table,setTable] = useState("clients");
  
  useEffect(() => {
    let kickThemOut = true;
    if(currentUser)
    {
      if(currentUser.companyId === 0)
      {
        kickThemOut = false;
      }
    }
    if(kickThemOut)
      navigate('/Login');
  }, [currentUser])


  useEffect(() => {
    dispatch(getCompanyInfo({})); //no args; admins get all companies/users
  },[])

  return(
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
    
      <div className="col-span-4 mb-4 h-fit bg-[#2ed7c3] rounded-md py-3 px-5 space-y-4">
        <p className="text-5xl">Admin Page</p>
        <div className="mb-4 h-fit flex space-x-3">
          <button className="outline bg-[#E4E1E5] h-12 w-[50%] rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" onClick={()=>setTable("clients")}>Clients</button>
          <button className="outline bg-[#E4E1E5] h-12 w-[50%] rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" onClick={()=>setTable("initiatives")}>Initiatives</button>
        </div>
      </div>
      
  
      {table === "clients" && <ManageUsersDisplay/>}

      {table === "initiatives" && <ManageInitiativesDisplay/>}
    </div>
  )
}