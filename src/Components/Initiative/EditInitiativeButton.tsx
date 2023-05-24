import { useState } from "react";
import { ValidationFailedPrefix } from "../../Services/Validation";
import { Company, Initiative, selectAllCompanies, upsertInitiativeInfo } from "../../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { UpdateInitiativeListModal } from "./UpdateInitiativeListModal";
import { genericButtonStyle } from "../../Styles";
import { enqueueSnackbar } from "notistack";

interface EditInitiativeButtonProps {
    company: Company
    initiative: Initiative
    index: number
    ValidateInitiative : (initiative: Initiative, companyId: string, allCompanies: Company[]) => {success: boolean, message: string}
}

export function EditInitiativeButton(props: EditInitiativeButtonProps){
  
  const [selectedCompany, setSelectedCompany] = useState<Company>(props.company);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
  const [EditInitiativeIsOpen, setEditInitiativeIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const companyList = useAppSelector(selectAllCompanies);

  function SubmitUpdateInitiative(initiative: Initiative, companyId: string)
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let validation = props.ValidateInitiative(initiative, companyId, companyList);
    if(validation.success)
    {
      dispatch(upsertInitiativeInfo({initiative: initiative, companyId: companyId.toString(), isTest: isTest}))
      setEditInitiativeIsOpen(false);
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message,{variant:'error'});
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
        <UpdateInitiativeListModal initiativeIsOpen={EditInitiativeIsOpen} setInitiativeIsOpen={setEditInitiativeIsOpen} initiative={selectedInitiative} company={selectedCompany} Submit={SubmitUpdateInitiative} />
      </div>
    );
}