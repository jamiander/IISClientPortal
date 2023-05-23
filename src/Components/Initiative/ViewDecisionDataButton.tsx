import { useState } from "react"
import { Company, Initiative } from "../../Store/CompanySlice"
import { genericButtonStyle } from "../../Styles";
import DecisionDataModal from "./DecisionDataModal";

interface ViewDecisionDataProps {
    company: Company
    initiative: Initiative 
    index: number
    disabled?: boolean
}

export function ViewDecisionDataButton(props: ViewDecisionDataProps){
  const [selectedCompany, setSelectedCompany] = useState<Company>(props.company);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
  const [ViewDecisionDataIsOpen, setViewDecisionDataIsOpen] = useState(false);

  function handleViewDecisionData(company: Company, initiative: Initiative)
  {
    setViewDecisionDataIsOpen(true);
    setSelectedInitiative(initiative);
    setSelectedCompany(company);
  }

  return (
    <div key={props.index} className={'py-1 flex self-end'}>
      <button disabled={props.disabled} id={"viewDecisionDataButton"+props.initiative.id} className={genericButtonStyle + " h-8 w-full mx-2"}
          onClick={() => handleViewDecisionData(props.company, props.initiative)}
      >
          View
      </button>
      <DecisionDataModal title='View Decision Data' isOpen={ViewDecisionDataIsOpen} setDecisionModalIsOpen={setViewDecisionDataIsOpen} initiative={selectedInitiative} company={selectedCompany}/>
    </div>
  );
}


