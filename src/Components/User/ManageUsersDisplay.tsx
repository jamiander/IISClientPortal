import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Sorter from "../../Services/Sorter";
import { ValidateEditUser, ValidateNewCompany, ValidationFailedPrefix } from "../../Services/Validation";
import { Company, selectAllCompanies, upsertCompanyInfo } from "../../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { selectAllUsers, User } from "../../Store/UserSlice";
import UpdateUserListModal from "./UpdateUserListModal";
import UsersTable from "./UsersTable";
import { RadioSet } from "../RadioSet";
import { yellowButtonStyle } from "../../Styles";

export const UserDisplayRadioIds = {
  all: "userDisplayShowAll",
  active: "userDisplayShowActive",
  inactive: "userDisplayShowInactive"
}

export default function ManageUsersDisplay() {
  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);

  const [radioValue, setRadioValue] = useState('active')

  const companyList = useAppSelector(selectAllCompanies);

  const fakeCompany : Company = {id: "-1", name: "", initiatives: []}

  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);

  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();

  function SubmitUpdateUser(companyName: string)
  {
    const company: Company = {...selectedCompany, name: companyName};

    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let validation;

    if (isEdit) validation = ValidateEditUser(company.name, companyList);
    else validation = ValidateNewCompany(company.name, companyList);

    if(validation.success) {
      dispatch(upsertCompanyInfo({ company: company, isTest: isTest}));
      handleCloseEditUser();
    }
    else
      ShowToast(ValidationFailedPrefix + validation.message, 'Error');
  }
  
  function handleEditUser(company?: Company) 
    {
      if(company)
      {
        setIsEdit(true);
        setEditUserIsOpen(true);
        setSelectedCompany(company);
      }
      else
        console.log("Couldn't find company for user in handleEditClient (adminpage)")
    }
  
  function handleCloseEditUser() {
    setEditUserIsOpen(false);
    setSelectedCompany(fakeCompany);
  }

  return (
    <div className="col-span-4">
      <div className="bg-[#445362] rounded-md py-3 px-5">

        <div className="w-full flex justify-between">
          <p className="text-3xl text-white">Clients</p>
          <button className={yellowButtonStyle} onClick={() => {setEditUserIsOpen(true); setIsEdit(false);}} >  
            Add Client
          </button>
        </div>
  
        <RadioSet options={[
        {id: UserDisplayRadioIds.all, label: "Show All", value: "all"},
        {id: UserDisplayRadioIds.active, label: "Only Active", value: "active", default: true},
        {id: UserDisplayRadioIds.inactive, label: "Only Inactive", value: "inactive"}
        ]} 
        setter={setRadioValue} name="clientsDisplay"/>
      </div>
      
      <div className="col-span-4 py-3 flex">
        <UsersTable companyList={companyList} radioStatus={radioValue} SubmitUpdateUser={SubmitUpdateUser} handleEditUser={handleEditUser} handleCloseEditUser={handleCloseEditUser}/>
        <UpdateUserListModal EditUserIsOpen={EditUserIsOpen} handleCloseEditUser={handleCloseEditUser} company={selectedCompany} SubmitUser={SubmitUpdateUser} isEdit={isEdit} />
      </div>
    </div>
  )
}