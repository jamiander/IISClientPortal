import { Initiative } from "../Store/CompanySlice";

export default function InitiativesFilter(initiativesList:Initiative[]){
    /*
    1. Take in list of initiatives
    2. Compare each initiatives date to current date time
    3. If date has not yet passed, add it to new list
    */
   var filteredInitiatives:Initiative[] = [];
   initiativesList.forEach(initiative => {
    var initiativeDate:Date = new Date((initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year));
    const currentDate:Date = new Date();

    if(initiativeDate.toISOString() > currentDate.toISOString()){
        filteredInitiatives.push(initiative)
    }
   });
   return filteredInitiatives
}