import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Company, Initiative, updateInitiativeInfo } from "../../Store/CompanySlice";
import { useAppDispatch } from "../../Store/Hooks";
import InitiativeModal from "./InitiativeModal";

interface EditInitiativeButtonProps {

    //handleEditInitiative: (company: Company, initiative: Initiative) => void
    company: Company
    initiative: Initiative
    index: number
    ValidateInitiative : (initiative: Initiative, companyId: number) => {success: boolean, message: string}
}

export function EditInitiativeButton(props: EditInitiativeButtonProps){
  const fakeCompany : Company = {id: -1, name: "N/A", initiatives: []}
  const fakeInitiative : Initiative = {id: -1, title: "N/A", totalItems: 0, targetDate: {month: "0", day: "0", year: "0000"}, itemsCompletedOnDate: []}

  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);
  const [selectedInitiative, setSelectedInitiative] = useState(fakeInitiative);
  const [EditInitiativeIsOpen, setEditInitiativeIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();

  function SubmitUpdateInitiative(initiative: Initiative, companyId: number)
  {
    console.log('initiative @ submitUpdateInitiative', initiative);

    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let validation = props.ValidateInitiative(initiative, companyId);
    if(validation.success)
    {
      ShowToast('New Initiative Dispatched', 'Success');
      dispatch(updateInitiativeInfo({initiative: initiative, companyId: companyId, isTest: isTest}))
      setEditInitiativeIsOpen(false);
      setSelectedCompany(fakeCompany); setSelectedInitiative(fakeInitiative);
    }
    else
      ShowToast('Validation Failed: ' + validation.message,'Error');
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
        <button id={"editInitiativeButton"+props.initiative.id} className=" mx-2 bg-[#21345b] text-sm text-white w-full h-8 rounded-md outline hover:outline-[#2ed7c3] hover:text-[#2ed7c3]"
            onClick={() => handleEditInitiative(props.company, props.initiative)}
        >
            Edit Initiative
        </button>
        <InitiativeModal title='Edit Initiative' initiativeIsOpen={EditInitiativeIsOpen} setInitiativeIsOpen={setEditInitiativeIsOpen} initiative={selectedInitiative} company={selectedCompany} Submit={SubmitUpdateInitiative} />
      </div>
    );
}