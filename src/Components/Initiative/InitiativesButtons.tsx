import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Company, Initiative, selectAllCompanies, updateInitiativeInfo } from "../../Store/CompanySlice"
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import InitiativeModal from "./InitiativeModal";
import InitiativesFilter from "../../Services/InitiativesFilter";
import { EditInitiativeButton } from "../EditInitiativeButton";

interface InitiativesButtonsProps{
    companyList: Company[],
    radioStatus: string,
    ValidateInitiative: (initiative: Initiative, companyId: number) => {success: boolean, message: string}
}

export default function InitiativesButtons(props:InitiativesButtonsProps){
  const fakeCompany : Company = {id: -1, name: "N/A", initiatives: []}
  const fakeInitiative : Initiative = {id: -1, title: "N/A", totalItems: 0, targetDate: {month: "0", day: "0", year: "0000"}, itemsCompletedOnDate: []}

  const companyList = useAppSelector(selectAllCompanies);

  const [selectedCompany, setSelectedCompany] = useState(fakeCompany);
  const [selectedInitiative, setSelectedInitiative] = useState(fakeInitiative);
  const [AddInitiativeIsOpen, setAddInitiativeIsOpen] = useState(false);
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
      setAddInitiativeIsOpen(false); setEditInitiativeIsOpen(false);
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

  return(
    <div className="w-[10%]">
			<div className="h-[25px]" />
				<InitiativeModal title='Edit Initiative' initiativeIsOpen={EditInitiativeIsOpen} setInitiativeIsOpen={setEditInitiativeIsOpen} initiative={selectedInitiative} company={selectedCompany} Submit={SubmitUpdateInitiative} />
				{props.companyList.map((company, index) => {
					return (
            (props.radioStatus !== 'all' ? InitiativesFilter(company.initiatives, props.radioStatus) : company.initiatives).map((initiative, index) => {
							return (
								<EditInitiativeButton handleEditInitiative={handleEditInitiative} company={company} initiative={initiative} index={index}/>
							);
						})
					)
				})}
			</div>
		)
}