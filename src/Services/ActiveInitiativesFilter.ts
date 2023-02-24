import { Initiative } from "../Store/CompanySlice";

export default function ActiveInitiativesFilter(initiativesList:Initiative[]){
    var filteredInitiatives:Initiative[] = [];
    initiativesList.forEach(initiative => {
    var initiativeDate:Date = new Date((initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year));
    const currentDate:Date = new Date();

    if(initiativeDate.toISOString() >= currentDate.toISOString()){
        filteredInitiatives.push(initiative)
    }
    });
    return filteredInitiatives
}