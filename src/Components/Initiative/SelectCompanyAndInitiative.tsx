import React, { useState } from "react";
import { FindItemsRemaining } from "../../Services/CompanyService";
import { Company } from "../../Store/CompanySlice";

export const SelectIds = {
    selectCompany: "selectCompanyInThroughputModal",
    selectInitiative: "selectInitiativeInThroughputModal"
}

interface SelectProps{
    companyList: Company[];
    selectedCompany: Company | undefined;
    setSelectedCompany:  (value: React.SetStateAction<Company | undefined>) => void;
    setSelectedInitiativeIndex: (value: React.SetStateAction<number>) => void; 
}

export default function SelectCompanyAndInitiative(props:SelectProps){
    const [selectedInitiativeIndex] = useState(-1);
    
function SelectCompany(companyId: number)
  {
    props.setSelectedCompany(props.companyList.find(company => company.id === companyId));
    props.setSelectedInitiativeIndex(-1);
  }

  function SelectInitiative(initiativeIndex: number)
  {
    console.log(props.selectedCompany);
    if(props.selectedCompany)
    {
      if(props.selectedCompany.initiatives[initiativeIndex])
      {
        props.setSelectedInitiativeIndex(initiativeIndex);
        console.log(initiativeIndex);
      }
      else
        props.setSelectedInitiativeIndex(-1);
    }
  }

  return (
  <div className="space-y-5">
        <div className="space-x-5 flex w-full">
          <select id={SelectIds.selectCompany} onChange={(e) => SelectCompany(parseInt((e.target as HTMLSelectElement).value))} className="outline outline-1 rounded w-56 h-10">
            <option>Select Company</option>
              {props.companyList.map((company,index)=>{
                return(
                  <option value={company.id} key={index}>{company.name}</option>
                )
              })}
          </select>
          <select id={SelectIds.selectInitiative} value={selectedInitiativeIndex} onChange={(e) => SelectInitiative(parseInt((e.target as HTMLSelectElement).value))} className="outline outline-1 rounded w-56 h-10">
            <option>Select Initiative</option>
              {props.selectedCompany?.initiatives.map((initiative,index)=>{
                return(
                  <option value={index} key={index}>{initiative.title}</option>
                )
              })}
          </select>
          {!selectedInitiativeIndex && <p className="p-2">Items Remaining: {FindItemsRemaining(props.selectedCompany?.initiatives.at(selectedInitiativeIndex) ?? undefined)}</p>}
        </div>
        </div>
        )
}