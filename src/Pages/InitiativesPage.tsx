import { useEffect, useMemo, useState } from "react";
import InitiativesTable from "../Components/Initiative/InitiativesTable";
import ValidateNewInitiative, {  } from "../Services/Validation";
import { useAppSelector } from "../Store/Hooks";
import { Company, IntegrityId, selectAllCompanies } from "../Store/CompanySlice";
import { Grid } from "@mui/material";
import { selectCurrentUser } from "../Store/UserSlice";
import { AddButton } from "../Components/AddButton";
import { SearchBar } from "../Components/SearchBar";
import { InitiativeFilter } from "../Services/Filters";
import { ActiveRadioSet } from "../Components/ActiveRadioSet";

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

export default function InitiativesPage()
{
  const companiesFromStore = useAppSelector(selectAllCompanies);
  const [allCompanies, setAllCompanies] = useState<Company[]>(companiesFromStore);
  const currentUser = useAppSelector(selectCurrentUser);

  const [searchedComp, setSearchedComp] = useState("");
  const [searchedInit, setSearchedInit] = useState("");
  const [addInitiative, setAddInitiative] = useState(false);
  const [radioValue, setRadioValue] = useState('active');

  const allInitiatives = useMemo(() => allCompanies.flatMap(c => c.initiatives),[allCompanies]);

  //This exists because we need to be able to prevent the initiatives from updating automatically when editing throughput.
  //Without this, changes to the throughput can alter the initiative's position in the table, which causes the modal to
  //no longer refer to the correct initiative.
  const [isTableLocked, setIsTableLocked] = useState(false);
  
  useEffect(() => {
    if(!isTableLocked)
      setAllCompanies(companiesFromStore);
  },[companiesFromStore, isTableLocked])

  return (
    <>
      <div className="mx-[2%] mb-2">
        <div className="flex flex-row justify-content:space-between">
          <Grid container sx={{ display: 'flex',
              flexDirection: 'row',
              placeItems: 'center',
              p: 1,
              mt: 2,
              mb: 1,
              ml: 2,
              mr: 2,
              borderRadius: 1 }}>
            <Grid item xs={3}>
              {currentUser?.companyId === IntegrityId && 
                <SearchBar cypressData={InitiativesPageIds.companyNameFilter} placeholder="Filter by Company" value={searchedComp} setValue={setSearchedComp} />
              }
                <SearchBar cypressData={InitiativesPageIds.initiativeTitleFilter} placeholder="Filter by Title" value={searchedInit} setValue={setSearchedInit} />
            </Grid>
            <ActiveRadioSet cypressData={InitiativeDisplayRadioIds} name="initiativesPage" setRadioValue={setRadioValue} listItems={allInitiatives} filterFunc={InitiativeFilter}/>
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
        {allCompanies.length > 0 && currentUser &&
        <InitiativesTable addInitiative={addInitiative} currentUser={currentUser} companyList={allCompanies} radioStatus={radioValue}
          setAddInitiative={setAddInitiative}
          searchedComp={searchedComp} setSearchedComp={setSearchedComp}
          searchedInit={searchedInit} setSearchedInit={setSearchedInit}
          SetIsTableLocked={setIsTableLocked}
        />}
      </div>
     </>
  )
}