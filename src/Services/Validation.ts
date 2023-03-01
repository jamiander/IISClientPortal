import { Company, Initiative } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice";
import { DateInfo, ThroughputData } from "./CompanyService";

export default function ValidateNewInitiative(initiative: Initiative, companyId: number, allCompanies: Company[]) : {success: boolean, message: string}
{
  if (!initiative.title || !initiative.targetDate.month || !initiative.targetDate.day || !initiative.targetDate.year || !initiative.totalItems)
    return {success: false, message: "Cannot leave any fields blank."};

  let dateValidation = ValidateDate(initiative.targetDate);
  if(!dateValidation.success)
    return dateValidation;

  if(initiative.totalItems < 0)
    return {success: false, message: "Total items must be a positive value."};

  const matchingCompany = allCompanies.find(company => company.id === companyId);
  if(!matchingCompany)
    return {success: false, message: "A company must be selected."};

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

export function ValidateNewUser(newCompanyName: string, newEmail: string, newPassword: string, companyList: Company[], userList: User[]) : {success: boolean, message: string}
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

export function ValidateEditUser(companyName: string, user: User, userList: User[], companyList: Company[]) : {message: string, success: boolean}
{
  if(companyName && user.email && user.password && user.id !== -1 && user.companyId !== -1)
  {
    let matchingUser = userList.find(indexedUser => indexedUser.email.toUpperCase() === user.email.toUpperCase() && indexedUser.id !== user.id);
    if(matchingUser)
      return {success: false, message: "Cannot use the email of an existing user."};

    let matchingCompany = companyList.find(indexedCompany => indexedCompany.name.toUpperCase() === companyName.toUpperCase() && indexedCompany.id !== user.companyId)
    if(matchingCompany)
      return {success: false, message: "Cannot use the name of an existing company."};

    return {success: true, message: "Successfully validated; all good!"};
  }
  return {success: false, message: "Cannot leave any fields blank."};
}

export function ValidateThroughputData(data: ThroughputData) : {message: string, success: boolean} 
{


  return {success: false, message: "error"}
}