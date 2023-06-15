import { useState } from "react";
import InitiativesTable from "../Components/Initiative/InitiativesTable";
import { RadioSet } from "../Components/RadioSet";
import ValidateNewInitiative, {  } from "../Services/Validation";
import { useAppSelector, useAppDispatch } from "../Store/Hooks";
import { Company, selectAllCompanies } from "../Store/CompanySlice";
import { Grid } from "@mui/material";
import { selectCurrentUser } from "../Store/UserSlice";
import { AddButton } from "../Components/AddButton";
import { SearchBar } from "../Components/SearchBar";

export const InitiativeDisplayRadioIds = {
  all: "initDisplayShowAll",
  active: "initDisplayShowActive",
  inactive: "initDisplayShowInactive"
}

export const InitiativesPageIds = {
  addInitiativeButton: "initiativesPageAddInitiativeButton",
  uploadThroughputButton: "initiativesPageUploadThroughputButton",
  editThroughputButton: "initiativesPageEditThroughputButton",
  companyNameFilter: "initiativesPageCompanyNameFilter",
  initiativeTitleFilter: "initiativesPageInitiativeTitleFilter"
}

export default function InitiativesPage(){
  
  const companyList : Company[] = useAppSelector(selectAllCompanies);
  const currentUser = useAppSelector(selectCurrentUser);

  const [searchedComp, setSearchedComp] = useState("");
  const [searchedInit, setSearchedInit] = useState("");
  const [addInitiative, setAddInitiative] = useState(false);
  const [radioValue, setRadioValue] = useState('active');

  return (
    <>
      <div className="mx-[2%] mb-2">
        <div className="flex flex-row justify-content:space-between">
          <Grid container sx={{ display: 'flex',
              flexDirection: 'row',
              placeItems: 'center',
              px: 1,
              pt: 1,
              mt: 2,
              ml: 2,
              mr: 2,
              borderRadius: 1 }}>
            <Grid item xs={3}>
              <div className="mb-1">
                <SearchBar cypressData={InitiativesPageIds.companyNameFilter} placeholder="Filter by Company" value={searchedComp} setValue={setSearchedComp} />
              </div>
              <div className="mt-1">
                <SearchBar cypressData={InitiativesPageIds.initiativeTitleFilter} placeholder="Filter by Title" value={searchedInit} setValue={setSearchedInit} />
              </div>
            </Grid>
            <RadioSet dark={true} setter={setRadioValue} name="initiativesDisplay" options={[
            { cypressData: InitiativeDisplayRadioIds.all, label: "Show All", value: "all" },
            { cypressData: InitiativeDisplayRadioIds.active, label: "Active", value: "active", default: true },
            { cypressData: InitiativeDisplayRadioIds.inactive, label: "Inactive", value: "inactive" }
            ]} />
            {currentUser?.isAdmin ?
              <Grid item xs={3} sx={{ display: 'flex',
                justifyContent: 'flex-end'
                }}>   
                <AddButton cypressData={InitiativesPageIds.addInitiativeButton} HandleClick={() => setAddInitiative(true)}/>     
              </Grid>
              :
              <Grid item xs={3}></Grid>
            }
          </Grid>
        </div>
        {companyList.length > 0 &&
        <InitiativesTable addInitiative={addInitiative} currentUser={currentUser} companyList={companyList} radioStatus={radioValue}
          ValidateInitiative={ValidateNewInitiative} setAddInitiative={setAddInitiative}
          searchedComp={searchedComp} setSearchedComp={setSearchedComp}
          searchedInit={searchedInit} setSearchedInit={setSearchedInit}
        />}
      </div>
     </>
  )
}