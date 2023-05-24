import { filter } from "cypress/types/bluebird";
import { Company, Initiative } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice";
import { FindItemsRemaining } from "./CompanyService";

export function CompanyFilter(companyList: Company[], isActive: string){
    let filteredInitiatives: Initiative[] = [];
    let filteredCompanies: Company[] = [];
    
    companyList.forEach(company => {
      if(company !== undefined)
      {
        filteredInitiatives = InitiativeFilter(company.initiatives, isActive);
        
        if(isActive === 'all'){
            filteredCompanies.push(company);
        }
        else if(isActive === 'inactive'){
            if(filteredInitiatives.length === company.initiatives.length){
                filteredCompanies.push(company);
            }
        }
        else if(isActive === 'active'){
            if(filteredInitiatives.length !== 0){
                filteredCompanies.push(company);
            }
        }
      }
    })
    return filteredCompanies;
}

export function InitiativeFilter(initiativesList: Initiative[], isActive: String) {
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

export function UserFilter(usersList: User[], isActive: String) {
  let filteredUsers: User[] = [];
  console.log(usersList);
    filteredUsers = usersList.filter((user) => {
      if(isActive === 'all') {
        filteredUsers.push(user)
      }
      if(isActive === 'active') {
        if(user.isActive === true) filteredUsers.push(user);
      }
      if(isActive === 'inactive') {
        if(user.isActive === false) filteredUsers.push(user);
      }
  })
  console.log(filteredUsers);
  return filteredUsers;
}