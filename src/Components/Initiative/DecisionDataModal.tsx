import Dialog from "@mui/material/Dialog";
import { Company, Initiative } from "../../Store/CompanySlice";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, StyledTextarea, cancelButtonStyle, genericButtonStyle, submitButtonStyle, yellowButtonStyle } from "../../Styles";
import { DateInfo, DecisionData } from "../../Services/CompanyService";
import { Button } from "@mui/material";
import { MakeDateInfo, MakeDateString } from "../DateInput";

export const DecisionModalIds = {
  modal: "decisionModal",
  addButton: "decisionModalAddButton",
  submitButton: "decisionModalSubmitButton",
  closeButton: "decisionModalCloseButton",
}

interface DecisionDataProps {
    title: string
    company: Company
    initiative: Initiative 
    isOpen: boolean
    setDecisionModalIsOpen: (value: boolean) => void
    Submit: (decisions: DecisionData[]) => void
}

  export default function DecisionDataModal(props: DecisionDataProps) {
    const [currentDescription, setCurrentDescription] = useState("");
    const [currentResolution, setCurrentResolution] = useState("");
    const [currentParticipants, setCurrentParticipants] = useState("");
    const [currentDateString, setCurrentDateString] = useState("");
  
    const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
    const [editIndex, setEditIndex] = useState(-1);

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
  }

  function EditDecision(key: number, newDescription: string, newResolution: string, newParticipants: string[], newDate?: DateInfo) {
    let selectedInitiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
    let newDecision = selectedInitiativeClone.decisions[key];
    
    newDecision.description = newDescription;
    newDecision.resolution = newResolution;
    newDecision.participants = newParticipants;
    if(newDate)
      newDecision.date = newDate;

    setSelectedInitiative(selectedInitiativeClone);

    LeaveEditMode();
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
            <button className={yellowButtonStyle} onClick={() => AddEmptyDecision()}>Add Decision</button>
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
                          <StyledTextarea value={currentDescription} onChange={e => setCurrentDescription(e.target.value)}/>
                        <h1>Resolution</h1>
                          <StyledTextarea value={currentResolution} onChange={e => setCurrentResolution(e.target.value)}/>
                          <StyledTextField size="medium" label="Participants" value={currentParticipants} onChange={e => setCurrentParticipants(e.target.value)}/>
                          <StyledTextField size="medium" label="Date Resolved" type="date" value={currentDateString} onChange={e => setCurrentDateString(e.target.value)}/>
                        </>
                        :
                        <>
                          <StyledTextarea disabled value={displayItem.description}/>
                          <StyledTextarea disabled value={displayItem.resolution}/>
                          <StyledTextField label="Participants" disabled value={displayItem.participants.join(", ")}/>
                          <StyledTextField label="Date Resolved" disabled type="date" value={MakeDateString(displayItem.date)}/>
                        </>
                        }
                      </StyledCardContent>
                      <StyledCardActions>
                        {isEdit &&
                          <div className="flex w-full justify-between">
                            <button className={submitButtonStyle} onClick={() => EditDecision(key, currentDescription, currentResolution, currentParticipants.split(", "), currentDateString ? MakeDateInfo(currentDateString) : displayItem.date)}>Save</button>
                            <button className={cancelButtonStyle} onClick={() => LeaveEditMode()}>Cancel</button>
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
            <Button id={DecisionModalIds.closeButton} className={cancelButtonStyle} onClick={() => props.setDecisionModalIsOpen(false)}>Close</Button>
          </div>
        </Dialog>
  );
}