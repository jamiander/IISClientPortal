import { useState } from "react";
import Modal from "react-modal";
import { modalStyle } from "../Pages/AdminPage";
import { User } from "../Store/UserSlice";

interface EditUserProps {
    EditUserIsOpen: boolean,
    setEditUserIsOpen: (value: boolean) => void,
    user: User,
    companyName: string
}

export default function EditUserModal(props: EditUserProps) {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <button className="ml-1 bg-[#21345b] text-white w-[90%] h-[90%] rounded-md"
                onClick={() => props.setEditUserIsOpen(true)}
            >  
                Edit User
            </button>
            <Modal
                isOpen={props.EditUserIsOpen}
                onRequestClose={() => props.setEditUserIsOpen(false)}
                style={modalStyle}
            >
                <h4 className="mb-3">Edit User</h4>

                <p className='my-1'>Company Name:</p>
                <input defaultValue={props.companyName} onChange={(e) => setCompanyName(e.target.value)} id="modalUsername"  className="outline rounded outline-1 p-2"/>

                <p className='my-1'>Email:</p>            
                <input defaultValue={props.user.email} onChange={(e) => setEmail(e.target.value)}  id="modalEmail"  className="outline rounded outline-1 p-2"/>

                <p className='my-1'>Password:</p>
                <input defaultValue={props.user.password} onChange={(e) => setPassword(e.target.value)}  id="modalPassword" className="outline rounded outline-1 p-2"/>

                <button className="m-2 mr-1 rounded-md h-[40px] w-[80px] bg-lime-600">Submit</button>
                <button className="m-2 ml-1 rounded-md h-[40px] w-[80px] bg-red-600" onClick={() => props.setEditUserIsOpen(false)}>Close</button> 

            </Modal>
        </div>
    )
}
