import { Company, Initiative, selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks";
import { User } from "../Store/UserSlice";
import ActiveInitiativesFilter from "./ActiveInitiativesFilter";

export default function ActiveCompaniesFilter(userlist:User[]){
    var initiatives: Initiative[] = [];
    var activeCompanies:Company[] = [];
    var activeUsers:User[] = [];
    const companyList = useAppSelector(selectAllCompanies);
    const fakeCompany : Company = {id: -1, name: "", initiatives: []}
    /*
    1.take in list of companies
    2.filter company initiatives
    3. if any are active, add company to active list
    4. return active list
    */
    userlist.forEach(user=>{
        const company = companyList.find(e=>e.id === user.companyId) ?? fakeCompany;
        initiatives = ActiveInitiativesFilter(company?.initiatives);
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
    //companyList.forEach(company =>{
    //    initiatives = ActiveInitiativesFilter(company.initiatives);
    //    if(initiatives.length !== 0){
    //        activeCompanies.push(company)
    //    }
    //})
    //return activeCompanies
}