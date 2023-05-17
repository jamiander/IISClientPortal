import { Company, Initiative } from "../Store/CompanySlice";
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