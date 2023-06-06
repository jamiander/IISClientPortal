import { Company, Initiative, deleteDecisionData, upsertDecisionData } from "../../Store/CompanySlice";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, StyledTextarea, labelStyle} from "../../Styles";
import { DateInfo, DecisionData } from "../../Services/CompanyService";
import { ValidateDecisions, ValidationFailedPrefix } from "../../Services/Validation";
import { useAppDispatch } from "../../Store/Hooks";
import { DeleteDecisionAlert } from "./DeleteDecisionAlert";
import { enqueueSnackbar } from "notistack";
import {v4 as UuidV4} from "uuid";
import { DateInput } from "../DateInput";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment } from "@mui/material";
import { BaseInitiativeModal } from "./BaseInitiativeModal";
import { AddButton } from "../AddButton";
import { MakeClone } from "../../Services/Cloning";

export const DecisionModalIds = {
  modal: "decisionModal",
  keywordFilter: "decisionModalKeywordFilter",
  addButton: "decisionModalAddButton",
  closeModalButton: "decisionModalCloseModalButton",
  editButton: "decisionModalEditButton",
  deleteButton: "decisionModalDeleteButton",
  saveChangesButton: "decisionModalSaveChangesButton",
  cancelChangesButton: "decisionModalCancelChangesButton",
  description: "decisionModalDescription",
  resolution: "decisionModalResolution",
  participants: "decisionModalParticipants",
  date: "decisionModalDate",
  editDescription: "decisionModalEditDescription",
  editResolution: "decisionModalEditResolution",
  editParticipants: "decisionModalEditParticipants",
  editDate: "decisionModalEditDate",
  grid: "decisionModalGrid"
}

interface DecisionDataProps {
    title: string
    company: Company
    initiative: Initiative 
    isOpen: boolean
    setDecisionModalIsOpen: (value: boolean) => void
    isAdmin: boolean
}

