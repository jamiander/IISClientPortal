import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Company, Initiative, selectAllCompanies, updateInitiativeInfo } from "../../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import InitiativeModal from "./InitiativeModal";
import InitiativesTable from "./InitiativesTable"
import ValidateNewInitiative from "../../Services/ValidateNewInitiative";

export const InitiativeRadioIds = {
  all: "initDisplayShowAll",
  active: "initDisplayShowActive",
  inactive: "initDisplayShowInactive"
}

export default function ManageInitiativesDisplay() {

  const companyList : Company[] = useAppSelector(selectAllCompanies);

  const [AddInitiativeIsOpen, setAddInitiativeIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();
  const [radioValue, setRadioValue] = useState('active')

  function SubmitUpdateInitiative(initiative: Initiative, companyId: number)
  {
    console.log('initiative @ submitUpdateInitiative', initiative);

    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let validation = ValidateNewInitiative(initiative, companyId);
    if(validation.success)
    {
      ShowToast('New Initiative Dispatched', 'Success');
      dispatch(updateInitiativeInfo({initiative: initiative, companyId: companyId, isTest: isTest}))
      setAddInitiativeIsOpen(false);
    }
    else
      ShowToast('Validation Failed: ' + validation.message,'Error');
  }


  return (
  <div className="col-span-4">
    <div className="bg-[#2ed7c3] rounded-md py-3 px-5">

      <div className="w-full flex justify-between">
        <p className="text-3xl">Initiatives</p>
        <button onClick={() => setAddInitiativeIsOpen(true)} className="outline bg-[#21345b] text-white w-32 rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]">
          Add Initiative
        </button>
        <InitiativeModal title='Add Initiative' initiativeIsOpen={AddInitiativeIsOpen} setInitiativeIsOpen={setAddInitiativeIsOpen} Submit={SubmitUpdateInitiative}/>
      </div>

      <div className="w-fit justify-center mt-2 py-1 px-5 outline outline-1 outline-[#879794] rounded">
        <input type='radio' id={InitiativeRadioIds.all} value='all' name='initiativesDisplay' className="mr-1 rounded" onClick={()=>setRadioValue('all')}/>
        <label htmlFor='showAll' className="mr-5">Show All</label>

        <input type='radio' id={InitiativeRadioIds.active} value='active' name='initiativesDisplay' defaultChecked className="mr-1" onClick={()=>setRadioValue('active')}/>
        <label htmlFor='showActive' className="mr-5">Only Active</label>

        <input type='radio' id={InitiativeRadioIds.inactive} value='inactive' name='initiativesDisplay' className="mr-1" onClick={()=>setRadioValue('inactive')}/>
        <label htmlFor='showInactive' className="">Only Inactive</label>
      </div>

    </div>
    
    <div className="col-span-4 py-[10px] flex">
      <InitiativesTable companyList={companyList} radioStatus={radioValue} ValidateInitiative={ValidateNewInitiative}/>
      {/*<InitiativesButtons companyList={companyList} radioStatus={radioValue} ValidateInitiative={ValidateNewInitiative}/>*/}
    </div>
  </div>
  )
}