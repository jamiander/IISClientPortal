import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AddInitiativeModal from "../Components/AddInitiativeModal";
import AddUserModal from "../Components/AddUserModal";
import EditInitiativeModal from "../Components/EditInitiativeModal";
import EditUserModal from "../Components/EditUserModal";
import InitiativesTable from "../Components/InitiativesTable";
import ManageClientDisplay from "../Components/ManageClientsDisplay";
import UsersTable from "../Components/UsersTable";
import { DateInfo, UpdateCompanyInfoRequest } from "../Services/CompanyService";
import InitiativesFilter from "../Services/InitiativesFilter";
import Sorter from "../Services/Sorter";
import { Company, getCompanyInfo, Initiative, selectAllCompanies, updateCompanyInfo, updateInitiativeInfo } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectAllUsers, selectCurrentUser, selectIsLoggedIn, User } from "../Store/UserSlice";

export default function AdminPage(){
  const dispatch = useAppDispatch();
  //const [companyId, setCompanyId] = useState('');
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

  const [AddInitiativeIsOpen, setAddInitiativeIsOpen] = useState(false);
  const [EditInitiativeIsOpen, setEditInitiativeIsOpen] = useState(false);

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
    
      <div className="col-span-4 mb-4 h-fit">
        <p className="text-5xl">Admin Page</p>
      </div>
  
      <ManageClientDisplay />

      <div className="col-span-3 bg-[#2ed7c3] rounded-md p-2 pl-5">
        <p className="text-3xl h-[90%]">Initiatives</p>
      </div>
      <AddInitiativeModal addInitiativeIsOpen={AddInitiativeIsOpen} setInitiativeIsOpen={setAddInitiativeIsOpen} Submit={SubmitUpdateInitiative} companyList={companyList}/>
      
      <div>
        <input type='radio' id='showAll' value='all' name='clientDisplay'/>
        <label htmlFor='showAll'>Show All</label>
        <input type='radio' id='showActive' value='active' name='clientDisplay' defaultChecked/>
        <label htmlFor='showActive'>Only Active</label>
        <input type='radio' id='showInactive' value='inactive' name='clientDisplay'/>
        <label htmlFor='showInactive'>Only Inactive</label>
      </div>

      <div className="col-span-4 py-[10px] flex">
        <InitiativesTable companyList={companyList}/>
        <div className="w-[10%]">
          <div className="h-[25px]" />
          {
            companyList.map((company, index) => {
              return (
                InitiativesFilter(company.initiatives).map((initiative, index) => {
                //company.initiatives.map((initiative, index) => {
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