import { Company, Initiative, selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks";
import { User } from "../Store/UserSlice";
import InitiativesFilter from "./InitiativesFilter";

export default function ActiveCompaniesFilter(userlist:User[]){
    var initiatives: Initiative[] = [];
    var activeCompanies:Company[] = [];
    var activeUsers:User[] = [];
    const companyList = useAppSelector(selectAllCompanies);
    const fakeCompany : Company = {id: -1, name: "", initiatives: []}

    userlist.forEach(user=>{
        const company = companyList.find(e=>e.id === user.companyId) ?? fakeCompany;
        initiatives = InitiativesFilter(company?.initiatives, 'active');
        if(initiatives.length !==0){
            activeCompanies.push(company)
        }
    })
    activeCompanies.forEach(company=>{
        const user = userlist.find(e=>e.companyId === company.id);
        if(user !== undefined){
            activeUsers.push(user);
        }
    })
    return activeUsers
}