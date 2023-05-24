import { useState } from "react";
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
import { enqueueSnackbar } from "notistack";

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
      enqueueSnackbar("Update initiative successful", {variant: 'success'});
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message,{variant:'error'});
  }

  function SubmitUpdateThroughput(companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean = true) : boolean
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const validation = emptyDataCheck ? ValidateFileThroughputData(companyList, companyId, initiativeId, dataList) : ValidateEditThroughputData(companyList, companyId, initiativeId, dataList);
    if(validation.success)
    {
      dispatch(upsertThroughputData({companyId: companyId, initiativeId: initiativeId, itemsCompletedOnDate: dataList, isTest: isTest}));
      setUploadModalIsOpen(false);
      enqueueSnackbar(validation.message, {variant:'success'});
      return true;
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant:'error'});
      return false;
  }

  return (
  <div>
    <div>
      <UploadThroughputModal companyList={companyList} uploadIsOpen={UploadModalIsOpen} setUploadIsOpen={setUploadModalIsOpen} Submit={SubmitUpdateThroughput}/>
      <EditThroughputModal companyList={companyList} editIsOpen={EditModalIsOpen} setEditIsOpen={setEditModalIsOpen} Submit={SubmitUpdateThroughput}/>
    </div>
      <RadioSet dark={true} setter={setRadioValue} name="initiativesDisplay" options={[
        {id: InitiativeDisplayRadioIds.all, label: "Show All", value: "all"},
        {id: InitiativeDisplayRadioIds.active, label: "Only Active", value: "active", default: true},
        {id: InitiativeDisplayRadioIds.inactive, label: "Only Inactive", value: "inactive"}
        ]} />
        {/* <button onClick={() => setAddInitiativeIsOpen(true)} className={yellowButtonStyle}>
          Add Initiative
        </button> */}
        <button onClick={() => setUploadModalIsOpen(true)} className={yellowButtonStyle}>
            Upload Data File
        </button>
        <button onClick={() => setEditModalIsOpen(true)} className={yellowButtonStyle}>
          Add/Edit Data
        </button>

      {companyList.length > 0 &&
        <InitiativesTable companyList={companyList} radioStatus={radioValue} ValidateInitiative={ValidateNewInitiative} admin={true}/>
      }
  </div>
  )
}