import { Company, Initiative } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice";
import { FindItemsRemaining } from "./CompanyService";

export function CompanyFilter(companyList: Company[], activeStatus: string){
  let filteredInitiatives: Initiative[] = [];
  let filteredCompanies: Company[] = [];
  
  companyList.forEach(company => {
    if(company !== undefined)
    {
      filteredInitiatives = InitiativeFilter(company.initiatives, activeStatus);
      
      switch(activeStatus)
      {
        case 'all':
          filteredCompanies.push(company);
        break;
        case 'active':
          if(filteredInitiatives.length !== 0)
            filteredCompanies.push(company);
        break;
        case 'inactive':
          if(filteredInitiatives.length === company.initiatives.length)
            filteredCompanies.push(company);
        break;
      }
    }
  })
  return filteredCompanies;
}

export function InitiativeFilter(initiativesList: Initiative[], isActive: string) {
  let filteredInitiatives: Initiative[] = [];
  
  filteredInitiatives = initiativesList.filter((initiative) => {
    const itemsRemaining = FindItemsRemaining(initiative);

    if (isActive === 'active')
      return (itemsRemaining > 0)
    else if(isActive === 'inactive')
      return (itemsRemaining <= 0)
    else
      return true;
  })

  return filteredInitiatives;
}

export function UserFilter(usersList: User[], isActive: string) {
  let filteredUsers: User[] = [];
    usersList.forEach((user) => {
      if(isActive === 'all') {
        filteredUsers.push(user)
      }
      if(isActive === 'active') {
        if(user.isActive === true) filteredUsers.push(user);
      }
      if(isActive === 'inactive') {
        if(user.isActive !== true) filteredUsers.push(user);
      }
  })
  return filteredUsers;
}