import { useState } from "react";
import ManageUsersDisplay from "../Components/User/ManageUsersDisplay";
import ManageInitiativesDisplay from "../Components/Initiative/ManageInitiativesDisplay";

export default function AdminPage(){
  
  const [table,setTable] = useState("initiatives");

  const tabStyle = "outline outline-white text-white bg-[#21345b] h-12 w-1/5 rounded-t-lg hover:outline-[#2ed7c3] hover:text-[#2ed7c3]";
  const selectedTabStyle = tabStyle.replace("text-white","text-black").replace("bg-[#21345b]","bg-[#2ed7c3]").replace("hover:outline-[#2ed7c3] hover:text-[#2ed7c3]","hover:text-black");

  return(
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
      <div className="flex col-span-4 mb-4 h-fit bg-[#2ed7c3] rounded-md py-6 px-5">
        <p className="text-5xl w-1/4">Admin</p>
        <div className="h-fit w-3/4 space-x-5 flex justify-end">
          <button className={table === "clients" ? selectedTabStyle : tabStyle} onClick={()=>setTable("clients")}>Clients</button>
          <button className={table === "initiatives" ? selectedTabStyle : tabStyle} onClick={()=>setTable("initiatives")}>Initiatives</button>
        </div>
      </div>
  
      {table === "clients" && <ManageUsersDisplay/>}

      {table === "initiatives" && <ManageInitiativesDisplay/>}
    </div>
  )
}