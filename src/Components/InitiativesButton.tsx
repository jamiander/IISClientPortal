import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DateInfo } from "../Services/CompanyService";
import { Company, Initiative, selectAllCompanies, updateInitiativeInfo } from "../Store/CompanySlice"
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import EditInitiativeModal from "./EditInitiativeModal";
import ActiveInitiativesFilter from "../Services/ActiveInitiativesFilter";
import InactiveInitiativesFilter from "../Services/InactiveInitiativesFilter";
import InitiativeModal from "./InitiativeModal";

interface InitiativesButtonProps{
    companyList: Company[],
    radioStatus: string,
    ValidateInitiative: (initiative: Initiative, companyId: number) => {success: boolean, message: string}
}

export default function InitiativesButton(props:InitiativesButtonProps){
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

  if(props.radioStatus === 'active'){
    return(
        <>
        <div className="w-[10%]">
            <div className="h-[25px]" />
            {props.companyList.map((company, index) => {
                return (
                    ActiveInitiativesFilter(company.initiatives).map((initiative, index) => {
                        return (
                            <div key={index} className={'py-1 flex self-end'}>
                                <button className=" mx-2 bg-[#21345b] text-sm text-white w-full h-8 rounded-md outline"
                                    onClick={() => handleEditInitiative(company, initiative)}
                                >
                                    Edit Initiative
                                </button>
                            </div>
                        );
                    })
                );
            })}
        </div>
        <InitiativeModal title='Edit Initiative' initiativeIsOpen={EditInitiativeIsOpen} setInitiativeIsOpen={setEditInitiativeIsOpen} initiative={selectedInitiative} company={selectedCompany} Submit={SubmitUpdateInitiative} /></>
    )
  }
  else if(props.radioStatus === 'inactive'){
    return(
        <>
        <div className="w-[10%]">
            <div className="h-[25px]" />
            {props.companyList.map((company, index) => {
                return (
                    InactiveInitiativesFilter(company.initiatives).map((initiative, index) => {
                        //company.initiatives.map((initiative, index) => {
                        return (
                            <div key={index} className={'py-1 flex self-end'}>
                                <button className=" mx-2 bg-[#21345b] text-sm text-white w-full h-8 rounded-md outline"
                                    onClick={() => handleEditInitiative(company, initiative)}
                                >
                                    Edit Initiative
                                </button>
                            </div>
                        );
                    })
                );
            })}
        </div>
        <EditInitiativeModal editInitiativeIsOpen={EditInitiativeIsOpen} setEditInitiativeIsOpen={setEditInitiativeIsOpen} initiative={selectedInitiative} company={selectedCompany} submitUpdateInitiative={SubmitUpdateInitiative} /></>
    )
  }
   else{
    return(
        <>
        <div className="w-[10%]">
            <div className="h-[25px]" />
            {props.companyList.map((company, index) => {
                return (
                        company.initiatives.map((initiative, index) => {
                        return (
                            <div key={index} className={'py-1 flex self-end'}>
                                <button className=" mx-2 bg-[#21345b] text-sm text-white w-full h-8 rounded-md outline"
                                    onClick={() => handleEditInitiative(company, initiative)}
                                >
                                    Edit Initiative
                                </button>
                            </div>
                        );
                    })
                );
            })}
        </div>
        <EditInitiativeModal editInitiativeIsOpen={EditInitiativeIsOpen} setEditInitiativeIsOpen={setEditInitiativeIsOpen} initiative={selectedInitiative} company={selectedCompany} submitUpdateInitiative={SubmitUpdateInitiative} /></>
    )
   } 
}