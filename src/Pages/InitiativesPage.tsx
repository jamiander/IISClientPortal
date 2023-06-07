import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import EditThroughputModal from "../Components/Initiative/EditThroughputModal";
import InitiativesTable from "../Components/Initiative/InitiativesTable";
import UploadThroughputModal from "../Components/Initiative/UploadThroughputModal";
import { RadioSet } from "../Components/RadioSet";
import { ThroughputData } from "../Services/CompanyService";
import ValidateNewInitiative, { ValidateFileThroughputData, ValidateEditThroughputData, ValidationFailedPrefix } from "../Services/Validation";
import { useAppSelector, useAppDispatch } from "../Store/Hooks";
import { UserTextField, inputStyle, yellowButtonStyle } from "../Styles";
import { Company, selectAllCompanies, upsertThroughputData } from "../Store/CompanySlice";
import { Box, Grid, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { selectCurrentUser } from "../Store/UserSlice";

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
  const currentUser = useAppSelector(selectCurrentUser);

  const [addInitiative, setAddInitiative] = useState(false);
  const dispatch = useAppDispatch();
  const [radioValue, setRadioValue] = useState('active');

  return (
    <>
      <div className="flex col-span-4 bg-[#21355B] py-6 px-5 rounded-md">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-[2.2vw] text-white font-bold w-full">Initiative Management</p>
          </div>
        </div>
      </div>
      <div className="mx-[2%] mb-2">
        <div className="flex flex-col justify-content:space-between">
         <Grid container sx={{ display: 'flex',
              flexDirection: 'row',
              placeItems: 'center',
              px: 1,
              pt: 1,
              mt: 2,
              borderRadius: 1, }}>
            <Grid item xs={3}></Grid>
            <RadioSet dark={true} setter={setRadioValue} name="initiativesDisplay" options={[
            { cypressData: InitiativeDisplayRadioIds.all, label: "Show All", value: "all" },
            { cypressData: InitiativeDisplayRadioIds.active, label: "Active", value: "active", default: true },
            { cypressData: InitiativeDisplayRadioIds.inactive, label: "Inactive", value: "inactive" }
            ]} />  
            {currentUser?.isAdmin ?
            <Grid item xs={3} sx={{ display: 'flex',
              justifyContent: 'flex-end',
              paddingRight: '5%'
              }}>        
              <IconButton data-cy={InitiativesPageIds.addInitiativeButton} onClick={() => setAddInitiative(true)}>
                  <AddIcon sx={{fontSize: "calc(30px + 0.390625vw)", color: "#21345b"}}/>Add
              </IconButton>
            </Grid>
            :
            <Grid item xs={3}></Grid>
            }
         </Grid>
         {companyList.length > 0 &&
          <InitiativesTable addInitiative={addInitiative} currentUser={currentUser} companyList={companyList} radioStatus={radioValue} ValidateInitiative={ValidateNewInitiative} setAddInitiative={setAddInitiative}/>}
        </div>
      </div>
     </>
  )
}