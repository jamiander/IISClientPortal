import { MakeDate } from "../Components/DateInput";
import { Company, Initiative } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice";
import { DateInfo, DecisionData, ThroughputData } from "./CompanyService";

export const ValidationFailedPrefix = 'Validation Failed: ';
type Validation = {message: string, success: boolean}

export default function ValidateNewInitiative(initiative: Initiative, companyId: string, allCompanies: Company[]) : Validation
{
  if (!initiative.title || !initiative.targetDate.month || !initiative.targetDate.day || !initiative.targetDate.year || !initiative.totalItems)
    return {success: false, message: "Cannot leave any fields blank."};

  let targetDateValidation = ValidateDate(initiative.targetDate);
  if(!targetDateValidation.success)
    return targetDateValidation;

  let startDateValidation = ValidateDate(initiative.startDate);
    if(!startDateValidation.success)
      return startDateValidation;

  if(MakeDate(initiative.startDate).getTime() > MakeDate(initiative.targetDate).getTime())
    return {success: false, message: "Initiative start date must be before target completion date."};

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

export function ValidateDate(date: DateInfo) : Validation
{
  if(date === null || date === undefined)
    return {success: false, message: "A date was not provided"};
  
  let month = date.month;
  if(!month || month < 1 || month > 12 || Number.isNaN(month))
    return {success: false, message: "Month must be between 1 and 12"};

  let day = date.day;
  if(!day || day < 1 || day > 31 || Number.isNaN(day))
    return {success: false, message: "Day must be between 1 and 31"};

  let year = date.year;    //TODO: there's probably a better way to validate years
  if(!year || year < 1900 || year > 2100 || Number.isNaN(year))
    return {success: false, message: "Year must be between 1900 and 2100"};

  return {success: true, message: "Date is all good!"}
}

export function ValidateNewUser(newCompanyName: string, companyList: Company[]) : Validation
{
  let matchingCompany = companyList.find(company => company.name.toUpperCase() === newCompanyName.toUpperCase());
  if(matchingCompany)
    return {success: false, message: "Cannot use the name of an existing company."};

  return {success: false, message: "Cannot leave any fields blank."};
}

export function ValidateEditUser(companyName: string, companyList: Company[]) : Validation
{
  if(companyName)
  {
    let matchingCompany = companyList.find(indexedCompany => indexedCompany.name.toUpperCase() === companyName.toUpperCase())
    if(matchingCompany)
      return {success: false, message: "Cannot use the name of an existing company."};

    return {success: true, message: "Successfully validated; all good!"};
  }
  return {success: false, message: "Cannot leave any fields blank."};
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
    if(!matchingCompany)
      return {success: false, message: "A company must be selected."};

    const matchingInitiative = matchingCompany.initiatives.find(init => init.id === initiativeId);
    if(!matchingInitiative)
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
    if (!decision.description || !decision.resolution) 
      return {success: false, message: "Decisions cannot have any empty fields."};
    if (decision.participants.length === 0 || decision.participants.every(p => p === ""))
      return {success: false, message: "Decisions must have at least one participant."}
  }
  return { success: true, message: "Successfully validated decisions; all good!" }
}
