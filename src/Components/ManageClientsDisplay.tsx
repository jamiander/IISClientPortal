import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Sorter from "../Services/Sorter";
import { Company, selectAllCompanies, updateCompanyInfo } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectAllUsers, User } from "../Store/UserSlice";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import UsersTable from "./UsersTable";



export default function ManageClientDisplay() {

  const fakeUser : User = {id: -1, email: 'fake@fake', password: 'fake', companyId: -1};
  const fakeCompany : Company = {id: -1, name: "N/A", initiatives: []}

  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userModalIsOpen, setUserIsOpen] = useState(false);
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(fakeUser);
  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);

  const userList = useAppSelector(selectAllUsers);
  const companyList = useAppSelector(selectAllCompanies);
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();




  function openUserModal(){
    setUserIsOpen(true);
  }
  function closeUserModal(){
    setUserIsOpen(false);
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
      name: companyName,
      initiatives: []
    }

    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    
    console.log('cypress: ' + isTest)

    //dispatch(addUser({user: newUser,isTest: isTest}));
    const validation = ValidateNewUser();
    if(validation.success)
    {
      dispatch(updateCompanyInfo({company: newCompany, employee: newUser, isTest: isTest}));
      ShowToast('New User Dispatched', 'Success');
      setCompanyName('');
      setName('');
      setEmail('');
      setPassword('');

      closeUserModal();
    }
    else
      ShowToast('Validation Failed: ' + validation.message, 'Error');
  }

  function SubmitUpdateUser(companyName: string, email: string, password: string)
  {
    const company: Company = {...selectedCompany, name: companyName};
    const user: User = {...selectedUser, email: email, password: password};

    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let validation = ValidateEdit(company.name, company.id, user.email, user.password, user.id)
    if(validation.success) {
      dispatch(updateCompanyInfo({ company: company, employee: user, isTest: isTest}));
      setSelectedCompany(fakeCompany); setSelectedUser(fakeUser);
      setEditUserIsOpen(false);
    }
    else
      ShowToast('Validation Failed: ' + validation.message, 'Error');
  }

  function ValidateNewUser() : {success: boolean, message: string}
  {
    let matchingCompany = companyList.find(company => company.name.toUpperCase() === companyName.toUpperCase());
    if(matchingCompany)
      return {success: false, message: "Cannot use the name of an existing company."};

    let matchingUser = userList.find(user => user.email.toUpperCase() === email.toUpperCase());
    if(matchingUser)
      return {success: false, message: "Cannot use the email of an existing user."};

    if(companyName && email && password)
      return {success: true, message: "Successfully validated new user!"}
    
    return {success: false, message: "Cannot leave any fields blank."};
  }

  function ValidateEdit(companyName: string, companyId: number, userEmail: string, userPassword: string, userId: number) : {message: string, success: boolean}
  {
    if(companyName && userEmail && userPassword && userId !== -1 && companyId !== -1)
    {
      let matchingUser = userList.find(indexedUser => indexedUser.email.toUpperCase() === userEmail.toUpperCase() && indexedUser.id !== userId);
      if(matchingUser)
        return {success: false, message: "Cannot use the email of an existing user."};

      let matchingCompany = companyList.find(indexedCompany => indexedCompany.name.toUpperCase() === companyName.toUpperCase() && indexedCompany.id !== companyId)
      if(matchingCompany)
        return {success: false, message: "Cannot use the name of an existing company."};

      return {success: true, message: "Successfully validated; all good!"};
    }
    return {success: false, message: "Cannot leave any fields blank."};
  }

  function handleEditClient(user: User, company?: Company) 
  {
    if(company)
    {
      setEditUserIsOpen(true);
      setSelectedCompany(company);
      setSelectedUser(user);
    }
    else
      console.log("Couldn't find company for user " + user.id + "in handleEditClient (adminpage)")
  }


  return (
    <div className="col-span-4">
      <div className="flex justify-between bg-[#2ed7c3] rounded-md p-2 pl-5">
        <p className="text-3xl h-[90%]">Clients</p>
        <AddUserModal userModalIsOpen={userModalIsOpen} closeUserModal={closeUserModal} openUserModal={openUserModal} setCompanyName={setCompanyName} setEmail={setEmail} setName={setName} setPassword={setPassword} companyList={companyList} submitNewUser={SubmitNewUser} />
      </div>
  
  
      <div>
        <input type='radio' id='showAll' value='all' name='clientDisplay'/>
        <label htmlFor='showAll'>Show All</label>
        <input type='radio' id='showActive' value='active' name='clientDisplay' defaultChecked/>
        <label htmlFor='showActive'>Only Active</label>
        <input type='radio' id='showInactive' value='inactive' name='clientDisplay'/>
        <label htmlFor='showInactive'>Only Inactive</label>
      </div>
      <div className="col-span-4 py-[10px] flex">
        <UsersTable userList={Sorter({users:userList})} companyList={companyList}/>
        <div className="w-[10%]">
          <div className="h-[25px]" />
          {
            Sorter({users:userList}).map((user, index) => {
              //const companyName = companyList.find(company => company.id === user.companyId)?.name ?? "n/a";
              const company = companyList.find(company => company.id === user.companyId);
              return (
                <div key={index} className={'py-[10px] my-[10px] flex self-end'}>
                  <button className=" mx-2 bg-[#21345b] text-sm text-white w-full h-10 rounded-md outline"
                    onClick={() => handleEditClient(user, company)}
                  >  
                      Edit Client
                  </button>
                </div>
              )
            })
          }
        </div>
        <EditUserModal EditUserIsOpen={EditUserIsOpen} setEditUserIsOpen={setEditUserIsOpen} user={selectedUser} company={selectedCompany} SubmitUpdateUser={SubmitUpdateUser} />
      </div>
    </div>
  )
}