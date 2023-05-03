import { useState } from "react";
import { Company } from "../../Store/CompanySlice"
import { User } from "../../Store/UserSlice"
import UpdateUserListModal from "./UpdateUserListModal";
import { genericButtonStyle } from "../../Styles";

interface EditUserButtonProps{
  index:number,
  company?:Company,
  SubmitUpdateUser:(companyName: string) => void,
  handleEditUser:(company?:Company) => void,
  handleCloseEditUser:() => void
}
export default function EditUserButton(props:EditUserButtonProps){
  const fakeCompany : Company = {id: "-1", name: "", initiatives: []}

  const [isEdit, setIsEdit] = useState(false);
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);

  return(
    <div key={props.index} className={'py-2 my-2 flex self-end'}>
      <button className={genericButtonStyle + " h-8 w-full mx-2"}
      onClick={() => props.handleEditUser(props.company)}
      >  
        Edit
      </button>
      <UpdateUserListModal EditUserIsOpen={EditUserIsOpen} handleCloseEditUser={props.handleCloseEditUser} company={selectedCompany} SubmitUser={props.SubmitUpdateUser} isEdit={isEdit} />
    </div>
  )
}