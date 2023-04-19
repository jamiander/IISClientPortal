import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ValidationFailedPrefix } from "../../Services/Validation";
import { Company, Initiative, selectAllCompanies, updateInitiativeInfo } from "../../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { UpdateInitiativeListModal } from "./UpdateInitiativeListModal";
import { genericButtonStyle } from "../../Styles";

interface EditInitiativeButtonProps {
    company: Company
    initiative: Initiative
    index: number
    ValidateInitiative : (initiative: Initiative, companyId: number, allCompanies: Company[]) => {success: boolean, message: string}
}

export function EditInitiativeButton(props: EditInitiativeButtonProps){
  //const fakeCompany : Company = {id: -1, name: "N/A", initiatives: []}
  //const fakeInitiative : Initiative = {id: -1, title: "N/A", totalItems: 0, targetDate: {month: 0, day: 0, year: 0}, itemsCompletedOnDate: []}

  const [selectedCompany, setSelectedCompany] = useState<Company>(props.company);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
  const [EditInitiativeIsOpen, setEditInitiativeIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const companyList = useAppSelector(selectAllCompanies);
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();

  function SubmitUpdateInitiative(initiative: Initiative, companyId: number)
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let validation = props.ValidateInitiative(initiative, companyId, companyList);
    if(validation.success)
    {
      dispatch(updateInitiativeInfo({initiative: initiative, companyId: companyId.toString(), isTest: isTest}))
      setEditInitiativeIsOpen(false);
      //setSelectedCompany(fakeCompany);
      //setSelectedInitiative(fakeInitiative);
    }
    else
      ShowToast(ValidationFailedPrefix + validation.message,'Error');
  }
    
  function handleEditInitiative(company: Company, initiative: Initiative) {
    if (company) 
    {
      setEditInitiativeIsOpen(true);
      setSelectedInitiative(initiative);
      setSelectedCompany(company);
    } else
      console.log("Couldn't find company at handleEditInitiative (adminpage)")
  }
    return (
      <div key={props.index} className={'py-1 flex self-end'}>
        <button id={"editInitiativeButton"+props.initiative.id} className={genericButtonStyle + " h-8 w-full mx-2"}
            onClick={() => handleEditInitiative(props.company, props.initiative)}
        >
            Edit
        </button>
        <UpdateInitiativeListModal title='Edit Initiative' initiativeIsOpen={EditInitiativeIsOpen} setInitiativeIsOpen={setEditInitiativeIsOpen} initiative={selectedInitiative} company={selectedCompany} Submit={SubmitUpdateInitiative} />
      </div>
    );
}