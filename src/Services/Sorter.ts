import { useState } from "react";
import { MakeClone } from "./Cloning";
import { InitCompanyDisplay, SortConfig } from "../Components/Initiative/InitiativesTable";
  
type SortItems = {
    SetupSortItems: (sortItems: InitCompanyDisplay[]) => void
    SortItems: (sortConfig: SortConfig) => void
    displayItems: InitCompanyDisplay[]
    sortConfig: SortConfig
}

export function useSorter() : SortItems
  {
    const [displayItems, setDisplayItems] = useState<InitCompanyDisplay[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: '', direction: 'desc'});

    function SetupSortItems(sortItems: InitCompanyDisplay[])
    {
        setDisplayItems(sortItems);
        setSortConfig(sortConfig);
    }

    function SortItems(sortConfig: SortConfig)
    {
        let sortedItemsClone = MakeClone(displayItems);
    
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
        setDisplayItems(sortedItemsClone);
    }

    return {
        SetupSortItems,
        SortItems,
        displayItems,
        sortConfig
    }
}

