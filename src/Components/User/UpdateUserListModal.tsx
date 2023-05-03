import { useEffect, useState } from "react";
import Modal from "react-modal";
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from "../../Styles";
import { Company } from "../../Store/CompanySlice";
import { User } from "../../Store/UserSlice";

interface EditUserProps {
  EditUserIsOpen: boolean,
  handleCloseEditUser: () => void,
  company: Company,
  SubmitUser: (companyName: string) => void,
  isEdit: Boolean
}

export const EditUserModalIds = {
  modal: "editUserModal",
  company: "editUserModalCompany",
}

export default function UpdateUserListModal(props: EditUserProps) {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setCompanyName(props.company.name);

  }, [props.company])

  let headerText;
  if (props.isEdit) {headerText = "Edit User";}
  else {headerText = "Add User";}

  return (
    <div>
      <Modal
        id={EditUserModalIds.modal}
        isOpen={props.EditUserIsOpen}
        onRequestClose={() => {props.handleCloseEditUser()}}
        style={{'content': {...modalStyle.content, 'width' : '25%'}}}
        appElement={document.getElementById('root') as HTMLElement}
      >
        <h4 className="text-3xl mb-3">{headerText}</h4>

        <div className="w-full">
          <p className='my-1'>Company Name:</p>
          <input defaultValue={props.company.name} onChange={(e) => setCompanyName(e.target.value)} id={EditUserModalIds.company}  className={inputStyle + " w-full"}/>
        </div>
          
        <div className='mt-2 h-10 flex justify-between'>
          <button className={submitButtonStyle} 
            onClick={() => {
              console.log('company:', companyName, '\nemail:', email, '\npassword:', password);
              props.SubmitUser(companyName);}}>Submit</button>
          <button className={cancelButtonStyle}
            onClick={() => {props.handleCloseEditUser();}}>Close</button> 
        </div>

      </Modal>
    </div>
  )
}
