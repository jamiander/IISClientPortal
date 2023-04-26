import { useState } from "react"
import { Company, Initiative, updateDecisionData } from "../../Store/CompanySlice"
import { genericButtonStyle } from "../../Styles";
import DecisionDataModal from "./DecisionDataModal";
import { ValidateDecisions, ValidationFailedPrefix } from "../../Services/Validation";
import { useAppDispatch } from "../../Store/Hooks";
import { DecisionData } from "../../Services/CompanyService";
import { useOutletContext } from "react-router-dom";

interface ViewDecisionDataProps {
    company: Company
    initiative: Initiative 
    index: number
}

export function ViewDecisionDataButton(props: ViewDecisionDataProps){
  const dispatch = useAppDispatch();
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();
  const [selectedCompany, setSelectedCompany] = useState<Company>(props.company);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
  const [ViewDecisionDataIsOpen, setViewDecisionDataIsOpen] = useState(false);

  function SubmitDecisionData(decisions: DecisionData[])
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    
    let validation = ValidateDecisions(decisions);
    if(validation.success)
    {
      dispatch(updateDecisionData({isTest: isTest, companyId: props.company.id.toString(), initiativeId: props.initiative.id, decisions: decisions}));
      setViewDecisionDataIsOpen(false);
    }
    else
      ShowToast(ValidationFailedPrefix + validation.message,"Error");
  }

  function handleViewDecisionData(company: Company, initiative: Initiative)
  {
    setViewDecisionDataIsOpen(true);
    setSelectedInitiative(initiative);
    setSelectedCompany(company);
  }

  return (
    <div key={props.index} className={'py-1 flex self-end'}>
      <button id={"viewDecisionDataButton"+props.initiative.id} className={genericButtonStyle + " h-8 w-full mx-2"}
          onClick={() => handleViewDecisionData(props.company, props.initiative)}
      >
          View
      </button>
      <DecisionDataModal title='View Decision Data' isOpen={ViewDecisionDataIsOpen} setDecisionModalIsOpen={setViewDecisionDataIsOpen} initiative={selectedInitiative} company={selectedCompany} Submit={SubmitDecisionData}/>
    </div>
  );
}


