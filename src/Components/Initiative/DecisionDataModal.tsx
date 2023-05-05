import Dialog from "@mui/material/Dialog";
import { Company, Initiative, deleteDecisionData, upsertDecisionData } from "../../Store/CompanySlice";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, StyledTextarea, cancelButtonStyle, submitButtonStyle, yellowButtonStyle, labelStyle} from "../../Styles";
import { DateInfo, DecisionData } from "../../Services/CompanyService";
import { MakeDateInfo, MakeDateString } from "../DateInput";
import { ValidateDecisions, ValidationFailedPrefix } from "../../Services/Validation";
import { useAppDispatch } from "../../Store/Hooks";
import { DeleteDecisionAlert } from "./DeleteDecisionAlert";
import { enqueueSnackbar } from "notistack";
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import {v4 as UuidV4} from "uuid";

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
  date: "decisionModalDate"
}

interface DecisionDataProps {
    title: string
    company: Company
    initiative: Initiative 
    isOpen: boolean
    setDecisionModalIsOpen: (value: boolean) => void
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
  const [currentDateString, setCurrentDateString] = useState("");

  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
  const [decisionToEdit, setDecisionToEdit] = useState<DecisionData>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const InEditMode = () => modalState === State.edit || modalState === State.add;
  const today = new Date();
  const todayInfo: DateInfo = {month: today.getMonth()+1, day: today.getDate(), year: today.getFullYear()}
  const [searchedKeyword, setSearchedKeyword] = useState("");

  useEffect(() => {
    setSelectedInitiative(props.initiative);
    LeaveEditMode();
  },[props.isOpen])

  function HandleAddEmptyDecision()
  {
    if(modalState === State.start)
    {
      let initiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
      let newId = UuidV4();
      let newDecision: DecisionData = {id: newId, description: "", resolution: "", participants: [], date: todayInfo};
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
      let initiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
      initiativeClone.decisions = initiativeClone.decisions.filter(d => d.id !== decisionToEdit.id);

      setSelectedInitiative(initiativeClone);
    }
    LeaveEditMode();
  }

  function HandleEditDecision(decisionId: string, newDescription: string, newResolution: string, newParticipants: string[], newDate?: DateInfo)
  {
    let selectedInitiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
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
      setCurrentParticipants(currentDecision.participants.join(", "));
      setCurrentDateString(MakeDateString(currentDecision.date));
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

    let selectedInitiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
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
      <Dialog
        id={DecisionModalIds.modal}
        open={props.isOpen}
        onClose={()=>props.setDecisionModalIsOpen(false)}
        fullWidth
        maxWidth={false}
        >
          <div className="flex col-span-4 bg-[#2ed7c3] rounded-md py-6 px-5">
            <div className="w-full flex justify-between">
              <div className="space-y-2 w-1/2">
                <p className="text-5xl font-bold w-full">{props.company.name}</p>
                <p className="text-3xl w-full">{props.initiative.title}</p>
              </div>
              <div className="flex flex-col justify-between">
                <div className="flex justify-end">
                  <button id={DecisionModalIds.closeModalButton} className="rounded-md transition ease-in-out hover:bg-[#29c2b0] w-fit" onClick={() => props.setDecisionModalIsOpen(false)}><CloseIcon sx={{fontSize: 40}}/></button>
                </div>
                <button id={DecisionModalIds.addButton} className={yellowButtonStyle} onClick={() => HandleAddEmptyDecision()}>Add Decision</button>
              </div>
            </div>
          </div>
          <div className="mx-[2%] mb-[2%]">
            {selectedInitiative.decisions.length !== 0 &&
            <div className="mt-2 mb-4">
              <StyledTextField className="w-1/2" id={DecisionModalIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in Description or Resolution" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)}/>
            </div>
            }
            <Grid container spacing={6}>
              {
              selectedInitiative.decisions.filter(d => d.description.toUpperCase().includes(searchedKeyword.toUpperCase()) || d.resolution.toUpperCase().includes(searchedKeyword.toUpperCase())).map((displayItem, key) => {
                let isEdit = InEditMode() && displayItem.id === (decisionToEdit?.id ?? -1);
                
                return(
                  <Grid item md={4} key={key}>
                    <Item>
                      <StyledCard>
                        <StyledCardContent>
                          {isEdit ?
                          <>
                            <label className={labelStyle} htmlFor={DecisionModalIds.description}>Decision Description</label>
                            <StyledTextarea id={DecisionModalIds.description} value={currentDescription} onChange={e => setCurrentDescription(e.target.value)}/>
                            <label className={labelStyle} htmlFor={DecisionModalIds.resolution}>Resolution</label>
                            <StyledTextarea id={DecisionModalIds.resolution} value={currentResolution} onChange={e => setCurrentResolution(e.target.value)}/>
                            <StyledTextField id={DecisionModalIds.participants} label="Participants-separate by comma" value={currentParticipants} onChange={e => setCurrentParticipants(e.target.value)}/>
                            <StyledTextField id={DecisionModalIds.date} label="Date Resolved" type="date" value={currentDateString} onChange={e => setCurrentDateString(e.target.value)}/>
                          </>
                          :
                          <>
                            <label className={labelStyle} htmlFor={DecisionModalIds.description}>Decision Description</label>
                            <StyledTextarea id={DecisionModalIds.description} disabled value={displayItem.description}/>
                            <label className={labelStyle} htmlFor={DecisionModalIds.resolution}>Resolution</label>
                            <StyledTextarea id={DecisionModalIds.resolution} disabled value={displayItem.resolution}/>
                            <StyledTextField id={DecisionModalIds.participants} label="Participants" disabled value={displayItem.participants.join(", ")}/>
                            <StyledTextField id={DecisionModalIds.date} label="Date Resolved" disabled type="date" value={MakeDateString(displayItem.date)}/>
                          </>
                          }
                        </StyledCardContent>
                        <StyledCardActions>
                          {isEdit &&
                            <div className="flex w-full justify-between">
                              <Button id={DecisionModalIds.saveChangesButton} className={submitButtonStyle} onClick={() => HandleEditDecision(displayItem.id, currentDescription, currentResolution, currentParticipants.split(",").map(s => s.trim()), currentDateString ? MakeDateInfo(currentDateString) : displayItem.date)}>Save</Button>
                              <Button id={DecisionModalIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => HandleCancelEdit()}>Cancel</Button>
                            </div>
                          }
                          {
                            !isEdit &&
                            <div className="flex w-full justify-between">
                              <button id={DecisionModalIds.editButton} className={submitButtonStyle} onClick={() => EnterEditMode(displayItem.id, selectedInitiative, false)}>Edit</button>
                              <button id={DecisionModalIds.deleteButton} className={cancelButtonStyle} onClick={() => HandleAttemptDelete(displayItem.id)}>Delete</button>
                            </div>
                          }
                        </StyledCardActions>
                      </StyledCard>
                    </Item>
                  </Grid>
                )
              })}
            </Grid>
          </div>
          {
            selectedInitiative.decisions.length === 0 && <div className="m-2 p-2">No decisions to display.</div>
          }
        </Dialog>
        <DeleteDecisionAlert isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} DeleteDecision={DeleteDecision} CancelDelete={CancelDelete} decision={decisionToEdit}/>
      </>
  );
}