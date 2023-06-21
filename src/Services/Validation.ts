import { Article } from "../Store/ArticleSlice";
import { Company, Initiative } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice";
import { DateInfo, DecisionData, ThroughputData } from "./CompanyService";
import { MakeDate } from "./DateHelpers";

export const ValidationFailedPrefix = 'Validation Failed: ';
export type Validation = {message: string, success: boolean}

export default function ValidateNewInitiative(initiative: Initiative, companyId: string, allCompanies: Company[]) : Validation
{
  if (!initiative.title)
    return {success: false, message: "Cannot leave title blank."};
  if(!initiative.totalItems && initiative.totalItems !== 0)
    return {success: false, message: "Cannot leave total items blank."};

  let targetDateValidation = ValidateDate(initiative.targetDate);
  if(!targetDateValidation.success)
    return targetDateValidation;

  let startDateValidation = ValidateDate(initiative.startDate);
    if(!startDateValidation.success)
      return startDateValidation;

  if(MakeDate(initiative.startDate).getTime() > MakeDate(initiative.targetDate).getTime())
    return {success: false, message: "Initiative start date must be before target completion date."};

  if(initiative.totalItems <= 0)
    return {success: false, message: "Total items must be a positive value."};

  const matchingCompany = allCompanies.find(company => company.id === companyId);
  if(!matchingCompany)
    return {success: false, message: "A company must be selected."};

  const matchingInitiative = matchingCompany.initiatives.find(init => init.title === initiative.title && init.id !== initiative.id);
  if(matchingInitiative)
    return {success: false, message: "Initiative names must be unique."}

  return {success: true, message: "Successfully validated; all good!"};
}

export function ValidateDate(date: DateInfo | undefined) : Validation
{
  const invalidDateMessage = "A valid date must be provided.";

  if(date === null || date === undefined)
    return {success: false, message: "A date was not provided."};
  
  let month = date.month;
  if(!month || month < 1 || month > 12 || Number.isNaN(month))
    return {success: false, message: invalidDateMessage};//"A date must have a month between 1 and 12."};

  let day = date.day;
  if(!day || day < 1 || day > 31 || Number.isNaN(day))
    return {success: false, message: invalidDateMessage};//"A date must have a day between 1 and 31."};

  let year = date.year;    //TODO: there's probably a better way to validate years
  if(!year || year < 1900 || year > 2100 || Number.isNaN(year))
    return {success: false, message: invalidDateMessage};//"A date must have a year between 1900 and 2100."};

  return {success: true, message: "Date is all good!"}
}

export function ValidateCompany(newCompany: Company, companyList: Company[]) : Validation
{
  if(newCompany && newCompany.name)
  {
    let matchingCompany = companyList.find(company => company.name.toUpperCase() === newCompany.name.toUpperCase() && newCompany.id !== company.id);
    if(matchingCompany)
      return {success: false, message: "Cannot use the name of an existing company."};

    return {success: true, message: "Successfully validated; all good!"};
  }
  return {success: false, message: "Cannot leave any fields blank."};
}

export function ValidateUser(newUser: User, allUsers: User[]) : Validation
{
  if(newUser)
  {
    if(!newUser.email)
      return {success: false, message: "Email cannot be left blank."};
    if(!newUser.password)
      return {success: false, message: "Password cannot be left blank."};
    if(!newUser.companyId)
      return {success: false, message: "Company cannot be left blank"};

    let matchingUser = allUsers.find(user => user.email.toUpperCase() === newUser.email.toUpperCase() && newUser.id !== user.id)
    if(matchingUser)
      return {success: false, message: "Cannot use the email of an existing user."};

    return {success: true, message: "Successfully validated; all good!"};
  }
  return {success: false, message: "There was no user to validate."};
}

