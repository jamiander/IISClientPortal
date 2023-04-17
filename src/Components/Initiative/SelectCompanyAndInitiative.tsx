import React, { useEffect, useState } from "react";
import { DateInfo, FindItemsRemaining, ThroughputData } from "../../Services/CompanyService";
import { Company, Initiative } from "../../Store/CompanySlice";

export const SelectIds = {
    selectCompany: "selectCompanyInThroughputModal",
    selectInitiative: "selectInitiativeInThroughputModal"
}

interface SelectProps{
    companyList: Company[];
    setSelectedCompany:  (value: React.SetStateAction<Company | undefined>) => void;
    setSelectedInitiativeIndex: (value: React.SetStateAction<number>) => void; 
}

export default function SelectCompanyAndInitiative(props:SelectProps){
    const [selectedCompany] = useState<Company>();
    const [selectedInitiativeIndex] = useState(-1);
    const emptyDate: DateInfo = {month: 0, day: 0, year: 0};
    const fakeEntry: ThroughputData[] = [{date:emptyDate,itemsCompleted:0}];
    const fakeInit: Initiative = {id:-1, title:'', targetDate:emptyDate, totalItems:0, itemsCompletedOnDate:fakeEntry};

function SelectCompany(companyId: number)
  {
    console.log(companyId);
    props.setSelectedCompany(props.companyList.find(company => company.id === companyId));
    props.setSelectedInitiativeIndex(-1);
  }

  function SelectInitiative(initiativeIndex: number)
  {
    console.log(selectedCompany);
    if(selectedCompany)
    {
      if(selectedCompany.initiatives[initiativeIndex])
        props.setSelectedInitiativeIndex(initiativeIndex);
      else
        props.setSelectedInitiativeIndex(-1);
    }
    
  }

  return (
  <div className="space-y-5">
        <div className="space-x-5 flex w-full">
          <select id={SelectIds.selectCompany} onChange={(e) => SelectCompany(parseInt((e.target).value))} className="outline outline-1 rounded w-56 h-10">
            <option>Select Company</option>
              {props.companyList.map((company,index)=>{
                return(
                  <option value={company.id} key={index}>{company.name}</option>
                )
              })}
          </select>
          <select id={SelectIds.selectInitiative} value={selectedInitiativeIndex} onChange={(e) => SelectInitiative(parseInt((e.target).value))} className="outline outline-1 rounded w-56 h-10">
            <option>Select Initiative</option>
              {selectedCompany?.initiatives.map((initiative,index)=>{
                return(
                  <option value={index} key={index}>{initiative.title}</option>
                )
              })}
          </select>
          {!selectedInitiativeIndex && <p className="p-2">Items Remaining: {FindItemsRemaining(selectedCompany?.initiatives.at(selectedInitiativeIndex) ?? fakeInit)}</p>}
        </div>
        </div>
        )
}