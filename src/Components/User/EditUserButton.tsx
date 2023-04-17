import { useState } from "react";
import { Company } from "../../Store/CompanySlice"
import { User } from "../../Store/UserSlice"
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

  const [isEdit, setIsEdit] = useState(false);
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(fakeUser);
  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);

  return(
    <div key={props.index} className={'py-2 my-2 flex self-end'}>
      <button className=" mx-2 bg-[#21345b] text-sm text-white w-full h-8 rounded-md outline hover:outline-[#2ed7c3] hover:text-[#2ed7c3]"
      onClick={() => props.handleEditUser(props.user, props.company)}
      >  
        Edit
      </button>
      <UpdateUserListModal EditUserIsOpen={EditUserIsOpen} handleCloseEditUser={props.handleCloseEditUser} user={selectedUser} company={selectedCompany} SubmitUser={props.SubmitUpdateUser} isEdit={isEdit} />
    </div>
  )
}