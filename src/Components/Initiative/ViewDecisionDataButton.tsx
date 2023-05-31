import { useState } from "react"
import { Company, Initiative } from "../../Store/CompanySlice"
import { genericButtonStyle } from "../../Styles";
import DecisionDataModal from "./DecisionDataModal";
import { Button } from "@mui/material";

interface ViewDecisionDataProps {
  id: string
  company: Company
  initiative: Initiative
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
    <div className={'py-1 flex self-end'}>
      <Button disabled={props.disabled} id={props.id} className={genericButtonStyle + " h-8 w-full mx-2"}
        onClick={() => handleViewDecisionData(props.company, props.initiative)}
      >
        Decisions
      </Button>
      <DecisionDataModal title='View Decision Data' isOpen={ViewDecisionDataIsOpen} setDecisionModalIsOpen={setViewDecisionDataIsOpen} initiative={selectedInitiative} company={selectedCompany} isAdmin={false}/>
    </div>
  );
}


