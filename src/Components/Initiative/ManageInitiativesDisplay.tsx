import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Company, Initiative, selectAllCompanies, updateInitiativeInfo, updateThroughputData } from "../../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import InitiativesTable from "./InitiativesTable"
import ValidateNewInitiative, { ValidateCompanyAndInitiative, ValidateThroughputDataUpdate, ValidationFailedPrefix } from "../../Services/Validation";
import UploadThroughputModal from "./UploadThroughputModal";
import { UpdateInitiativeListModal } from "./UpdateInitiativeListModal";
import { ThroughputData } from "../../Services/CompanyService";
import EditThroughputModal from "./EditThroughputModal";

export const InitiativeRadioIds = {
  all: "initDisplayShowAll",
  active: "initDisplayShowActive",
  inactive: "initDisplayShowInactive"
}

export default function ManageInitiativesDisplay() {

  const companyList : Company[] = useAppSelector(selectAllCompanies);

  const [AddInitiativeIsOpen, setAddInitiativeIsOpen] = useState(false);
  const [UploadModalIsOpen, setUploadModalIsOpen] = useState(false);
  const [EditModalIsOpen, setEditModalIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();
  const [radioValue, setRadioValue] = useState('active')

  function SubmitUpdateInitiative(initiative: Initiative, companyId: number)
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const validation = ValidateNewInitiative(initiative, companyId, companyList);
    if(validation.success)
    {
      dispatch(updateInitiativeInfo({initiative: initiative, companyId: companyId.toString(), isTest: isTest}));
      setAddInitiativeIsOpen(false);
      ShowToast("Update initiative successful", 'Success')
    }
    else
      ShowToast(ValidationFailedPrefix + validation.message,'Error');
  }

  function SubmitUpdateThroughput(companyId: number, initiativeId: number, dataList: ThroughputData[])
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const validation = ValidateThroughputDataUpdate(companyList, companyId, initiativeId, dataList);
    if(validation.success)
    {
      dispatch(updateThroughputData({companyId: companyId.toString(), initiativeId: initiativeId.toString(), itemsCompletedOnDate: dataList, isTest: isTest}));
      setUploadModalIsOpen(false);
      ShowToast(validation.message, 'Success')
    }
    else
      ShowToast(ValidationFailedPrefix + validation.message, 'Error');
  }

  function SubmitEditThroughput(companyId: number, initiativeId: number, dataList: ThroughputData[])
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const validation = ValidateCompanyAndInitiative(companyList, companyId, initiativeId);
    if(validation.success)
    {
      dispatch(updateThroughputData({companyId: companyId.toString(), initiativeId: initiativeId.toString(), itemsCompletedOnDate: dataList, isTest: isTest}));
      setEditModalIsOpen(false);
      ShowToast(validation.message, 'Success')
    }
    else
      ShowToast(ValidationFailedPrefix + validation.message, 'Error'); 
  }

  return (
  <div className="col-span-4">
    <div className="bg-[#445362] rounded-md py-3 px-5">
      <div className="w-full flex justify-between">
        <p className="text-3xl text-white">Initiatives</p>
        <div className="space-x-2 flex flex-wrap">
          <button onClick={() => setAddInitiativeIsOpen(true)} className="outline h-[40px] bg-[#21345b] text-white w-32 rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]">
            Add Initiative
          </button>
          <button onClick={() => setUploadModalIsOpen(true)} className="outline h-[40px] bg-[#21345b] text-white w-32 rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]">
            Upload Data
          </button>
          <button onClick={() => setEditModalIsOpen(true)} className="outline h-[40px] bg-[#21345b] text-white w-32 rounded-md hover:outline-[#2ed7c3] hover:text-[#2ed7c3]">
            Edit Data
          </button>
          <UpdateInitiativeListModal title='Add Initiative' initiativeIsOpen={AddInitiativeIsOpen} setInitiativeIsOpen={setAddInitiativeIsOpen} Submit={SubmitUpdateInitiative}/>
          <UploadThroughputModal companyList={companyList} uploadIsOpen={UploadModalIsOpen} setUploadIsOpen={setUploadModalIsOpen} Submit={SubmitUpdateThroughput}/>
          <EditThroughputModal companyList={companyList} editIsOpen={EditModalIsOpen} setEditIsOpen={setEditModalIsOpen} Submit={SubmitEditThroughput}/>
        </div>
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
      <InitiativesTable companyList={companyList} radioStatus={radioValue} ValidateInitiative={ValidateNewInitiative} admin={true}/>
    </div>
  </div>
  )
}