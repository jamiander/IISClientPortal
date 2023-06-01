import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import EditThroughputModal from "../Components/Initiative/EditThroughputModal";
import InitiativesTable from "../Components/Initiative/InitiativesTable";
import UploadThroughputModal from "../Components/Initiative/UploadThroughputModal";
import { RadioSet } from "../Components/RadioSet";
import { ThroughputData } from "../Services/CompanyService";
import ValidateNewInitiative, { ValidateFileThroughputData, ValidateEditThroughputData, ValidationFailedPrefix } from "../Services/Validation";
import { useAppSelector, useAppDispatch } from "../Store/Hooks";
import { inputStyle, yellowButtonStyle } from "../Styles";
import { Company, selectAllCompanies, upsertThroughputData } from "../Store/CompanySlice";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export const InitiativeDisplayRadioIds = {
  all: "initDisplayShowAll",
  active: "initDisplayShowActive",
  inactive: "initDisplayShowInactive"
}

export const InitiativesPageIds = {
  addInitiativeButton: "initiativesPageAddInitiativeButton",
  uploadThroughputButton: "initiativesPageUploadThroughputButton",
  editThroughputButton: "initiativesPageEditThroughputButton"
}

export default function InitiativesPage(){
  
  const companyList : Company[] = useAppSelector(selectAllCompanies);

  const [addInitiative, setAddInitiative] = useState(false);
  const [UploadModalIsOpen, setUploadModalIsOpen] = useState(false);
  const [EditModalIsOpen, setEditModalIsOpen] = useState(false);
  
  const dispatch = useAppDispatch();
  const [radioValue, setRadioValue] = useState('active');

  async function SubmitUpdateThroughput(companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean = true) : Promise<boolean>
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const validation = emptyDataCheck ? ValidateFileThroughputData(companyList, companyId, initiativeId, dataList) : ValidateEditThroughputData(companyList, companyId, initiativeId, dataList);
    if(validation.success)
    {
      await dispatch(upsertThroughputData({companyId: companyId, initiativeId: initiativeId, itemsCompletedOnDate: dataList, isTest: isTest}));
      setUploadModalIsOpen(false);
      enqueueSnackbar("Throughput data changes have been saved.", {variant:'success'});
      return true;
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant:'error'});
      return false;
  }

  return (
    <>
      <div className="flex col-span-4 bg-[#21355B] py-6 px-5 rounded-md">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl text-white font-bold w-full">Initiative Management</p>
          </div>
        </div>
      </div>
      <div>
        <div>
          <UploadThroughputModal companyList={companyList} uploadIsOpen={UploadModalIsOpen} setUploadIsOpen={setUploadModalIsOpen} Submit={SubmitUpdateThroughput} />
          <EditThroughputModal companyList={companyList} editIsOpen={EditModalIsOpen} setEditIsOpen={setEditModalIsOpen} Submit={SubmitUpdateThroughput} />
        </div>
        <div className="mx-[2%] mb-[2%]">
         <div className="flex flex-col justify-between mx-1 h-[45px]">
           <Box sx={{ display: 'flex',
              justifyContent: 'flex-end',
              p: 1,
              mr: 15,
              mt: 2,
              mb: 1,
              borderRadius: 1, }}>
{/*           <div className="space-x-2 flex flex-wrap mt-2 mb-2">
 */}          {/* <button id={InitiativesPageIds.uploadThroughputButton} onClick={() => setUploadModalIsOpen(true)} className={yellowButtonStyle}>
            Upload Data File
          </button>
          <button id={InitiativesPageIds.editThroughputButton} onClick={() => setEditModalIsOpen(true)} className={yellowButtonStyle}>
            Add/Edit Data
          </button> */}
            <RadioSet dark={true} setter={setRadioValue} name="initiativesDisplay" options={[
              { id: InitiativeDisplayRadioIds.all, label: "Show All", value: "all" },
              { id: InitiativeDisplayRadioIds.active, label: "Active", value: "active", default: true },
              { id: InitiativeDisplayRadioIds.inactive, label: "Inactive", value: "inactive" }
            ]} />
          {/* </div> */}
          
            <IconButton id={InitiativesPageIds.addInitiativeButton} onClick={() => setAddInitiative(true)}>
                <AddIcon fontSize="large"/>
            </IconButton>
          </Box>
         </div>
         {companyList.length > 0 &&
          <InitiativesTable addInitiative={addInitiative} companyList={companyList} radioStatus={radioValue} ValidateInitiative={ValidateNewInitiative} setAddInitiative={setAddInitiative}/>}
        </div>
       </div>
     </>
  )
}