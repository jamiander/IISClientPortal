import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Sorter from "../../Services/Sorter";
import { ValidateEditUser, ValidateNewUser, ValidationFailedPrefix } from "../../Services/Validation";
import { Company, selectAllCompanies, updateCompanyInfo } from "../../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { selectAllUsers, User } from "../../Store/UserSlice";
import UpdateUserListModal from "./UpdateUserListModal";
import UsersTable from "./UsersTable";
import { RadioSet } from "../RadioSet";

export const UserRadioIds = {
  all: "userDisplayShowAll",
  active: "userDisplayShowActive",
  inactive: "userDisplayShowInactive"
}

export default function ManageUsersDisplay() {
  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);

  const [radioValue, setRadioValue] = useState('active')

  const userList = useAppSelector(selectAllUsers);
  const companyList = useAppSelector(selectAllCompanies);

  const fakeUser : User = {id: -1, email: '', password: '', companyId: -1};
  const fakeCompany : Company = {id: -1, name: "", initiatives: []}

  const [selectedUser, setSelectedUser] = useState(fakeUser);
  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);

  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();

  function SubmitUpdateUser(companyName: string, email: string, password: string)
  {
    const company: Company = {...selectedCompany, name: companyName};
    const user: User = {...selectedUser, email: email, password: password};

    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let validation;

    const userToValidate : User = {...user, "companyId": company.id};
    if (isEdit) validation = ValidateEditUser(company.name, userToValidate, userList, companyList);
    else validation = ValidateNewUser(company.name, user.email, user.password, companyList, userList);

    if(validation.success) {
      dispatch(updateCompanyInfo({ company: company, employee: user, isTest: isTest}));
      handleCloseEditUser();
    }
    else
      ShowToast(ValidationFailedPrefix + validation.message, 'Error');
  }
  
  function handleEditUser(user: User, company?: Company) 
    {
      if(company)
      {
        setIsEdit(true);
        setEditUserIsOpen(true);
        setSelectedCompany(company);
        setSelectedUser(user);
      }
      else
        console.log("Couldn't find company for user " + user.id + "in handleEditClient (adminpage)")
    }
  
  function handleCloseEditUser() {
    setEditUserIsOpen(false);
    setSelectedCompany(fakeCompany);
    setSelectedUser(fakeUser);
  }

  return (
    <div className="col-span-4">
      <div className="bg-[#445362] rounded-md py-3 px-5">

        <div className="w-full flex justify-between">
          <p className="text-3xl text-white">Clients</p>
          <button className="outline outline-white bg-[#21345b] text-white w-28 rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]" onClick={() => {setEditUserIsOpen(true); setIsEdit(false);}} >  
            Add Client
          </button>
        </div>
  
        <RadioSet options={[
        {id: UserRadioIds.all, label: "Show All", value: "all"},
        {id: UserRadioIds.active, label: "Only Active", value: "active", default: true},
        {id: UserRadioIds.inactive, label: "Only Inactive", value: "inactive"}
        ]} 
        setter={setRadioValue} name="clientsDisplay"/>

      </div>
         
      <UsersTable userList={Sorter({users:userList})} companyList={companyList} radioStatus={radioValue} SubmitUpdateUser={SubmitUpdateUser} handleEditUser={handleEditUser} handleCloseEditUser={handleCloseEditUser}/>
      <UpdateUserListModal EditUserIsOpen={EditUserIsOpen} handleCloseEditUser={handleCloseEditUser} user={selectedUser} company={selectedCompany} SubmitUser={SubmitUpdateUser} isEdit={isEdit} />
    </div>
  )
}