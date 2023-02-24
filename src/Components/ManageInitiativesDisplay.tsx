import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DateInfo } from "../Services/CompanyService";
import InitiativesFilter from "../Services/InitiativesFilter"
import { Company, Initiative, selectAllCompanies, updateInitiativeInfo } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectAllUsers, User } from "../Store/UserSlice";
import AddInitiativeModal from "./AddInitiativeModal"
import EditInitiativeModal from "./EditInitiativeModal"
import InitiativesTable from "./InitiativesTable"

export default function ManageInitiativesDisplay() {

  const fakeUser : User = {id: -1, email: 'fake@fake', password: 'fake', companyId: -1};
  const fakeCompany : Company = {id: -1, name: "N/A", initiatives: []}
  const fakeInitiative : Initiative = {id: -1, title: "N/A", totalItems: 0, targetDate: {month: "0", day: "0", year: "0000"}, itemsCompletedOnDate: []}

  const userList = useAppSelector(selectAllUsers);
  const companyList = useAppSelector(selectAllCompanies);

  const [selectedUser, setSelectedUser] = useState(fakeUser);
  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);
  const [selectedInitiative, setSelectedInitiative] = useState(fakeInitiative);
  const [AddInitiativeIsOpen, setAddInitiativeIsOpen] = useState(false);
  const [EditInitiativeIsOpen, setEditInitiativeIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();

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
    
  function handleEditInitiative(company: Company, initiative: Initiative) {
    if (company) 
    {
      setEditInitiativeIsOpen(true);
      setSelectedInitiative(initiative);
      setSelectedCompany(company);
    } else
      console.log("Couldn't find company at handleEditInitiative (adminpage)")
  }


  return (
  <div className="col-span-4">
    <div className="bg-[#2ed7c3] rounded-md p-2 pl-5">

      <div className="w-full flex justify-between">
        <p className="text-3xl h-[90%]">Initiatives</p>
        <AddInitiativeModal addInitiativeIsOpen={AddInitiativeIsOpen} setInitiativeIsOpen={setAddInitiativeIsOpen} Submit={SubmitUpdateInitiative} companyList={companyList}/>
      </div>


      <div className="w-fit justify-center mt-2 py-1 px-5 outline outline-1 outline-[#879794] rounded">
        <input type='radio' id='showAll' value='all' name='clientDisplay' className="mr-1"/>
        <label htmlFor='showAll' className="mr-5">Show All</label>

        <input type='radio' id='showActive' value='active' name='clientDisplay' defaultChecked className="mr-1"/>
        <label htmlFor='showActive' className="mr-5">Only Active</label>

        <input type='radio' id='showInactive' value='inactive' name='clientDisplay' className="mr-1"/>
        <label htmlFor='showInactive' className="">Only Inactive</label>
      </div>

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
  </div>
  )
}