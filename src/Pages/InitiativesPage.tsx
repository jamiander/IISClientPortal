import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import EditThroughputModal from "../Components/Initiative/EditThroughputModal";
import InitiativesTable from "../Components/Initiative/InitiativesTable";
import UploadThroughputModal from "../Components/Initiative/UploadThroughputModal";
import { RadioSet } from "../Components/RadioSet";
import { ThroughputData } from "../Services/CompanyService";
import ValidateNewInitiative, { ValidateFileThroughputData, ValidateEditThroughputData, ValidationFailedPrefix } from "../Services/Validation";
import { useAppSelector, useAppDispatch } from "../Store/Hooks";
import { yellowButtonStyle } from "../Styles";
import { Company, selectAllCompanies, upsertThroughputData } from "../Store/CompanySlice";

export const InitiativeDisplayRadioIds = {
  all: "initDisplayShowAll",
  active: "initDisplayShowActive",
  inactive: "initDisplayShowInactive"
}

export default function InitiativesPage(){
  
  const companyList : Company[] = useAppSelector(selectAllCompanies);

  const [addInitiative, setAddInitiative] = useState(false);
  const [UploadModalIsOpen, setUploadModalIsOpen] = useState(false);
  const [EditModalIsOpen, setEditModalIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const [radioValue, setRadioValue] = useState('active');

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
    <><div className="flex col-span-4 bg-[#69D5C3] py-6 px-5">
      <div className="w-full flex justify-between">
        <div className="space-y-2 w-1/2">
          <p className="text-5xl text-[#21345b] font-bold w-full">Initiative Management</p>
        </div>
      </div>
    </div>
    <div>
        <div>
          <UploadThroughputModal companyList={companyList} uploadIsOpen={UploadModalIsOpen} setUploadIsOpen={setUploadModalIsOpen} Submit={SubmitUpdateThroughput} />
          <EditThroughputModal companyList={companyList} editIsOpen={EditModalIsOpen} setEditIsOpen={setEditModalIsOpen} Submit={SubmitUpdateThroughput} />
        </div>
        <div className="mx-[2%] mb-[2%]">
        <RadioSet dark={true} setter={setRadioValue} name="initiativesDisplay" options={[
          { id: InitiativeDisplayRadioIds.all, label: "Show All", value: "all" },
          { id: InitiativeDisplayRadioIds.active, label: "Only Active", value: "active", default: true },
          { id: InitiativeDisplayRadioIds.inactive, label: "Only Inactive", value: "inactive" }
        ]} />
        <div className="flex flex-col justify-between">
          <div className="space-x-2 flex flex-wrap mt-4 mb-4">
          <button onClick={() => setAddInitiative(true)} className={yellowButtonStyle}>
            Add Initiative
          </button>
          <button onClick={() => setUploadModalIsOpen(true)} className={yellowButtonStyle}>
            Upload Data File
          </button>
          <button onClick={() => setEditModalIsOpen(true)} className={yellowButtonStyle}>
            Add/Edit Data
          </button>
        </div>
        </div>
        {companyList.length > 0 &&
          <InitiativesTable addInitiative={addInitiative} companyList={companyList} radioStatus={radioValue} ValidateInitiative={ValidateNewInitiative} setAddInitiative={setAddInitiative} />}
        </div>
      </div>
      </>
    ) 
  }