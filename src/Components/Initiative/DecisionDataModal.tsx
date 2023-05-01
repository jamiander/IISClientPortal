import Dialog from "@mui/material/Dialog";
import { Company, Initiative, deleteDecisionData, upsertDecisionData } from "../../Store/CompanySlice";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, StyledTextarea, cancelButtonStyle, genericButtonStyle, submitButtonStyle, yellowButtonStyle, labelStyle, inputStyle } from "../../Styles";
import { DateInfo, DecisionData } from "../../Services/CompanyService";
import { Button } from "@mui/material";
import { MakeDateInfo, MakeDateString } from "../DateInput";
import { ValidateDecisions, ValidationFailedPrefix } from "../../Services/Validation";
import { useOutletContext } from "react-router-dom";
import { useAppDispatch } from "../../Store/Hooks";
import { DeleteDecisionAlert } from "./DeleteDecisionAlert";
import { enqueueSnackbar } from "notistack";
import CloseIcon from '@mui/icons-material/Close';

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
    const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();
    const [currentDescription, setCurrentDescription] = useState("");
    const [currentResolution, setCurrentResolution] = useState("");
    const [currentParticipants, setCurrentParticipants] = useState("");
    const [currentDateString, setCurrentDateString] = useState("");
  
    const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
    const [decisionToEdit, setDecisionToEdit] = useState<DecisionData>();
    const [isNew, setIsNew] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [decisionToDelete, setDecisionToDelete] = useState<DecisionData>();
    const InEditMode = () => decisionToEdit !== undefined;

    const [searchedKeyword, setSearchedKeyword] = useState("");

  useEffect(() => {
    setSelectedInitiative(props.initiative);
    LeaveEditMode();
  },[props.isOpen])

  function AddEmptyDecision()
  {
    let initiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
    let decisionIds = initiativeClone.decisions.map(d => d.id);
    let negativeId = Math.min(...decisionIds,-1) - 1;
    let newDecision: DecisionData = {id: negativeId, description: "", resolution: "", participants: [], date: MakeDateInfo("2023-04-27")};
    initiativeClone.decisions.push(newDecision);

    setSearchedKeyword("");
    setSelectedInitiative(initiativeClone);
    setIsNew(true);
    EnterEditMode(negativeId,initiativeClone);
  }

  function EnterEditMode(id: number, currentInitiative: Initiative)
  {
    let currentDecision = currentInitiative.decisions.find(d => d.id === id);
    if(currentDecision)
    {
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
    setIsNew(false);
  }

  function CancelEdit()
  {
    if(isNew && decisionToEdit)
    {
      let initiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
      initiativeClone.decisions = initiativeClone.decisions.filter(d => d.id !== decisionToEdit.id);

      setSelectedInitiative(initiativeClone);
    }
    LeaveEditMode();
  }

  function EditDecision(decisionId: number, newDescription: string, newResolution: string, newParticipants: string[], newDate?: DateInfo)
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

  function SubmitDecisionData(decisions: DecisionData[]): boolean
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    
    let validation = ValidateDecisions(decisions);
    if(validation.success)
    {
      dispatch(upsertDecisionData({isTest: isTest, companyId: props.company.id.toString(), initiativeId: props.initiative.id, decisions: decisions}));
      LeaveEditMode();//setViewDecisionDataIsOpen(false);
      return true;
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message)//ShowToast(ValidationFailedPrefix + validation.message,"Error");
    
    return false;
  }

  function AttemptDelete(decisionId: number)
  {
    setIsDeleteOpen(true);
    setDecisionToDelete(selectedInitiative.decisions.find(d => d.id === decisionId));
  }

  function DeleteDecision(decisionId: number)
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let selectedInitiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
    selectedInitiativeClone.decisions = selectedInitiativeClone.decisions.filter(d => d.id !== decisionId);

    dispatch(deleteDecisionData({isTest: isTest, companyId: props.company.id.toString(), initiativeId: props.initiative.id, decisionIds: [decisionId]}));
    setSelectedInitiative(selectedInitiativeClone);
    setDecisionToDelete(undefined);
    setIsDeleteOpen(false);
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
            <p className="text-5xl font-bold w-1/4">{props.company.name} : {props.initiative.title}</p>
            <button disabled={InEditMode()} id={DecisionModalIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyDecision()}>Add Decision</button>
            </div>
          </div>
          <div className="mx-[2%]">
            {selectedInitiative.decisions.length !== 0 &&
            <div className="my-2">
              <StyledTextField id={DecisionModalIds.keywordFilter} disabled={InEditMode()} label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)}/>
            </div>
            }
            <Grid container spacing={6}>
              {
              selectedInitiative.decisions.filter(d => d.description.toUpperCase().includes(searchedKeyword.toUpperCase()) || d.resolution.toUpperCase().includes(searchedKeyword.toUpperCase())).map((displayItem, key) => {
                let isEdit = (displayItem.id === (decisionToEdit?.id ?? -1));
                
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
                            <StyledTextField id={DecisionModalIds.participants} label="Participants" value={currentParticipants} onChange={e => setCurrentParticipants(e.target.value)}/>
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
                              <button id={DecisionModalIds.saveChangesButton} className={submitButtonStyle} onClick={() => EditDecision(displayItem.id, currentDescription, currentResolution, currentParticipants.split(", "), currentDateString ? MakeDateInfo(currentDateString) : displayItem.date)}>Save</button>
                              <button id={DecisionModalIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => CancelEdit()}>Cancel</button>
                            </div>
                          }
                          {
                            !isEdit && !InEditMode() &&
                            <div className="flex w-full justify-between">
                              <button id={DecisionModalIds.editButton} className={submitButtonStyle} onClick={() => EnterEditMode(displayItem.id, selectedInitiative)}>Edit</button>
                              <button id={DecisionModalIds.deleteButton} className={cancelButtonStyle} onClick={() => AttemptDelete(displayItem.id)}>Delete</button>
                            </div>
                          }
                        </StyledCardActions>
                      </StyledCard>
                    </Item>
                  </Grid>
                )
              })}
            </Grid>
            {
              selectedInitiative.decisions.length === 0 && <div className="p-2">No decisions to display.</div>
            }
          </div>
          <div className="h-10 w-full flex justify-between">
            <Button id={DecisionModalIds.closeModalButton} className={cancelButtonStyle} onClick={() => props.setDecisionModalIsOpen(false)}>Close</Button>
          </div>
        </Dialog>
        <DeleteDecisionAlert isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} DeleteDecision={DeleteDecision} decision={decisionToDelete}/>
      </>
  );
}