import { useState } from "react";
import { MakeClone } from "./Cloning";
import { InitCompanyDisplay, SortConfig } from "../Components/Initiative/InitiativesTable";
  
type SortItems = {
    SetupSortItems: (sortItems: InitCompanyDisplay[]) => void
    SortItems: (sortConfig: SortConfig, sortedDisplayItems: InitCompanyDisplay[]) => void
    sortedDisplayItems: InitCompanyDisplay[]
    sortConfig: SortConfig
}

export function useSorter() : SortItems
  {
    const [sortedDisplayItems, setSortedDisplayItems] = useState<InitCompanyDisplay[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: '', direction: 'desc'});

    function SetupSortItems(sortItems: InitCompanyDisplay[])
    {
        setSortConfig(sortConfig);
        SortItems(sortConfig, sortItems)
    }

    function SortItems(sortConfig: SortConfig, sortedDisplayItems: InitCompanyDisplay[])
    {
        let sortedItemsClone = MakeClone(sortedDisplayItems);
    
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
        setSortedDisplayItems(sortedItemsClone);
    }

    return {
        SetupSortItems,
        SortItems,
        sortedDisplayItems,
        sortConfig
    }
}

