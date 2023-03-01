import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Company, selectAllCompanies, updateCompanyInfo } from "../../Store/CompanySlice"
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { selectAllUsers, User } from "../../Store/UserSlice"
import UpdateUserListModal from "./UpdateUserListModal";

interface EditUserButtonProps{
  index:number,
  user:User,
  company?:Company,
  SubmitUpdateUser:(companyName: string, email: string, password: string) => void,
  handleEditUser:(user:User,company?:Company) => void,
  handleCloseEditUser:() => void
}
export default function EditUserButton(props:EditUserButtonProps){
  const fakeUser : User = {id: -1, email: '', password: '', companyId: -1};
  const fakeCompany : Company = {id: -1, name: "", initiatives: []}

  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(fakeUser);
  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);

  return(
    <div key={props.index} className={'py-2 my-2 flex self-end'}>
      <button className=" mx-2 bg-[#21345b] hover:outline-[#2ed7c3] hover:text-[#2ed7c3] text-sm text-white w-full h-10 rounded-md outline"
      onClick={() => props.handleEditUser(props.user, props.company)}
      >  
        Edit Client
      </button>
      <div className="h-6">
        <UpdateUserListModal EditUserIsOpen={EditUserIsOpen} handleCloseEditUser={props.handleCloseEditUser} user={selectedUser} company={selectedCompany} SubmitUser={props.SubmitUpdateUser} isEdit={isEdit} />
      </div>
    </div>
  )
}