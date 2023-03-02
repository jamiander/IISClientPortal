import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Company, Initiative, selectAllCompanies, updateInitiativeInfo } from "../../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import InitiativesTable from "./InitiativesTable"
import ValidateNewInitiative, { ValidationFailedPrefix } from "../../Services/Validation";
import UploadThroughputModal from "./UploadThroughputModal";
import { UpdateInitiativeListModal } from "./UpdateInitiativeListModal";

export const InitiativeRadioIds = {
  all: "initDisplayShowAll",
  active: "initDisplayShowActive",
  inactive: "initDisplayShowInactive"
}

export default function ManageInitiativesDisplay() {

  const companyList : Company[] = useAppSelector(selectAllCompanies);

  const [AddInitiativeIsOpen, setAddInitiativeIsOpen] = useState(false);
  const [UploadModalIsOpen, setUploadModalIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();
  const [radioValue, setRadioValue] = useState('active')

  function SubmitUpdateInitiative(initiative: Initiative, companyId: number)
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let validation = ValidateNewInitiative(initiative, companyId, companyList);
    if(validation.success)
    {
      dispatch(updateInitiativeInfo({initiative: initiative, companyId: companyId.toString(), isTest: isTest}))
      setAddInitiativeIsOpen(false);
    }
    else
      ShowToast(ValidationFailedPrefix + validation.message,'Error');
  }


  return (
  <div className="col-span-4">
    <div className="bg-[#445362] rounded-md py-3 px-5">

      <div className="w-full flex justify-between">
        <p className="text-3xl text-white">Initiatives</p>
        <button onClick={() => setAddInitiativeIsOpen(true)} className="outline bg-[#21345b] text-white w-32 rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]">
          Add Initiative
        </button>
        <UpdateInitiativeListModal title='Add Initiative' initiativeIsOpen={AddInitiativeIsOpen} setInitiativeIsOpen={setAddInitiativeIsOpen} Submit={SubmitUpdateInitiative}/>
        <button onClick={()=> setUploadModalIsOpen(true)} className="outline bg-[#21345b] text-white w-32 rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]">
          Upload data
        </button>
        <UploadThroughputModal companyList={companyList} uploadIsOpen={UploadModalIsOpen} setUploadIsOpen={setUploadModalIsOpen}/>
      </div>

      <div className="w-fit justify-center mt-2 py-1 px-5 outline outline-1 outline-[#2ed7c3] rounded">
        <input type='radio' id={InitiativeRadioIds.all} value='all' name='initiativesDisplay' className="mr-1 rounded" onClick={()=>setRadioValue('all')}/>
        <label htmlFor='showAll' className="mr-5 text-white">Show All</label>

        <input type='radio' id={InitiativeRadioIds.active} value='active' name='initiativesDisplay' defaultChecked className="mr-1" onClick={()=>setRadioValue('active')}/>
        <label htmlFor='showActive' className="mr-5 text-white">Only Active</label>

        <input type='radio' id={InitiativeRadioIds.inactive} value='inactive' name='initiativesDisplay' className="mr-1" onClick={()=>setRadioValue('inactive')}/>
        <label htmlFor='showInactive' className="text-white">Only Inactive</label>
      </div>

    </div>
    
    <div className="col-span-4 py-[10px] flex">
      <InitiativesTable companyList={companyList} radioStatus={radioValue} ValidateInitiative={ValidateNewInitiative}/>
    </div>
  </div>
  )
}