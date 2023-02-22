import { useEffect, useState } from "react";
import Modal from "react-modal";
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from "../Styles";
import { Company } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice";

interface EditUserProps {
    EditUserIsOpen: boolean,
    setEditUserIsOpen: (value: boolean) => void,
    user: User,
    company: Company,
    SubmitUpdateUser: (companyName: string, email: string, password: string) => void,
}

export default function EditUserModal(props: EditUserProps) {
    const [companyName, setCompanyName] = useState(props.company.name);
    const [email, setEmail] = useState(props.user.email);
    const [password, setPassword] = useState(props.user.password);

    useEffect(() => {
        setCompanyName(props.company.name);
        setEmail(props.user.email);
        setPassword(props.user.password);
    }, [props.company,props.user])

    return (
        <div>
            <Modal
                isOpen={props.EditUserIsOpen}
                onRequestClose={() => props.setEditUserIsOpen(false)}
                style={{'content': {...modalStyle.content, 'width' : '25%'}}}
                appElement={document.getElementById('root') as HTMLElement}
            >
                <h4 className="text-3xl mb-3">Edit User</h4>

                <div className="w-full">
                    <p className='my-1'>Company Name:</p>
                    <input defaultValue={props.company.name} onChange={(e) => setCompanyName(e.target.value)} id="modalCompany"  className={inputStyle}/>

                    <p className='my-1'>Email:</p>            
                    <input defaultValue={props.user.email} onChange={(e) => setEmail(e.target.value)}  id="modalEmail"  className={inputStyle}/>

                    <p className='my-1'>Password:</p>
                    <input defaultValue={props.user.password} onChange={(e) => setPassword(e.target.value)}  id="modalPassword" className={inputStyle}/>
                </div>

                <div className='mt-2 h-10'>
                    <button className={submitButtonStyle} onClick={() => {props.SubmitUpdateUser(companyName, email, password)}}>Submit</button>
                    <button className={cancelButtonStyle} onClick={() => props.setEditUserIsOpen(false)}>Close</button> 
                </div>

            </Modal>
        </div>
    )
}
