import { useEffect, useMemo, useState } from "react";
import InitiativesTable from "../Components/Initiative/InitiativesTable";
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

export enum initPageStateEnum {
  start,
  edit,
  add
}

export default function InitiativesPage()
{
  const companiesFromStore = useAppSelector(selectAllCompanies);
  const [allCompanies, setAllCompanies] = useState<Company[]>(companiesFromStore);
  const currentUser = useAppSelector(selectCurrentUser);

  const [searchedComp, setSearchedComp] = useState("");
  const [searchedInit, setSearchedInit] = useState("");
  const [addInitiative, setAddInitiative] = useState(false);
  const [state, setState] = useState(initPageStateEnum.start);
  const [radioValue, setRadioValue] = useState('active');
  const isEditing = state !== initPageStateEnum.start;

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
        {currentUser?.isAdmin && 
          <Grid container sx={{ display: 'flex',
              flexDirection: 'row',
              placeItems: 'center',
              p: 1,
              mt: 2,
              mb: 1,
              ml: 2,
              mr: 2,
              borderRadius: 1 }}>
            {currentUser?.companyId === IntegrityId ?
            <><Grid item xs={3} sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}>
                  <SearchBar cypressData={InitiativesPageIds.companyNameFilter} placeholder="Filter by Company" value={searchedComp} setValue={setSearchedComp} disabled={isEditing} /><SearchBar cypressData={InitiativesPageIds.initiativeTitleFilter} placeholder="Filter by Title" value={searchedInit} setValue={setSearchedInit} disabled={isEditing} />
                </Grid><ActiveRadioSet cypressData={InitiativeDisplayRadioIds} name="initiativesPage" setRadioValue={setRadioValue} listItems={allInitiatives} filterFunc={InitiativeFilter} disabled={isEditing} /></>
              :
              <Grid item xs={9} sx={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}></Grid>
            }
              <Grid item xs={3} sx={{ 
                display: 'flex',
                justifyContent: 'flex-end'
                }}>   
                <AddButton cypressData={InitiativesPageIds.addInitiativeButton}
                  HandleClick={() => {
                    setSearchedComp("");
                    setSearchedInit("");
                    setAddInitiative(true);
                  }} 
                disabled={isEditing}/>     
              </Grid>
          </Grid>
        }
        </div>
        {allCompanies.length > 0 && currentUser &&
        <InitiativesTable addInitiative={addInitiative} currentUser={currentUser} companyList={allCompanies} radioStatus={radioValue}
          setAddInitiative={setAddInitiative}
          searchedComp={searchedComp} setSearchedComp={setSearchedComp}
          searchedInit={searchedInit} setSearchedInit={setSearchedInit}
          SetIsTableLocked={setIsTableLocked}
          state={state} setState={setState}
        />}
      </div>
     </>
  )
}