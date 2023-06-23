import { useState } from "react"
import { Company, Initiative } from "../../Store/CompanySlice"
import DecisionDataModal from "./DecisionDataModal";
import { ActionsMenuItem } from "../ActionsMenuItem";
import { User } from "../../Store/UserSlice";

interface ViewDecisionDataProps {
  cypressData: string
  company: Company
  initiative: Initiative
  currentUser: User
}

export function DecisionMenuItem(props: ViewDecisionDataProps){
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
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="Decisions" handleClick={() => handleViewDecisionData(props.company,props.initiative)}/>
      <DecisionDataModal title='View Decision Data' isOpen={ViewDecisionDataIsOpen} setDecisionModalIsOpen={setViewDecisionDataIsOpen} initiative={selectedInitiative} company={selectedCompany} isAdmin={props.currentUser.isAdmin}/>
    </>
  );
}


