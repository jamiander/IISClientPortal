import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AddInitiativeModal from "../Components/AddInitiativeModal";
import AddUserModal from "../Components/AddUserModal";
import EditUserModal from "../Components/EditUserModal";
import InitiativesTable from "../Components/InitiativesTable";
import UsersTable from "../Components/UsersTable";
import { DateInfo, UpdateCompanyInfoRequest } from "../Services/CompanyService";
import Sorter from "../Services/Sorter";
import { Company, getCompanyInfo, Initiative, selectAllCompanies, updateCompanyInfo, updateInitiativeInfo } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectAllUsers, User } from "../Store/UserSlice";

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

  const fakeCompany : Company = {id: -1, name: "N/A", initiatives: []}
  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);

  const [AddInitiativeIsOpen, setInitiativeIsOpen] = useState(false);

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
      ShowToast('User Update Dispatched', 'Success');
      setSelectedCompany(fakeCompany); setSelectedUser(fakeUser);
      setEditUserIsOpen(false);
    }
    else
      ShowToast('Validation Failed: ' + validation.message, 'Error');
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

  function SubmitNewInitiative(title: string, targetDate: DateInfo, totalItems: number, companyId: number)
  {
    const initiative: Initiative = {
      id: -1,
      title: title,
      targetDate: targetDate,
      totalItems: totalItems,
      itemsCompletedOnDate: []
    }

    console.log(initiative);

    let isTest = true//false;
    if((window as any).Cypress)
      isTest = true;

    let validation = ValidateNewInitiative(initiative, companyId);
    if(validation.success)
    {
      dispatch(updateInitiativeInfo({initiative: initiative, companyId: companyId, isTest: isTest}))
      setInitiativeIsOpen(false);
    }
    else
      ShowToast(validation.message,'Error');
  }

  function ValidateNewInitiative(initiative: Initiative, companyId: number) : {success: boolean, message: string}
  {
    // let initiativeList = companyList.map((company) => company.initiatives).flat();
    // console.log('initiative list', initiativeList);
    if(initiative.totalItems < 0)
      return {success: false, message: "Total items must be a positive value."}

    const matchingCompany = companyList.find(company => company.id === companyId);
    if(!matchingCompany)
      return {success: false, message: "A company must be selected."}

    if (initiative.title && initiative.targetDate.month && initiative.targetDate.day && initiative.targetDate.year){
        return {success: true, message: "Successfully validated; all good!"};
    }

    return {success: false, message: "Cannot leave any fields blank."};

  }

  return(
  <>
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
  
      <div className="col-span-3 mb-4">
        <p className="text-5xl">Admin Page</p>
      </div>
  
      <div className="col-span-3 bg-[#2ed7c3] rounded-md p-2 pl-5">
        <p className="text-3xl h-[90%]">Users</p>
      </div>
  
      <AddUserModal userModalIsOpen={userModalIsOpen} closeUserModal={closeUserModal} openUserModal={openUserModal} setCompanyName={setCompanyName} setEmail={setEmail} setName={setName} setPassword={setPassword} companyList={companyList} submitNewUser={SubmitNewUser} />
  
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
                  <button className=" mx-2 bg-[#21345b] text-sm text-white w-[100%] h-10 rounded-md outline"
                    onClick={() => handleClick(user, company)}
                  >  
                      Edit User
                  </button>
                </div>
              )
            })
          }
        </div>
        <EditUserModal EditUserIsOpen={EditUserIsOpen} setEditUserIsOpen={setEditUserIsOpen} user={selectedUser} company={selectedCompany} SubmitUpdateUser={SubmitUpdateUser} />
      </div>

      <div className="col-span-3 bg-[#2ed7c3] rounded-md p-2 pl-5">
        <p className="text-3xl h-[90%]">Initiatives</p>
      </div>
      <AddInitiativeModal addInitiativeIsOpen={AddInitiativeIsOpen} setInitiativeIsOpen={setInitiativeIsOpen} Submit={SubmitNewInitiative} companyList={companyList}/>
        
      <div className="col-span-4 py-[10px] flex">
        <InitiativesTable companyList={companyList}/>

      </div>

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