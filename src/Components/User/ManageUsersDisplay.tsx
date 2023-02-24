import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Sorter from "../../Services/Sorter";
import { Company, selectAllCompanies, updateCompanyInfo } from "../../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { selectAllUsers, User } from "../../Store/UserSlice";
import EditUserModal from "./EditUserModal";
import UsersTable from "./UsersTable";

export default function ManageUsersDisplay() {

  const fakeUser : User = {id: -1, email: '', password: '', companyId: -1};
  const fakeCompany : Company = {id: -1, name: "", initiatives: []}

  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [EditUserIsOpen, setEditUserIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(fakeUser);
  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);

  const [radioValue, setRadioValue] = useState('active')

  const userList = useAppSelector(selectAllUsers);
  const companyList = useAppSelector(selectAllCompanies);
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();

  function SubmitUpdateUser(companyName: string, email: string, password: string)
  {
    const company: Company = {...selectedCompany, name: companyName};
    const user: User = {...selectedUser, email: email, password: password};

    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let validation;

    if (isEdit) validation = ValidateEdit(company.name, company.id, user.email, user.password, user.id)
    else validation = ValidateNewUser(company.name, user.email, user.password);

    if(validation.success) {
      dispatch(updateCompanyInfo({ company: company, employee: user, isTest: isTest}));
      setSelectedCompany(fakeCompany); setSelectedUser(fakeUser);
      setEditUserIsOpen(false);
    }
    else
      ShowToast('Validation Failed: ' + validation.message, 'Error');
  }

  function ValidateNewUser(newCompanyName: string, newEmail: string, newPassword: string) : {success: boolean, message: string}
  {
    let matchingCompany = companyList.find(company => company.name.toUpperCase() === newCompanyName.toUpperCase());
    if(matchingCompany)
      return {success: false, message: "Cannot use the name of an existing company."};

    let matchingUser = userList.find(user => user.email.toUpperCase() === newEmail.toUpperCase());
    if(matchingUser)
      return {success: false, message: "Cannot use the email of an existing user."};

    if(newCompanyName && newEmail && newPassword)
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
      <div className="bg-[#2ed7c3] rounded-md py-3 px-5">

        <div className="w-full flex justify-between">
          <p className="text-3xl">Clients</p>
          <button className="outline bg-[#21345b] hover:bg-[#445362] text-white w-28 rounded-md" onClick={() => {setEditUserIsOpen(true); setIsEdit(false);}} >  
            Add Client
          </button>
        </div>
  
      <div className="w-fit justify-center mt-2 py-1 px-5 outline outline-1 outline-[#879794] rounded">
          <input type='radio' id='showAll' value='all' name='clientDisplay' className="mr-1" onClick={()=>setRadioValue('all')}/>
          <label htmlFor='showAll' className="mr-5">Show All</label>

          <input type='radio' id='showActive' value='active' name='clientDisplay' defaultChecked className="mr-1" onClick={()=>setRadioValue('active')}/>
          <label htmlFor='showActive' className="mr-5">Only Active</label>
          
          <input type='radio' id='showInactive' value='inactive' name='clientDisplay' className="mr-1" onClick={()=>setRadioValue('inactive')}/>
          <label htmlFor='showInactive' className="">Only Inactive</label>
        </div>

      </div>
         
      <div className="col-span-4 py-[10px] flex">
        <UsersTable userList={Sorter({users:userList})} companyList={companyList} radioStatus={radioValue}/>
        <div className="w-[10%]">

          <div className="h-6">
            <EditUserModal EditUserIsOpen={EditUserIsOpen} handleCloseEditUser={handleCloseEditUser} user={selectedUser} company={selectedCompany} SubmitUser={SubmitUpdateUser} isEdit={isEdit}/>
          </div>

          {
            Sorter({users:userList}).map((user, index) => {
              //const companyName = companyList.find(company => company.id === user.companyId)?.name ?? "n/a";
              const company = companyList.find(company => company.id === user.companyId);
              return (
                <div key={index} className={'py-[10px] my-[10px] flex self-end'}>
                  <button className=" mx-2 bg-[#21345b] hover:bg-[#445362] text-sm text-white w-full h-10 rounded-md outline"
                    onClick={() => handleEditUser(user, company)}
                  >  
                      Edit Client
                  </button>
                </div>
              )
            })
          }
        </div>

      </div>
    </div>
  )
}