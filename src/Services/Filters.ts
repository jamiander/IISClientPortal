import { Company, Initiative, selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks";
import { User } from "../Store/UserSlice";
import { FindItemsRemaining } from "./CompanyService";

export function CompanyFilter(userlist:User[], isActive:string){
    var initiatives: Initiative[] = [];
    var activeCompanies: Company[] = [];
    var activeUsers: User[] = [];
    const companyList = useAppSelector(selectAllCompanies);
    const fakeCompany : Company = {id: -1, name: "", initiatives: []}
    
    userlist.forEach(user=>{
        const company = companyList.find(e=>e.id === user.companyId) ?? fakeCompany;
        initiatives = InitiativeFilter(company.initiatives, isActive);
        
        if(isActive === 'all'){
            activeCompanies.push(company)
        }
        if(isActive === 'inactive'){
            if(initiatives.length === company.initiatives.length){
                activeCompanies.push(company)
            }
        }
        if(isActive === 'active'){
            if(initiatives.length !== 0){
                activeCompanies.push(company)
            }
        }
        
    })
    activeCompanies.forEach(company=>{
        const user = userlist.find(e=>e.companyId === company.id);
        if(user !== undefined){
            console.log("Users")
            console.log(user)
            activeUsers.push(user);
        }
    })
    return activeUsers
}

export function InitiativeFilter(initiativesList: Initiative[], isActive: String) {
  let filteredInitiatives:Initiative[] = [];
  
  filteredInitiatives = initiativesList.filter((initiative) => {
    const itemsRemaining = FindItemsRemaining(initiative);

    if (isActive === 'active')
      return (itemsRemaining > 0)
    else 
      return (itemsRemaining <= 0)
  })

  return filteredInitiatives;
}