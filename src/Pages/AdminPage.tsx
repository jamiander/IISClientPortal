import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AddCompanyModal from "../Components/AddCompanyModal";
import AddUserModal from "../Components/AddUserModal";
import CompaniesTable from "../Components/CompaniesTable";
import { ToastDetails } from "../Components/Toast";
import UsersTable from "../Components/UsersTable";
import { /*addCompany,*/ Company, getCompanyInfo, selectAllCompanies, updateCompanyInfo } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { /*addUser,*/ selectAllUsers, User } from "../Store/UserSlice";

export const modalStyle = {
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
  //const [companyId, setCompanyId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userModalIsOpen, setUserIsOpen] = useState(false);
  //const [companyModalIsOpen, setCompanyIsOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const userList = useAppSelector(selectAllUsers);
  const companyList = useAppSelector(selectAllCompanies);
  // const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();
  
  // ShowToast('testing outlet', 'Info');
  
  /*function openCompanyModal(){
    setCompanyIsOpen(true);
  }
  function closeCompanyModal(){
    setCompanyIsOpen(false);
  }*/

  function openUserModal(){
    setUserIsOpen(true);
  }
  function closeUserModal(){
    setUserIsOpen(false);
  }

  function ValidateUser()
  {
    let matchingCompany = companyList.find(company => company.name === companyName);
    if(matchingCompany)
      return false;

    if(companyName && email && password)
      return true;
    
    return false;
  }

  function SubmitNewUser()
  {
    let newCompanyId = -1;
  
    let newUser: User = {
      id: -1,
      companyId: newCompanyId,
      email: email,
      password: password
    }
    if(name)
      newUser.name = name;
    
    let newCompany: Company = {
      id: newCompanyId,
      name: companyName
    }

    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    
    console.log('cypress: ' + isTest)

    //dispatch(addUser({user: newUser,isTest: isTest}));
    dispatch(updateCompanyInfo({company: newCompany, employee: newUser, isTest: isTest}));

    setCompanyName('');
    setName('');
    setEmail('');
    setPassword('');

    closeUserModal();
  }

  /*function ValidateCompany()
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
  
    //dispatch(addCompany({company: newCompany, isTest: isTest}));
  
    setCompanyName('');
  
    closeCompanyModal();
  }*/

  useEffect(() => {
    dispatch(getCompanyInfo({})); //no args; admins get all companies/users
  },[])

  return(
  <>
    <div className="m-[2%] grid grid-cols-4">
  
      <div className="col-span-3">
        <p className="text-5xl py-[10px]">Admin Page</p>
      </div>
  
      <div className="col-span-3">
        <p className="text-3xl bg-[#2ed7c3] rounded h-[90%]">Users</p>
      </div>
  
      <AddUserModal userModalIsOpen={userModalIsOpen} closeUserModal={closeUserModal} openUserModal={openUserModal} setCompanyName={setCompanyName} setEmail={setEmail} setName={setName} setPassword={setPassword} companyList={companyList} validateUser={ValidateUser} submitNewUser={SubmitNewUser} />
  
      <div className="col-span-4 py-[10px]">
        <UsersTable userList={userList} companyList={companyList}/>
      </div>
  
      <div className="col-span-3">
        <p className="text-3xl bg-[#2ed7c3] rounded my-1 h-[75%]">Companies</p>
      </div>
  
      {/*<AddCompanyModal companyModalIsOpen={companyModalIsOpen} closeCompanyModal={closeCompanyModal} openCompanyModal={openCompanyModal} validateCompany={ValidateCompany} setCompanyName={setCompanyName} submitNewCompany={SubmitNewCompany} />
      */}

      <div className="col-span-4 py-[10px]">
        <CompaniesTable/>
      </div>
    </div>
  </>
  )
}