import React from "react";
import { FindItemsRemaining } from "../../Services/CompanyService";
import { Company } from "../../Store/CompanySlice";

export const SelectIds = {
    selectCompany: "selectCompanyInThroughputModal",
    selectInitiative: "selectInitiativeInThroughputModal"
}

interface SelectProps{
    companyList: Company[];
    selectedCompany: Company | undefined;
    selectedInitiativeIndex: number;
    setSelectedCompany:  (value: React.SetStateAction<Company | undefined>) => void;
    setSelectedInitiativeIndex: (value: React.SetStateAction<number>) => void; 
}

export default function SelectCompanyAndInitiative(props:SelectProps){
    
function SelectCompany(companyId: number)
  {
    props.setSelectedCompany(props.companyList.find(company => company.id === companyId));
    props.setSelectedInitiativeIndex(-1);
  }

  function SelectInitiative(initiativeIndex: number)
  {
    if(props.selectedCompany)
    {
      if(props.selectedCompany.initiatives[initiativeIndex])
      {
        props.setSelectedInitiativeIndex(initiativeIndex);
      }
      else
        props.setSelectedInitiativeIndex(-1);
    }
  }

  return (
  <div className="space-y-5">
        <div className="space-x-5 flex w-full">
          <select id={SelectIds.selectCompany} onChange={(e) => SelectCompany(parseInt((e.target as HTMLSelectElement).value))} className="outline outline-1 rounded w-56 h-10 hover:outline-2">
            <option>Select Company</option>
              {props.companyList.map((company,index)=>{
                return(
                  <option value={company.id} key={index}>{company.name}</option>
                )
              })}
          </select>
          <select id={SelectIds.selectInitiative} value={props.selectedInitiativeIndex} onChange={(e) => SelectInitiative(parseInt((e.target as HTMLSelectElement).value))} className="outline outline-1 rounded w-56 h-10">
            <option>Select Initiative</option>
              {props.selectedCompany?.initiatives.map((initiative,index)=>{
                return(
                  <option value={index} key={index}>{initiative.title}</option>
                )
              })}
          </select>
          {!props.selectedInitiativeIndex && <p className="p-2">Items Remaining: {FindItemsRemaining(props.selectedCompany?.initiatives.at(props.selectedInitiativeIndex) ?? undefined)}</p>}
        </div>
        </div>
        )
}