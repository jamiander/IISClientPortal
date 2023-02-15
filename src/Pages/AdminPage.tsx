import { useState } from "react"
import Modal from 'react-modal'
import { useAppSelector } from "../Store/Hooks";
import { selectAllUsers } from "../Store/UserSlice";

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
  const userlist = useAppSelector(selectAllUsers);
  function openModal(){
    setIsOpen(true);
  }
  function closeModal(){
    setIsOpen(false);
  }
  return(
  <>
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-3">
        <text className="text-5xl">Admin Page</text>
      </div>
      <div className="flex justify-end">
          <button onClick={openModal} className="outline bg-[#21345b] text-white h-[40px] w-[80%] rounded">Add User</button>
          <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={modalStyle}
          >
            <div className="space-x-3">
              <text className="text-3xl">Add User</text>
              <br/>
              <text>Company:</text>
              <input className="outline rounded"/>
              <text>Name:</text>
              <input className="outline rounded"/>
              <text>Email:</text>
              <input className="outline rounded"/>
              <text>Password:</text>
              <input className="outline rounded"/>
              <button className="rounded h-[40px] w-[80px] bg-lime-600">Submit</button>
              <button className="rounded h-[40px] w-[80px] bg-red-600" onClick={closeModal}>Close</button> 
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
            {userlist.map((user, index)=>{
              return(
                <tr key={index}>
                  <td className="outline"><text className="flex justify-center">{user.companyId}</text></td>
                  <td className="outline"><text className="flex justify-center">{user.name}</text></td>
                  <td className="outline"><text className="flex justify-center">{user.email}</text></td>
                  <td className="outline"><text className="flex justify-center">{user.password}</text></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
  </div>
  </>
  )
}