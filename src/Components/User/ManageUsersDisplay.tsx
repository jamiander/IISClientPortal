import { useState } from "react";
import Sorter from "../../Services/Sorter";
import { selectAllCompanies } from "../../Store/CompanySlice";
import { useAppSelector } from "../../Store/Hooks";
import { selectAllUsers } from "../../Store/UserSlice";
import UsersTable from "./UsersTable";

export const UserRadioIds = {
  all: "userDisplayShowAll",
  active: "userDisplayShowActive",
  inactive: "userDisplayShowInactive"
}

export default function ManageUsersDisplay() {

  const [isEdit, setIsEdit] = useState(false);
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);

  const [radioValue, setRadioValue] = useState('active')

  const userList = useAppSelector(selectAllUsers);
  const companyList = useAppSelector(selectAllCompanies);


  return (
    <div className="col-span-4">
      <div className="bg-[#2ed7c3] rounded-md py-3 px-5">

        <div className="w-full flex justify-between">
          <p className="text-3xl">Clients</p>
          <button className="outline bg-[#21345b] text-white w-28 rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" onClick={() => {setEditUserIsOpen(true); setIsEdit(false);}} >  
            Add Client
          </button>
        </div>
  
      <div className="w-fit justify-center mt-2 py-1 px-5 outline outline-1 outline-[#879794] rounded">
          <input type='radio' id={UserRadioIds.all} value='all' name='clientDisplay' className="mr-1" onClick={()=>setRadioValue('all')}/>
          <label htmlFor='showAll' className="mr-5">Show All</label>

          <input type='radio' id={UserRadioIds.active} value='active' name='clientDisplay' defaultChecked className="mr-1" onClick={()=>setRadioValue('active')}/>
          <label htmlFor='showActive' className="mr-5">Only Active</label>
          
          <input type='radio' id={UserRadioIds.inactive} value='inactive' name='clientDisplay' className="mr-1" onClick={()=>setRadioValue('inactive')}/>
          <label htmlFor='showInactive' className="">Only Inactive</label>
        </div>

      </div>
         
      <div className="col-span-4 py-[10px] flex">
        <UsersTable userList={Sorter({users:userList})} companyList={companyList} radioStatus={radioValue}/>
        <div className="w-[10%]">
        </div>

      </div>
    </div>
  )
}