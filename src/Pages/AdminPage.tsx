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
    
      <div className="col-span-3 mb-4 h-fit">
        <p className="text-5xl">Admin Page</p>
      </div>
      <div className="col-span-1 mb-4 h-fit flex justify-end space-x-3">
        <button className="outline bg-[#21345b] text-white h-12 w-[40%] rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" onClick={()=>setTable("clients")}>Clients</button>
        <button className="outline bg-[#21345b] text-white h-12 w-[40%] rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" onClick={()=>setTable("initiatives")}>Initiatives</button>
      </div>
  
      {table === "clients" && <ManageUsersDisplay/>}

      {table === "initiatives" && <ManageInitiativesDisplay/>}
    </div>
  )
}