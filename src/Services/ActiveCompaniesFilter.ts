import { Company, Initiative } from "../Store/CompanySlice";
import ActiveInitiativesFilter from "./ActiveInitiativesFilter";

export default function ActiveCompaniesFilter(companyList:Company[]){
    var initiatives: Initiative[] = [];
    var activeCompanies:Company[] = [];
    /*
    1.take in list of companies
    2.filter company initiatives
    3. if any are active, add company to active list
    4. return active list
    */
    companyList.forEach(company =>{
        initiatives = ActiveInitiativesFilter(company.initiatives);
        if(initiatives.length !== 0){
            activeCompanies.push(company)
        }
    })
    return activeCompanies
}