export function ValidateAdminUser(newUser: User, allUsers: User[]) : Validation
{
  const validation = ValidateUser(newUser, allUsers);
  if(validation.success)
  {
    if(!newUser.isAdmin && allUsers.find(user => user.isAdmin && user.id !== newUser.id) === undefined)
      return {success: false, message: "Cannot remove admin status if there are no other admins."}

    return {success: true, message: "Successfully validated admin user."}
  }
  else
    return validation;
}

export function ValidateThroughputData(dataList: ThroughputData[]) : Validation
{
  for(const entry of dataList)
  {
    if (!ValidateDate(entry.date).success) 
      return {success: false, message: "All dates must be valid."}
    if ((!entry.itemsCompleted && entry.itemsCompleted !== 0) || entry.itemsCompleted < 0) 
      return {success: false, message: "All entries must have items completed as 0 or greater."}
  }
  
  return {success: true, message: "All data is valid."}
}

export function ValidateFileThroughputData(companyList: Company[], companyId: string, initiativeId: string, dataList: ThroughputData[]): Validation
{
  if(dataList.length === 0)
    return {success: false, message: "A set of data could not be derived from the selected file, or no file was selected."}

  return ValidateEditThroughputData(companyList, companyId, initiativeId, dataList);
}

export function ValidateEditThroughputData(companyList: Company[], companyId: string, initiativeId: string, dataList: ThroughputData[]): Validation
{
  const dataValidation = ValidateThroughputData(dataList);
  if(dataValidation.success)
  {
    const selectsValidation = ValidateCompanyAndInitiative(companyList, companyId, initiativeId);
    if(!selectsValidation.success)
      return selectsValidation;
  }
  else
    return dataValidation;

  return {success: true, message: "Successfully validated throughput data; all good!"}
}

export function ValidateCompanyAndInitiative(companyList: Company[], companyId: string, initiativeId: string) : Validation
{
    const matchingCompany = companyList.find(company => company.id === companyId);
    if(!matchingCompany || companyId === undefined)
      return {success: false, message: "A company must be selected."};

    const matchingInitiative = matchingCompany.initiatives.find(init => init.id === initiativeId);
    if(!matchingInitiative || initiativeId === undefined)
      return {success: false, message: "An initiative must be selected."};

  return {success: true, message: "Successfully validated throughput data; all good!"}
}

export function ValidateThroughputDataUpdate(companyList: Company[], companyId: string, initiativeId: string, dataList: ThroughputData[]): Validation
{
  if(dataList.length === 0)
    return {success: false, message: "A set of data could not be derived from the selected file, or no file was selected."}

  const dataValidation = ValidateThroughputData(dataList);
  if(dataValidation.success)
    {
      return ValidateCompanyAndInitiative(companyList, companyId, initiativeId);
    }
  else
    return dataValidation;
}

export function ValidateDecisions(decisions: DecisionData[]) : Validation
{
  let today = new Date();
  today.setHours(0,0,0,0);
  for(const decision of decisions)
  {
    if (!ValidateDate(decision.date).success) 
      return {success: false, message: "Decisions must have a valid date."};
    if (MakeDate(decision.date) > today)
      return {success: false, message: "Decisions cannot have dates set in the future."};
    if (!decision.description)
      return {success: false, message: "Decisions must have a description."};
    if (!decision.resolution) 
      return {success: false, message: "Decisions must have a resolution."};
    if (!decision.participants)
      return {success: false, message: "Decisions must have at least one participant."};
  }
  return { success: true, message: "Successfully validated decisions; all good!" };
}

export function ValidateArticle(newArticle: Article)
{
  if(newArticle)
  {
    if(!newArticle.title)
      return {success: false, message: "Title cannot be left blank."};
    if(!newArticle.text)
      return {success: false, message: "Text cannot be left blank."};
    if(!newArticle.updatedBy)
      return {success: false, message: "Updated by cannot be left blank."};
    
    const dateValidation = ValidateDate(newArticle.updatedDate);
    if(!dateValidation.success)
      return {success: false, message: dateValidation.message};

    return {success: true, message: "Successfully validated article, all good!"};
  }
  return {success: false, message: "There was no article to validate."};
}