import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import { Company, Initiative, updateDecisionData } from "../../Store/CompanySlice";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { Fragment, RefObject, createRef, useEffect, useRef, useState } from "react";
import { Item, StyledCard, StyledCardContent, StyledTextField, StyledTextarea, cancelButtonStyle, submitButtonStyle } from "../../Styles";
import { DateInfo, DecisionData } from "../../Services/CompanyService";
import TextField from "@mui/material/TextField";
import { Card, CardContent } from "@mui/material";
import { MakeDateInfo, MakeDateString } from "../DateInput";
import AddIcon from '@mui/icons-material/Add';
import { ValidateDecisions, ValidationFailedPrefix } from "../../Services/Validation";
import { useOutletContext } from "react-router-dom";
import { useAppDispatch } from "../../Store/Hooks";

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
          <div className="flex justify-between">
            <h1><strong>{props.company.name}    {selectedInitiative.title}</strong></h1>
            <button id={DecisionModalIds.addButton} onClick={() => AddEmptyDecision()}><AddIcon /></button>
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
                          <StyledTextarea value={currentDescription} onChange={e => setCurrentDescription(e.target.value)}/>
                          <StyledTextarea value={currentResolution} onChange={e => setCurrentResolution(e.target.value)}/>
                          <StyledTextField value={currentParticipants} onChange={e => setCurrentParticipants(e.target.value)}/>
                          <StyledTextField type="date" value={currentDateString} onChange={e => setCurrentDateString(e.target.value)}/>
                        </>
                        :
                        <>
                          <StyledTextarea disabled value={displayItem.description}/>
                          <StyledTextarea disabled value={displayItem.resolution}/>
                          <StyledTextField disabled value={displayItem.participants.join(", ")}/>
                          <StyledTextField disabled type="date" value={MakeDateString(displayItem.date)}/>
                        </>
                        }
                      </StyledCardContent>
                      <CardActions>
                        {isEdit &&
                          <div className="flex w-full justify-between">
                            <button className={submitButtonStyle} onClick={() => EditDecision(key, currentDescription, currentResolution, currentParticipants.split(", "), currentDateString ? MakeDateInfo(currentDateString) : displayItem.date)}>Save</button>
                            <button className={cancelButtonStyle} onClick={() => CancelEdit()}>Cancel</button>
                          </div>
                        }
                        {
                          !isEdit && editIndex === -1 &&
                          <div className="flex w-full justify-start">
                            <button className={submitButtonStyle} onClick={() => EnterEditMode(key, selectedInitiative)}>Edit</button>
                          </div>
                        }
                      </CardActions>
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
            <button id={DecisionModalIds.closeButton} className={cancelButtonStyle} onClick={() => props.setDecisionModalIsOpen(false)}>Close</button>
          </div>
        </Dialog>
  );
}