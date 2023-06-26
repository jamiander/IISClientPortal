import { useState } from "react";
import { MakeClone } from "./Cloning";
import { InitCompanyDisplay, SortConfig } from "../Components/Initiative/InitiativesTable";
  
type SortItems = {
  UpdateSortConfig: (key: string) => void
  SortItems: (sortedDisplayItems: InitCompanyDisplay[]) => InitCompanyDisplay[]
  sortConfig: SortConfig
}

export function useSorter() : SortItems
{
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: '', direction: 'desc'});

  function UpdateSortConfig(key: string)
  {
    let direction: 'desc' | 'asc' = 'desc';
    if(sortConfig.key === key && sortConfig.direction === 'desc')
      direction = 'asc';
    
    setSortConfig({key: key, direction: direction});
  }

  function SortItems(itemsToSort: InitCompanyDisplay[])
  {
    const sortedItemsClone = MakeClone(itemsToSort);

    sortedItemsClone.sort((a: any, b: any) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if(aValue === undefined)
        aValue = -0.001;
      if(bValue === undefined)
        bValue = -0.001; 

      if(typeof(aValue) === 'string') aValue.toUpperCase();
      if(typeof(bValue) === 'string') bValue.toUpperCase();
      if(typeof(sortConfig.key) === Date())
        aValue.localeCompare(bValue);

      if (aValue > bValue) 
        return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue < bValue) 
        return sortConfig.direction === 'asc' ? 1 : -1;
      
      return 0; 
    })
    return sortedItemsClone;
  }

  return {
    UpdateSortConfig,
    SortItems,
    sortConfig
  }
}

