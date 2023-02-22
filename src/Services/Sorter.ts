import { Company, selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks";
import { User } from "../Store/UserSlice";

interface SorterProps{
    users: User[]
}

export default function Sorter(props: SorterProps){
    const usersClone:User[] = [];
    const companies = useAppSelector(selectAllCompanies);
    
    props.users.map(val => usersClone.push(Object.assign({}, val)));

    var sortedUsers = usersClone.sort((n1,n2)=>{
        const companyN1 = companies.find(company => company.id === n1.companyId)?.name ?? "n/a";
        const companyN2 = companies.find(company => company.id === n2.companyId)?.name ?? "n/a";

        if(companyN1 > companyN2){
            return 1;
        }
        if(companyN1 < companyN2){
            return -1;
        }
        return 0
    })
    return sortedUsers
}