import Dialog from "@mui/material/Dialog";
import { Company, Initiative, updateDecisionData } from "../../Store/CompanySlice";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, StyledTextarea, cancelButtonStyle, genericButtonStyle, submitButtonStyle, yellowButtonStyle, labelStyle } from "../../Styles";
import { DateInfo, DecisionData } from "../../Services/CompanyService";
import { Button } from "@mui/material";
import { MakeDateInfo, MakeDateString } from "../DateInput";
import { ValidateDecisions, ValidationFailedPrefix } from "../../Services/Validation";
import { useOutletContext } from "react-router-dom";
import { useAppDispatch } from "../../Store/Hooks";

export const DecisionModalIds = {
  modal: "decisionModal",
  addButton: "decisionModalAddButton",
  closeModalButton: "decisionModalCloseModalButton",
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
    const [editIndex, setEditIndex] = useState(-1);
    const [isNew, setIsNew] = useState(false);

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

    setSelectedInitiative(initiativeClone);
    setIsNew(true);
    EnterEditMode(initiativeClone.decisions.length-1,initiativeClone);
  }

  function EnterEditMode(index: number, currentInitiative: Initiative)
  {
    setEditIndex(index);
    let currentDecision = currentInitiative.decisions[index];
    setCurrentDescription(currentDecision.description);
    setCurrentResolution(currentDecision.resolution);
    setCurrentParticipants(currentDecision.participants.join(", "));
    setCurrentDateString(MakeDateString(currentDecision.date));
  }

  function LeaveEditMode()
  {
    setEditIndex(-1);
    setIsNew(false);
  }

  function CancelEdit()
  {
    if(isNew)
    {
      let initiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
      initiativeClone.decisions.splice(editIndex,1);

      setSelectedInitiative(initiativeClone);
    }
    LeaveEditMode();
  }

  function EditDecision(key: number, newDescription: string, newResolution: string, newParticipants: string[], newDate?: DateInfo)
  {
    let selectedInitiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
    let newDecision = selectedInitiativeClone.decisions[key];
    
    newDecision.description = newDescription;
    newDecision.resolution = newResolution;
    newDecision.participants = newParticipants;
    if(newDate)
      newDecision.date = newDate;

    let successfulSubmit = SubmitDecisionData(selectedInitiativeClone.decisions);
    if(successfulSubmit)
      setSelectedInitiative(selectedInitiativeClone);
    else
      setSelectedInitiative(selectedInitiative);
  }

  function SubmitDecisionData(decisions: DecisionData[]): boolean
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    
    let validation = ValidateDecisions(decisions);
    if(validation.success)
    {
      dispatch(updateDecisionData({isTest: isTest, companyId: props.company.id.toString(), initiativeId: props.initiative.id, decisions: decisions}));
      LeaveEditMode();//setViewDecisionDataIsOpen(false);
      return true;
    }
    else
      ShowToast(ValidationFailedPrefix + validation.message,"Error");
    
    return false;
  }

  return (
      <Dialog
        id={DecisionModalIds.modal}
        open={props.isOpen}
        onClose={()=>props.setDecisionModalIsOpen(false)}
        fullWidth
        maxWidth={false}
        >
          <div className="flex col-span-4 mb-4 bg-[#2ed7c3] rounded-md py-6 px-5">
            <div className="w-full flex justify-between">
            <p className="text-5xl font-bold w-1/4">{props.company.name} : {props.initiative.title}</p>
            <button disabled={editIndex !== -1} id={DecisionModalIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyDecision()}>Add Decision</button>
            </div>
          </div>
          <div style={{margin: '2%'}}>
            <Grid container spacing={6}>
              {
              selectedInitiative.decisions.map((displayItem, key) => {
                let isEdit = (key === editIndex);
                
              return(
                <Grid item md={4} key={key}>
                  <Item>
                    <StyledCard>
                      <StyledCardContent>
                        {isEdit ?
                        <>
                        <h1>Decision Description</h1>
                          <StyledTextarea id={DecisionModalIds.description} value={currentDescription} onChange={e => setCurrentDescription(e.target.value)}/>
                        <h1>Resolution</h1>
                          <StyledTextarea id={DecisionModalIds.resolution} value={currentResolution} onChange={e => setCurrentResolution(e.target.value)}/>
                          <StyledTextField id={DecisionModalIds.participants} size="medium" label="Participants" value={currentParticipants} onChange={e => setCurrentParticipants(e.target.value)}/>
                          <StyledTextField id={DecisionModalIds.date} size="medium" label="Date Resolved" type="date" value={currentDateString} onChange={e => setCurrentDateString(e.target.value)}/>
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
                            <button id={DecisionModalIds.saveChangesButton} className={submitButtonStyle} onClick={() => EditDecision(key, currentDescription, currentResolution, currentParticipants.split(", "), currentDateString ? MakeDateInfo(currentDateString) : displayItem.date)}>Save</button>
                            <button id={DecisionModalIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => CancelEdit()}>Cancel</button>
                          </div>
                        }
                        {
                          !isEdit && editIndex === -1 &&
                          <div className="flex w-full justify-start">
                            <button className={submitButtonStyle} onClick={() => EnterEditMode(key, selectedInitiative)}>Edit</button>
                          </div>
                        }
                      </StyledCardActions>
                    </StyledCard>
                  </Item>
                </Grid>
              )})}
              {
                selectedInitiative.decisions.length === 0 && "No decisions to display."
              }
            </Grid>
          </div>
          <div className="h-10 w-full flex justify-between">
            <Button id={DecisionModalIds.closeModalButton} className={cancelButtonStyle} onClick={() => props.setDecisionModalIsOpen(false)}>Close</Button>
          </div>
        </Dialog>
  );
}