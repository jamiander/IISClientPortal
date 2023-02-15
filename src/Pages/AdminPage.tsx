import { useState } from "react"
import Modal from 'react-modal'

const modalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    }
}

export default function AdminPage(){
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal(){
        setIsOpen(true);
    }
    function closeModal(){
        setIsOpen(false);
    }
    return(
        <>
        <div className="grid grid-cols-4">
            <div className="col-span-3">
                <text className="text-5xl">Admin Page</text>
            </div>
            <div className="flex justify-end">
                <button onClick={openModal} className="outline bg-[#2ed7c3] h-[40px] w-[80%] rounded">Add User</button>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={modalStyle}
                >
                    <div>
                        <text className="text-3xl">Add User</text>
                        <button onClick={closeModal}>close</button>
                        <div>I am a modal</div>
                    </div>
                    
                </Modal>
            </div>
            <div className="col-span-4">
                <text className="text-3xl">Users</text>
            </div>
            <div className="col-span-4">
                <table className="table-auto w-[100%] outline">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>user.company</td>
                            <td>user.name</td>
                            <td>user.email</td>
                            <td>user.password</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}