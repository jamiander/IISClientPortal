import { Initiative } from "../Store/CompanySlice";

export default function InitiativeFilter(initiativesList: Initiative[], isActive: String) {
  let filteredInitiatives:Initiative[] = [];
  
  filteredInitiatives = initiativesList.filter((initiative) => {
    let initiativeDate:Date = new Date((initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year));
    const currentDate:Date = new Date();
    if (isActive === 'active')
      return (initiativeDate.toISOString() >= currentDate.toISOString())
    else
      return (initiativeDate.toISOString() < currentDate.toISOString())  
  })

  return filteredInitiatives;
}