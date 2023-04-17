import { useState } from "react";
import ManageUsersDisplay from "../Components/User/ManageUsersDisplay";
import ManageInitiativesDisplay from "../Components/Initiative/ManageInitiativesDisplay";

export default function AdminPage(){
  
  const [table,setTable] = useState("initiatives");

  const tabStyle = "h-1/2 w-1/5 rounded-t-lg";
  const unselectedTabStyle = "font-semibold text-black bg-[#2ed7c3] hover:text-white hover:bg-[#28c4b1]" + " " + tabStyle;
  const selectedTabStyle = "text-white bg-[#21345b] hover:outline hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" + " " + tabStyle;

  const CLIENT = "clients";
  const INITIATIVE = "initiatives"

  return(
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
      <div className="flex col-span-4 mb-4 h-fit bg-[#2ed7c3] rounded-md py-6 px-5">
        <p className="text-5xl w-1/4">Admin</p>
        <div className="h-fit w-3/4 space-x-5 flex justify-end">
          <button className={table === CLIENT ? selectedTabStyle : unselectedTabStyle} onClick={()=>setTable(CLIENT)}>Clients</button>
          <button className={table === INITIATIVE ? selectedTabStyle : unselectedTabStyle} onClick={()=>setTable(INITIATIVE)}>Initiatives</button>
        </div>
      </div>
  
      {table === CLIENT && <ManageUsersDisplay/>}

      {table === INITIATIVE && <ManageInitiativesDisplay/>}
    </div>
  )
}