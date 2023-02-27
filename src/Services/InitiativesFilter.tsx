import { Initiative } from "../Store/CompanySlice";
import { FindItemsRemaining } from "./CompanyService";

export default function InitiativeFilter(initiativesList: Initiative[], isActive: String) {
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