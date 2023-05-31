import React from "react";
import { FindItemsRemaining } from "../../Services/CompanyService";
import { Company } from "../../Store/CompanySlice";
import { selectStyle } from "../../Styles";

interface SelectProps{
  companyList: Company[];
  selectedCompanyId: string;
  selectedInitiativeIndex: number;
  setSelectedCompanyId: (value: React.SetStateAction<string>) => void;
  setSelectedInitiativeIndex: (value: React.SetStateAction<number>) => void;
  companyElementId: string,
  initiativeElementId: string
}

export default function SelectCompanyAndInitiative(props:SelectProps){
    
  function SelectCompany(companyId: string)
  {
    props.setSelectedCompanyId(companyId);
    props.setSelectedInitiativeIndex(-1);
  }

  function SelectInitiative(initiativeIndex: number)
  {
    const selectedCompany = props.companyList.find(c => c.id === props.selectedCompanyId);
    if(selectedCompany)
    {
      if(selectedCompany.initiatives[initiativeIndex])
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
          <select data-cy={props.companyElementId} onChange={(e) => SelectCompany((e.target as HTMLSelectElement).value)} className={selectStyle + " w-56 h-10"}>
            <option>Select Company</option>
              {props.companyList.map((company,index)=>{
                return(
                  <option value={company.id} key={index}>{company.name}</option>
                )
              })}
          </select>
          <select data-cy={props.initiativeElementId} value={props.selectedInitiativeIndex} onChange={(e) => SelectInitiative(parseInt((e.target as HTMLSelectElement).value))} className={selectStyle + " w-56 h-10"}>
            <option>Select Initiative</option>
              {props.companyList.find(c => c.id === props.selectedCompanyId)?.initiatives.map((initiative,index)=>{
                return(
                  <option value={index} key={index}>{initiative.title}</option>
                )
              })}
          </select>
          {props.selectedInitiativeIndex > -1 && <p className="p-2">Items Remaining: {FindItemsRemaining(props.companyList.find(c => c.id === props.selectedCompanyId)?.initiatives.at(props.selectedInitiativeIndex) ?? undefined)}</p>}
        </div>
        </div>
        )
}