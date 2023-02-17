import { useState } from "react";
import Modal from 'react-modal';
import { AddCompanyModal } from "../Components/AddCompanyModal";
import CompaniesTable from "../Components/CompaniesTable";
import UsersTable from "../Components/UsersTable";
import { addCompany, Company, selectAllCompanies } from "../Store/CompanySlice";
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
  const [companyName, setCompanyName] = useState('');
  const userList = useAppSelector(selectAllUsers);
  const companyList = useAppSelector(selectAllCompanies);
  
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

  function ValidateUser()
  {
    let companyId = parseInt(company);
    if(!Number.isNaN(companyId) && companyId >= 0 && email && password)
      return true;
    
    return false;
  }

  function SubmitNewUser()
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

  function ValidateCompany()
  {
    if(companyName)
      return true;
    return false;
  }

  function SubmitNewCompany()
  {
    let newCompany: Company = {
      id: -1,
      name: companyName,
    }
      
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
      
    console.log('cypress: ' + isTest)
  
    dispatch(addCompany({company: newCompany, isTest: isTest}));
  
    setCompanyName('');
  
    closeCompanyModal();
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
          <select className="outline rounded" onChange={(e)=>setCompany(e.target.value)}>
            <option value={-1}></option>
              {companyList.map((company,index) => {
                return (
                  <option key={index} value={company.id}>{company.name}</option>
                )
              })}
          </select><p>Name:</p>
          <input onChange={(e)=>setName(e.target.value)} className="outline rounded"/>
          <p>Email:</p>
          <input onChange={(e)=>setEmail(e.target.value)} className="outline rounded"/>
          <p>Password:</p>
          <input onChange={(e)=>setPassword(e.target.value)} className="outline rounded"/>
          <button disabled={!ValidateUser()} className="rounded h-[40px] w-[80px] bg-lime-600" onClick={() => SubmitNewUser()}>Submit</button>
          <button className="rounded h-[40px] w-[80px] bg-red-600" onClick={closeUserModal}>Close</button> 
        </div>
      </Modal>
    </div>
    <div className="col-span-4">
      <UsersTable userList={userList} companyList={companyList}/>
    </div>
    <div className="col-span-3">
      <p className="text-3xl ">Companies</p>
    </div>
    <div className="flex justify-end">
      <button onClick={openCompanyModal} className="outline bg-[#21345b] text-white h-[40px] w-[80%] rounded">Add Company</button>
      <AddCompanyModal modalStyle={modalStyle} companyModalIsOpen={companyModalIsOpen} closeCompanyModal={closeCompanyModal} validateCompany={ValidateCompany} setCompanyName={setCompanyName} submitNewCompany={SubmitNewCompany} />
    </div>
    <div className="col-span-4 py-[5px]">
      <CompaniesTable/>
    </div>
  </div>
  </>
  )
}