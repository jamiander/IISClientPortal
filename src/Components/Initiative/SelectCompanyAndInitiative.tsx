import React from "react";
import { FindItemsRemaining } from "../../Services/CompanyService";
import { Company } from "../../Store/CompanySlice";
import { selectStyle } from "../../Styles";

interface SelectProps{
    companyList: Company[];
    selectedCompany: Company | undefined;
    selectedInitiativeIndex: number;
    setSelectedCompany:  (value: React.SetStateAction<Company | undefined>) => void;
    setSelectedInitiativeIndex: (value: React.SetStateAction<number>) => void;
    companyElementId: string,
    initiativeElementId: string
}

export default function SelectCompanyAndInitiative(props:SelectProps){
    
  function SelectCompany(companyId: string)
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
          <select id={props.companyElementId} onChange={(e) => SelectCompany((e.target as HTMLSelectElement).value)} className={selectStyle + " w-56 h-10"}>
            <option>Select Company</option>
              {props.companyList.map((company,index)=>{
                return(
                  <option value={company.id} key={index}>{company.name}</option>
                )
              })}
          </select>
          <select id={props.initiativeElementId} value={props.selectedInitiativeIndex} onChange={(e) => SelectInitiative(parseInt((e.target as HTMLSelectElement).value))} className={selectStyle + " w-56 h-10"}>
            <option>Select Initiative</option>
              {props.selectedCompany?.initiatives.map((initiative,index)=>{
                return(
                  <option value={index} key={index}>{initiative.title}</option>
                )
              })}
          </select>
          {props.selectedInitiativeIndex > -1 && <p className="p-2">Items Remaining: {FindItemsRemaining(props.selectedCompany?.initiatives.at(props.selectedInitiativeIndex) ?? undefined)}</p>}
        </div>
        </div>
        )
}