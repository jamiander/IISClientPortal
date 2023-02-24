import { useEffect, useState } from "react";
import Modal from "react-modal";
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from "../Styles";
import { Company } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice";
import { EnumDeclaration } from "typescript";

interface EditUserProps {
  EditUserIsOpen: boolean,
  handleCloseEditUser: () => void,
  user: User,
  company: Company,
  SubmitUser: (companyName: string, email: string, password: string) => void,
  isEdit: Boolean
}

export default function EditUserModal(props: EditUserProps) {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setCompanyName(props.company.name);
    setEmail(props.user.email);
    setPassword(props.user.password);

  }, [props.company,props.user])

  let headerText;
  if (props.isEdit) {headerText = "Edit User";}
  else {headerText = "Add User";}

  return (
    <div>
      <Modal
        isOpen={props.EditUserIsOpen}
        onRequestClose={() => {props.handleCloseEditUser()}}
        style={{'content': {...modalStyle.content, 'width' : '25%'}}}
        appElement={document.getElementById('root') as HTMLElement}
      >
        <h4 className="text-3xl mb-3">{headerText}</h4>

        <div className="w-full">
          <p className='my-1'>Company Name:</p>
          <input defaultValue={props.company.name} onChange={(e) => setCompanyName(e.target.value)} id="modalCompany1"  className={inputStyle}/>

          <p className='my-1'>Email:</p>            
          <input defaultValue={props.user.email} onChange={(e) => setEmail(e.target.value)}  id="modalEmail1"  className={inputStyle}/>

          <p className='my-1'>Password:</p>
          <input defaultValue={props.user.password} onChange={(e) => setPassword(e.target.value)}  id="modalPassword1" className={inputStyle}/>
        </div>

        <div className='mt-2 h-10'>
          <button className={submitButtonStyle} 
            onClick={() => {
              console.log('company:', companyName, '\nemail:', email, '\npassword:', password);
              props.SubmitUser(companyName, email, password);}}>Submit</button>
          <button className={cancelButtonStyle}
            onClick={() => {props.handleCloseEditUser();}}>Close</button> 
        </div>

      </Modal>
    </div>
  )
}
