import { useState } from "react";
import ManageUsersDisplay from "../Components/User/ManageUsersDisplay";
import ManageInitiativesDisplay from "../Components/Initiative/ManageInitiativesDisplay";

export default function AdminPage(){
  
  const [table,setTable] = useState("initiatives");

  const tabStyle = "w-1/5 text-black bg-[#2ed7c3] hover:text-white hover:bg-[#28c4b1]";
  const unselectedTabStyle = "rounded-lg" + " " + tabStyle;
  const selectedTabStyle = "border-b-4 border-[#21345b] rounded-t-lg" + " " + tabStyle;

  const CLIENT = "clients";
  const INITIATIVE = "initiatives"

  return(
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
      <div className="flex col-span-4 mb-4 bg-[#2ed7c3] rounded-md py-6 px-5">
        <p className="text-5xl font-bold w-1/4">Admin</p>
        <div className="h-full w-3/4 space-x-5 flex justify-end">
          <button className={table === INITIATIVE ? selectedTabStyle : unselectedTabStyle} onClick={()=>setTable(INITIATIVE)}>Initiatives</button>
          <button className={table === CLIENT ? selectedTabStyle : unselectedTabStyle} onClick={()=>setTable(CLIENT)}>Clients</button>
        </div>
      </div>
  
      {table === CLIENT && <ManageUsersDisplay/>}

      {table === INITIATIVE && <ManageInitiativesDisplay/>}
    </div>
  )
}