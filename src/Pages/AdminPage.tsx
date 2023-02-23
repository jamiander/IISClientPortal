import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AddInitiativeModal from "../Components/AddInitiativeModal";
import AddUserModal from "../Components/AddUserModal";
import EditInitiativeModal from "../Components/EditInitiativeModal";
import EditUserModal from "../Components/EditUserModal";
import InitiativesTable from "../Components/InitiativesTable";
import UsersTable from "../Components/UsersTable";
import { DateInfo, UpdateCompanyInfoRequest } from "../Services/CompanyService";
import Sorter from "../Services/Sorter";
import { Company, getCompanyInfo, Initiative, selectAllCompanies, updateCompanyInfo, updateInitiativeInfo } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectAllUsers, selectCurrentUser, User } from "../Store/UserSlice";

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
  const currentUser = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  
  useEffect(() => {
    let kickThemOut = true;
    if(currentUser)
    {
      if(currentUser.companyId === 0)
      {
        kickThemOut = false;
      }
    }
    if(kickThemOut)
      navigate('/Login');
  }, [currentUser])


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

  const [AddInitiativeIsOpen, setAddInitiativeIsOpen] = useState(false);
  const [EditInitiativeIsOpen, setEditInitiativeIsOpen] = useState(false);

  function handleEditClient(user: User, company?: Company) {
    if(company)
    {
      setEditUserIsOpen(true);
      setSelectedCompany(company);
      setSelectedUser(user);
    }
    else
      console.log("Couldn't find company for user " + user.id + "in handleEditClient (adminpage)")
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

  function SubmitUpdateInitiative(initiative: Initiative, companyId: number)
  {
    console.log('initiative @ submitUpdateInitiative', initiative);

    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let validation = ValidateNewInitiative(initiative, companyId);
    if(validation.success)
    {
      ShowToast('New Initiative Dispatched', 'Success');
      dispatch(updateInitiativeInfo({initiative: initiative, companyId: companyId, isTest: isTest}))
      setAddInitiativeIsOpen(false); setEditInitiativeIsOpen(false);
      setSelectedCompany(fakeCompany); setSelectedInitiative(fakeInitiative);
    }
    else
      ShowToast('Validation Failed: ' + validation.message,'Error');
  }

  function ValidateNewInitiative(initiative: Initiative, companyId: number) : {success: boolean, message: string}
  {
    if (!initiative.title || !initiative.targetDate.month || !initiative.targetDate.day || !initiative.targetDate.year || !initiative.totalItems)
      return {success: false, message: "Cannot leave any fields blank."};

    let dateValidation = ValidateDate(initiative.targetDate)
    if(!dateValidation.success)
      return dateValidation;

    if(initiative.totalItems < 0)
      return {success: false, message: "Total items must be a positive value."};

    const matchingCompany = companyList.find(company => company.id === companyId);
    if(!matchingCompany)
      return {success: false, message: "A company must be selected."};

      console.log(`title: ${initiative.title}`)
    const matchingInitiative = matchingCompany.initiatives.find(init => init.title === initiative.title && init.id !== initiative.id);
    if(matchingInitiative)
      return {success: false, message: "Initiative names must be unique."}

    return {success: true, message: "Successfully validated; all good!"};
  }

  function ValidateDate(date: DateInfo) : {success: boolean, message: string}
  {
    let month = parseInt(date.month);
    if(month < 1 || month > 12 || Number.isNaN(month))
      return {success: false, message: "Month must be between 1 and 12"};

    let day = parseInt(date.day);
    if(day < 1 || day > 31 || Number.isNaN(day))
      return {success: false, message: "Day must be between 1 and 31"};

    let year = parseInt(date.year);    //TODO: there's probably a better way to validate years
    if(year < 0 || year > 9999 || Number.isNaN(year))
      return {success: false, message: "Year must be a positive value."};

      return {success: true, message: "Date is all good!"}
  }

  const fakeInitiative : Initiative = {id: -1, title: "N/A", totalItems: 0, targetDate: {month: "0", day: "0", year: "0000"}, itemsCompletedOnDate: []}
  const [selectedInitiative, setSelectedInitiative] = useState(fakeInitiative);

    
  function handleEditInitiative(company: Company, initiative: Initiative) {
    if (company) 
    {
      setEditInitiativeIsOpen(true);
      setSelectedInitiative(initiative);
      setSelectedCompany(company);
    } else
      console.log("Couldn't find company at handleEditInitiative (adminpage)")
  }

  return(
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
  
      <div className="col-span-3 mb-4">
        <p className="text-5xl">Admin Page</p>
      </div>
  
      <div className="col-span-3 bg-[#2ed7c3] rounded-md p-2 pl-5">
        <p className="text-3xl h-[90%]">Clients</p>
      </div>
  
      <AddUserModal userModalIsOpen={userModalIsOpen} closeUserModal={closeUserModal} openUserModal={openUserModal} setCompanyName={setCompanyName} setEmail={setEmail} setName={setName} setPassword={setPassword} companyList={companyList} submitNewUser={SubmitNewUser} />
  
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

      <div className="col-span-3 bg-[#2ed7c3] rounded-md p-2 pl-5">
        <p className="text-3xl h-[90%]">Initiatives</p>
      </div>
      <AddInitiativeModal addInitiativeIsOpen={AddInitiativeIsOpen} setInitiativeIsOpen={setAddInitiativeIsOpen} Submit={SubmitUpdateInitiative} companyList={companyList}/>
        
      <div className="col-span-4 py-[10px] flex">
        <InitiativesTable companyList={companyList}/>

        <div className="w-[10%]">
          <div className="h-[25px]" />
          {
            companyList.map((company, index) => {
              return (
                company.initiatives.map((initiative, index) => {
                  return (
                    <div key={index} className={'py-1 flex self-end'}>
                      <button className=" mx-2 bg-[#21345b] text-sm text-white w-full h-8 rounded-md outline"
                        onClick={() => handleEditInitiative(company, initiative)}
                      >
                        Edit Initiative
                      </button>
                    </div>
                  )
                })
              )
            })
          }
        </div>
        <EditInitiativeModal editInitiativeIsOpen={EditInitiativeIsOpen} setEditInitiativeIsOpen={setEditInitiativeIsOpen} initiative={selectedInitiative} company={selectedCompany} submitUpdateInitiative={SubmitUpdateInitiative}/>
      </div>

      {/* <div className="col-span-3">
        <p className="text-3xl bg-[#2ed7c3] rounded my-1 h-[75%]">Companies</p>
      </div>
  
      <AddCompanyModal companyModalIsOpen={companyModalIsOpen} closeCompanyModal={closeCompanyModal} openCompanyModal={openCompanyModal} validateCompany={ValidateCompany} setCompanyName={setCompanyName} submitNewCompany={SubmitNewCompany} />
      
      <div className="col-span-4 py-[10px]">
        <CompaniesTable/>
      </div> */}

    </div>
  )
}