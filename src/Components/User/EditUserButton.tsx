import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Company, selectAllCompanies, updateCompanyInfo } from "../../Store/CompanySlice"
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { selectAllUsers, User } from "../../Store/UserSlice"
import UpdateUserListModal from "./UpdateUserListModal";

interface EditUserButtonProps{
    index:number,
    user:User,
    company?:Company
}
export default function EditUserButton(props:EditUserButtonProps){
    const fakeUser : User = {id: -1, email: '', password: '', companyId: -1};
    const fakeCompany : Company = {id: -1, name: "", initiatives: []}
  
    const dispatch = useAppDispatch();
    const [isEdit, setIsEdit] = useState(false);
    const [EditUserIsOpen, setEditUserIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(fakeUser);
    const [selectedCompany, setSelectedCompany] = useState(fakeCompany);
  
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
    return(
        <div key={props.index} className={'py-2 my-2 flex self-end'}>
            <button className=" mx-2 bg-[#21345b] hover:outline-[#2ed7c3] hover:text-[#2ed7c3] text-sm text-white w-full h-10 rounded-md outline"
            onClick={() => handleEditUser(props.user, props.company)}
            >  
                Edit Client
            </button>
            <div className="h-6">
                <UpdateUserListModal EditUserIsOpen={EditUserIsOpen} handleCloseEditUser={handleCloseEditUser} user={selectedUser} company={selectedCompany} SubmitUser={SubmitUpdateUser} isEdit={isEdit} />
            </div>
        </div>
    )
}