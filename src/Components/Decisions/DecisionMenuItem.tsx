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
  CloseMenu: () => void
}

export function DecisionMenuItem(props: ViewDecisionDataProps){
  const [selectedCompany, setSelectedCompany] = useState<Company>(props.company);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
  const [isOpen, setIsOpen] = useState(false);

  function handleViewDecisionData(company: Company, initiative: Initiative)
  {
    setIsOpen(true);
    setSelectedInitiative(initiative);
    setSelectedCompany(company);
  }

  function HandleClose()
  {
    setIsOpen(false);
    props.CloseMenu();
  }

  return (
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="Decisions" handleClick={() => handleViewDecisionData(props.company,props.initiative)}/>
      <DecisionDataModal {...props} title='View Decision Data' isOpen={isOpen} HandleClose={HandleClose}/>
    </>
  );
}


