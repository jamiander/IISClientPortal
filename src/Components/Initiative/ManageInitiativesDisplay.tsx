import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Company, Initiative, selectAllCompanies, upsertInitiativeInfo, upsertThroughputData } from "../../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import InitiativesTable from "./InitiativesTable"
import ValidateNewInitiative, { ValidateEditThroughputData, ValidateFileThroughputData, ValidationFailedPrefix } from "../../Services/Validation";
import UploadThroughputModal from "./UploadThroughputModal";
import { UpdateInitiativeListModal } from "./UpdateInitiativeListModal";
import { ThroughputData } from "../../Services/CompanyService";
import EditThroughputModal from "./EditThroughputModal";
import { RadioSet } from "../RadioSet";
import { yellowButtonStyle } from "../../Styles";

export const InitiativeDisplayRadioIds = {
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
  const [radioValue, setRadioValue] = useState('active');

  function SubmitUpdateInitiative(initiative: Initiative, companyId: string)
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const validation = ValidateNewInitiative(initiative, companyId, companyList);
    if(validation.success)
    {
      dispatch(upsertInitiativeInfo({initiative: initiative, companyId: companyId.toString(), isTest: isTest}));
      setAddInitiativeIsOpen(false);
      ShowToast("Update initiative successful", 'Success');
    }
    else
      ShowToast(ValidationFailedPrefix + validation.message,'Error');
  }

  function SubmitUpdateThroughput(companyId: string, initiativeId: number, dataList: ThroughputData[], emptyDataCheck: boolean = true)
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const validation = emptyDataCheck ? ValidateFileThroughputData(companyList, companyId, initiativeId, dataList) : ValidateEditThroughputData(companyList, companyId, initiativeId, dataList);
    if(validation.success)
    {
      dispatch(upsertThroughputData({companyId: companyId, initiativeId: initiativeId, itemsCompletedOnDate: dataList, isTest: isTest}));
      setUploadModalIsOpen(false);
      setEditModalIsOpen(false);
      ShowToast(validation.message, 'Success');
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
          <button onClick={() => setAddInitiativeIsOpen(true)} className={yellowButtonStyle}>
            Add Initiative
          </button>
          <button onClick={() => setUploadModalIsOpen(true)} className={yellowButtonStyle}>
            Upload Data File
          </button>
          <button onClick={() => setEditModalIsOpen(true)} className={yellowButtonStyle}>
            Add/Edit Data
          </button>
          <UpdateInitiativeListModal title='Add Initiative' initiativeIsOpen={AddInitiativeIsOpen} setInitiativeIsOpen={setAddInitiativeIsOpen} Submit={SubmitUpdateInitiative}/>
          <UploadThroughputModal companyList={companyList} uploadIsOpen={UploadModalIsOpen} setUploadIsOpen={setUploadModalIsOpen} Submit={SubmitUpdateThroughput}/>
          <EditThroughputModal companyList={companyList} editIsOpen={EditModalIsOpen} setEditIsOpen={setEditModalIsOpen} Submit={SubmitUpdateThroughput}/>
        </div>
      </div>

      <RadioSet options={[
        {id: InitiativeDisplayRadioIds.all, label: "Show All", value: "all"},
        {id: InitiativeDisplayRadioIds.active, label: "Only Active", value: "active", default: true},
        {id: InitiativeDisplayRadioIds.inactive, label: "Only Inactive", value: "inactive"}
        ]} 
        setter={setRadioValue} name="initiativesDisplay"/>

    </div>
    
    <div className="col-span-4 py-3 flex">
      <InitiativesTable companyList={companyList} pageNumber={1} radioStatus={radioValue} ValidateInitiative={ValidateNewInitiative} admin={true}/>
    </div>
  </div>
  )
}