export default function DecisionDataModal(props: DecisionDataProps) {
  const dispatch = useAppDispatch();

  enum State {
    start,
    edit,
    add,
    delete
  }
  const [modalState, setModalState] = useState(State.start);

  const [currentDescription, setCurrentDescription] = useState("");
  const [currentResolution, setCurrentResolution] = useState("");
  const [currentParticipants, setCurrentParticipants] = useState("");
  //const [currentDateString, setCurrentDateString] = useState("");
  const [currentDate, setCurrentDate] = useState<DateInfo | undefined>();

  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
  const [decisionToEdit, setDecisionToEdit] = useState<DecisionData>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filteredDecisions, setFilteredDecisions] = useState<DecisionData[]>([]);

  const InEditMode = () => modalState === State.edit || modalState === State.add;
  const today = new Date();
  const todayInfo: DateInfo = {month: today.getMonth()+1, day: today.getDate(), year: today.getFullYear()}
  const [searchedKeyword, setSearchedKeyword] = useState("");

  useEffect(() => {
    setSelectedInitiative(props.initiative);
    LeaveEditMode();
  },[props.isOpen]);

  useEffect(() => {
    setFilteredDecisions(selectedInitiative.decisions.filter(
      d => 
        d.description.toUpperCase().includes(searchedKeyword.toUpperCase()) 
        || d.resolution.toUpperCase().includes(searchedKeyword.toUpperCase())
        || d.participants.toUpperCase().includes(searchedKeyword.toUpperCase())
    ));
  },[selectedInitiative,searchedKeyword]);

  function HandleAddEmptyDecision()
  {
    if(modalState === State.start)
    {
      let initiativeClone: Initiative = MakeClone(selectedInitiative);
      let newId = UuidV4();
      let newDecision: DecisionData = {id: newId, description: "", resolution: "", participants: "", date: todayInfo};
      initiativeClone.decisions.unshift(newDecision);

      setSearchedKeyword("");
      setSelectedInitiative(initiativeClone);
      EnterEditMode(newId,initiativeClone,true);
    }
    else
      enqueueSnackbar("Save current changes before adding a new decision.", {variant: "error"});
  }

  function HandleCancelEdit()
  {
    if(modalState === State.add && decisionToEdit)
    {
      let initiativeClone: Initiative = MakeClone(selectedInitiative);
      initiativeClone.decisions = initiativeClone.decisions.filter(d => d.id !== decisionToEdit.id);

      setSelectedInitiative(initiativeClone);
    }
    LeaveEditMode();
  }

  function HandleEditDecision(decisionId: string, newDescription: string, newResolution: string, newParticipants: string, newDate?: DateInfo)
  {
    let selectedInitiativeClone: Initiative = MakeClone(selectedInitiative);
    let newDecision = selectedInitiativeClone.decisions.find(d => d.id === decisionId);
    
    if(newDecision)
    {
      newDecision.description = newDescription;
      newDecision.resolution = newResolution;
      newDecision.participants = newParticipants;
      if(newDate)
        newDecision.date = newDate;

      let successfulSubmit = SubmitDecisionData(selectedInitiativeClone.decisions);
      if(successfulSubmit)
        setSelectedInitiative(selectedInitiativeClone);
    }
  }

  function EnterEditMode(decisionId: string, currentInitiative: Initiative, newDecision: boolean)
  {
    let currentDecision = currentInitiative.decisions.find(d => d.id === decisionId);
    if(currentDecision)
    {
      setModalState(newDecision ? State.add : State.edit);
      setDecisionToEdit(currentDecision);
      
      setCurrentDescription(currentDecision.description);
      setCurrentResolution(currentDecision.resolution);
      setCurrentParticipants(currentDecision.participants);
      //setCurrentDateString(MakeDateString(currentDecision.date));
      setCurrentDate(currentDecision.date);
    }
  }

  function LeaveEditMode()
  {
    setDecisionToEdit(undefined);
    setModalState(State.start);
  }

  function SubmitDecisionData(decisions: DecisionData[]): boolean
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    
    let validation = ValidateDecisions(decisions);
    if(validation.success)
    {
      dispatch(upsertDecisionData({isTest: isTest, companyId: props.company.id, initiativeId: props.initiative.id, decisions: decisions}));
      LeaveEditMode();
      return true;
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
    
    return false;
  }

  function HandleAttemptDelete(decisionId: string)
  {
    if(modalState === State.start)
    {
      setIsDeleteOpen(true);
      setDecisionToEdit(selectedInitiative.decisions.find(d => d.id === decisionId));
      setModalState(State.delete);
    }
    else
      enqueueSnackbar("Cannot delete with unsaved changes.", {variant: "error"});
  }

  function DeleteDecision(decisionId: string)
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let selectedInitiativeClone: Initiative = MakeClone(selectedInitiative);
    selectedInitiativeClone.decisions = selectedInitiativeClone.decisions.filter(d => d.id !== decisionId);

    dispatch(deleteDecisionData({isTest: isTest, companyId: props.company.id, initiativeId: props.initiative.id, decisionIds: [decisionId]}));
    setSelectedInitiative(selectedInitiativeClone);
    setIsDeleteOpen(false);
    LeaveEditMode();
  }

  function CancelDelete()
  {
    setIsDeleteOpen(false);
    LeaveEditMode();
  }

  return (
    <>
      <BaseInitiativeModal
        open={props.isOpen}
        onClose={()=>props.setDecisionModalIsOpen(false)}
        cypressData={{modal: DecisionModalIds.modal, closeModalButton: DecisionModalIds.closeModalButton}}
        company={props.company}
        initiative={props.initiative}
        title="Decisions"
        maxWidth={false}
        >
          <div className="mx-[2%] mb-[2%] w-full">
            <Grid container className="my-2" alignItems="center" justifyContent="left" spacing={2} display="flex" columns={12}>
              {selectedInitiative.decisions.length !== 0 &&
                <Grid item xs="auto">
                  <StyledTextField data-cy={DecisionModalIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              }
              {props.isAdmin &&
                <Grid item xs="auto">
                  <AddButton cypressData={DecisionModalIds.addButton} HandleClick={() => HandleAddEmptyDecision()} disabled={InEditMode()}/>
                </Grid>
              }
            </Grid>
            <Grid data-cy={DecisionModalIds.grid} container spacing={6}>
              {
              filteredDecisions.map((displayItem, key) => {
                let isEdit = InEditMode() && displayItem.id === (decisionToEdit?.id ?? -1);
                
                return(
                  <Grid item md={4} key={key}>
                    <Item>
                      <StyledCard>
                        <StyledCardContent>
                          {isEdit ?
                          <>
                            <label className={labelStyle} htmlFor="description">Decision Description</label>
                            <StyledTextarea id="description" data-cy={DecisionModalIds.editDescription} value={currentDescription} onChange={e => setCurrentDescription(e.target.value)}/>
                            <label className={labelStyle} htmlFor="resolution">Resolution</label>
                            <StyledTextarea id="resolution" data-cy={DecisionModalIds.editResolution} value={currentResolution} onChange={e => setCurrentResolution(e.target.value)}/>
                            <StyledTextField sx={{marginLeft:0, marginBottom:2.5}}  data-cy={DecisionModalIds.editParticipants} label="Participants" value={currentParticipants} onChange={e => setCurrentParticipants(e.target.value)}/>
                            <DateInput cypressData={DecisionModalIds.editDate} label="Date Resolved" date={currentDate} setDate={setCurrentDate}/>
                          </>
                          :
                          <>
                            <label className={labelStyle} htmlFor="description">Decision Description</label>
                            <StyledTextarea id="description" data-cy={DecisionModalIds.description} disabled value={displayItem.description}/>
                            <label className={labelStyle} htmlFor="resolution">Resolution</label>
                            <StyledTextarea id="resolution" data-cy={DecisionModalIds.resolution} disabled value={displayItem.resolution}/>
                            <StyledTextField sx={{marginLeft:0, marginBottom:2.5}} data-cy={DecisionModalIds.participants} label="Participants" disabled value={displayItem.participants}/>
                            <DateInput cypressData={DecisionModalIds.date} label="Date Resolved" disabled={true} date={displayItem.date} setDate={setCurrentDate}/>
                          </>
                          }
                        </StyledCardContent>
                        <StyledCardActions>
                          {isEdit &&
                            <div className="flex w-full justify-between">
                              <IconButton data-cy={DecisionModalIds.saveChangesButton}
                                onClick={() => HandleEditDecision(displayItem.id, currentDescription, currentResolution, currentParticipants, currentDate ?? displayItem.date)}>
                                <DoneIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                              <IconButton data-cy={DecisionModalIds.cancelChangesButton} onClick={() => HandleCancelEdit()}>
                                <CancelIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                            </div>
                          }
                          {
                            !isEdit && !InEditMode() && props.isAdmin &&
                            <div className="flex w-full justify-between">
                              <IconButton data-cy={DecisionModalIds.editButton} onClick={() => EnterEditMode(displayItem.id, selectedInitiative, false)}>
                                <EditIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                              <IconButton data-cy={DecisionModalIds.deleteButton} onClick={() => HandleAttemptDelete(displayItem.id)}>
                                <DeleteIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                            </div>
                          }
                        </StyledCardActions>
                      </StyledCard>
                    </Item>
                  </Grid>
                )
              })}
              {
              filteredDecisions.length === 0 && <Grid item>No decisions to display.</Grid>
              }
            </Grid>
            
          </div>
        </BaseInitiativeModal>
        <DeleteDecisionAlert isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} DeleteDecision={DeleteDecision} CancelDelete={CancelDelete} decisionId={decisionToEdit?.id}/>
      </>
  );
}