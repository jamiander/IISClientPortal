import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AddUserModal from "../Components/AddUserModal";
import EditUserModal from "../Components/EditUserModal";
import UsersTable from "../Components/UsersTable";
import Sorter from "../Services/Sorter";
import { Company, getCompanyInfo, selectAllCompanies, updateCompanyInfo } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectAllUsers, User } from "../Store/UserSlice";

export const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    outline : '3px solid #2ed7c3',
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
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();
  
  
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

  const fakeUser : User = {id: -1, email: 'fake@fake', password: 'fake', companyId: -1};
  const [selectedUser, setSelectedUser] = useState(fakeUser);

  const fakeCompany : Company = {id: -1, name: "N/A"}
  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);

  function handleClick(user: User, company?: Company) {
    if(company)
    {
      setEditUserIsOpen(true);
      setSelectedCompany(company);
      setSelectedUser(user);
    }
    else
      console.log("Couldn't find company for user " + user.id + "in handleClick (adminpage)")
  }

  function SubmitUpdateUser(companyName: string, email: string, password: string) {

    let company;
    let user;

    if (companyName !== 'N/A')
      company = {...selectedCompany, name: companyName};
    else company = selectedCompany;

    if (email !== 'fake@fake')
      user = {...selectedUser, email: email}
    if (password !== 'fake')
      user = {...selectedUser, password: password}
    else user = selectedUser

    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    if (ValidateEdit(companyName, selectedCompany.id, email, password, selectedUser.id)) {
      dispatch(updateCompanyInfo({ company: company, employee: user, isTest: isTest}));
      ShowToast('User Update Dispatched', 'Success');
      setSelectedCompany(fakeCompany); setSelectedUser(fakeUser);
    }
    setEditUserIsOpen(false);
  }

  function ValidateEdit(companyName: string, companyId: number, userEmail: string, userPassword: string, userId: number)
  {
    if(companyName && userEmail && userPassword && userId !== -1 && companyId !== -1)
    {
      let matchingUser = userList.find(indexedUser => indexedUser.email === userEmail && indexedUser.id !== userId);
      if(matchingUser)
        return false;

      let matchingCompany = companyList.find(indexedCompany => indexedCompany.name === companyName && indexedCompany.id !== companyId)
      if(matchingCompany)
        return false;

      return true;
    }
    return false;
  }

  return(
  <>
    <div className="m-[2%] grid grid-cols-4">
  
      <div className="col-span-3">
        <p className="text-5xl py-[10px]">Admin Page</p>
      </div>
  
      <div className="col-span-3 bg-[#2ed7c3] rounded-md p-2 pl-5">
        <p className="text-3xl h-[90%]">Users</p>
      </div>
  
      <AddUserModal userModalIsOpen={userModalIsOpen} closeUserModal={closeUserModal} openUserModal={openUserModal} setCompanyName={setCompanyName} setEmail={setEmail} setName={setName} setPassword={setPassword} companyList={companyList} validateUser={ValidateUser} submitNewUser={SubmitNewUser} />
  
      <div className="col-span-4 py-[10px] flex">
        <UsersTable userList={Sorter({users:userList})} companyList={companyList}/>
        <div className="w-[10%]">
        <div className="h-[25px]"></div>
          {
            Sorter({users:userList}).map((user, index) => {
              //const companyName = companyList.find(company => company.id === user.companyId)?.name ?? "n/a";
              const company = companyList.find(company => company.id === user.companyId);
              return (
                <div key={index} className={'py-[10px] my-[10px] flex self-end'}>
                  <button className="my-5 mx-2 bg-[#21345b] text-sm text-white w-[100%] h-[25px] rounded-md outline"
                    onClick={() => handleClick(user, company)}
                  >  
                      Edit User
                  </button>
                </div>
              )
            })
          }
        </div>
      </div>
  
      <EditUserModal EditUserIsOpen={EditUserIsOpen} setEditUserIsOpen={setEditUserIsOpen} user={selectedUser} company={selectedCompany} SubmitUpdateUser={SubmitUpdateUser} ValidateEdit={ValidateEdit} />

      {/* <div className="col-span-3">
        <p className="text-3xl bg-[#2ed7c3] rounded my-1 h-[75%]">Companies</p>
      </div>
  
      <AddCompanyModal companyModalIsOpen={companyModalIsOpen} closeCompanyModal={closeCompanyModal} openCompanyModal={openCompanyModal} validateCompany={ValidateCompany} setCompanyName={setCompanyName} submitNewCompany={SubmitNewCompany} />
      
      <div className="col-span-4 py-[10px]">
        <CompaniesTable/>
      </div> */}
    </div>
  </>
  )
}