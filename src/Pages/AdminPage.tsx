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
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        <p className="text-5xl">Admin Page</p>
      </div>
      <div className="flex justify-end">
          <button onClick={openModal} className="outline bg-[#21345b] text-white h-[40px] w-[80%] rounded">Add User</button>
          <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={modalStyle}
          >
            <div className="space-x-3">
              <p className="text-3xl">Add User</p>
              <br/>
              <p>Company:</p>
              <input onChange={(e)=>setCompany(e.target.value)} className="outline rounded"/>
              <p>Name:</p>
              <input onChange={(e)=>setName(e.target.value)} className="outline rounded"/>
              <p>Email:</p>
              <input onChange={(e)=>setEmail(e.target.value)} className="outline rounded"/>
              <p>Password:</p>
              <input onChange={(e)=>setPassword(e.target.value)} className="outline rounded"/>
              <button className="rounded h-[40px] w-[80px] bg-lime-600">Submit</button>
              <button className="rounded h-[40px] w-[80px] bg-red-600" onClick={closeModal}>Close</button> 
            </div>
          </Modal>
      </div>
      <div className="col-span-4">
          <p className="text-3xl">Users</p>
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
                  <td className="outline"><p className="flex justify-center">{user.companyId}</p></td>
                  <td className="outline"><p className="flex justify-center">{user.name}</p></td>
                  <td className="outline"><p className="flex justify-center">{user.email}</p></td>
                  <td className="outline"><p className="flex justify-center">{user.password}</p></td>
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