import { useState } from "react"
import Modal from 'react-modal'
import CompaniesTable from "../Components/CompaniesTable";
import UsersTable from "../Components/UsersTable";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { addUser, selectAllUsers, User } from "../Store/UserSlice";

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
  const dispatch = useAppDispatch();
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userModalIsOpen, setUserIsOpen] = useState(false);
  const [companyModalIsOpen, setCompanyIsOpen] = useState(false);
  const userlist = useAppSelector(selectAllUsers);

  function openCompanyModal(){
    setCompanyIsOpen(true);
  }
  function closeCompanyModal(){
    setCompanyIsOpen(false);
  }

  function openUserModal(){
    setUserIsOpen(true);
  }
  function closeUserModal(){
    setUserIsOpen(false);
  }

  function ValidateInput()
  {
    if(!Number.isNaN(parseInt(company)) && email && password)
      return true;
    
    return false;
  }

  function Submit()
  {
    let newUser: User = {
      id: -1,
      companyId: parseInt(company),
      email: email,
      password: password
    }
    if(name)
      newUser.name = name;
    
    let isTest = false;
    if((window as any).Cypress)//process.env.CYPRESS)
      isTest = true;
    
    console.log('cypress: ' + isTest)

    dispatch(addUser({user: newUser,isTest: isTest}));

    setCompany('');
    setName('');
    setEmail('');
    setPassword('');

    closeUserModal();
  }

  return(
  <>
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-3">
        <p className="text-5xl">Admin Page</p>
      </div>
    <div className="col-span-3">
      <p className="text-3xl">Users</p>
    </div>
    <div className="flex justify-end">
    <button onClick={openUserModal} className="outline bg-[#21345b] text-white h-[40px] w-[80%] rounded">Add User</button>
        <Modal
            isOpen={userModalIsOpen}
            onRequestClose={closeUserModal}
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
          <button disabled={!ValidateInput()} className="rounded h-[40px] w-[80px] bg-lime-600" onClick={() => Submit()}>Submit</button>
          <button className="rounded h-[40px] w-[80px] bg-red-600" onClick={closeUserModal}>Close</button> 
        </div>
      </Modal>
    </div>
    <div className="col-span-4">
      <UsersTable/>
    </div>
    <div className="col-span-3">
      <p className="text-3xl">Companies</p>
    </div>
    <div className="flex justify-end">
    <button onClick={openCompanyModal} className="outline bg-[#21345b] text-white h-[40px] w-[80%] rounded">Add Company</button>
    <Modal
            isOpen={companyModalIsOpen}
            onRequestClose={closeCompanyModal}
            style={modalStyle}
        >
        <div className="space-x-3">
          <p className="text-3xl">Add Company</p>
          <br/>
          <button disabled={!ValidateInput()} className="rounded h-[40px] w-[80px] bg-lime-600">Submit</button>
          <button className="rounded h-[40px] w-[80px] bg-red-600" onClick={closeCompanyModal}>Close</button> 
        </div>  
      </Modal>
    </div>
    <div className="col-span-4">
      <CompaniesTable/>
    </div>
  </div>
  </>
  )
}