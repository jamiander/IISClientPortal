import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import { Company, Initiative } from "../../Store/CompanySlice";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { cancelButtonStyle, submitButtonStyle } from "../../Styles";
import { DateInfo, DecisionData } from "../../Services/CompanyService";
import TextField from "@mui/material/TextField";
import { Card, CardContent } from "@mui/material";
import { MakeDateInfo, MakeDateString } from "../DateInput";

export const DecisionModalIds = {
  modal: "decisionModal",
  addButton: "decisionModalAddButton",
  submitButton: "decisionModalSubmitButton",
  closeButton: "decisionModalCloseButton"
}

interface DecisionDataProps {
    title: string
    company: Company
    initiative: Initiative 
    isOpen: boolean
    setDecisionModalIsOpen: (value: boolean) => void
    Submit: (decisions: DecisionData[]) => void
}

  const Item = styled(Paper)(() => ({
    backgroundColor: '#98d6a9',
    padding: 8,
    textAlign: 'center',
    color: 'black',
    elevation: 5
  }));

export default function DecisionDataModal(props: DecisionDataProps) {
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentResolution, setCurrentResolution] = useState("");
  const [currentParticipants, setCurrentParticipants] = useState("");
  const [currentDate, setCurrentDate] = useState<DateInfo>();

  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    setSelectedInitiative(props.initiative);
    setEditIndex(-1);
  },[props.isOpen])


  function EditDecision(key: number, newDescription: string, newResolution: string, newParticipants: string[], newDate?: DateInfo) {
    let selectedInitiativeClone: Initiative = JSON.parse(JSON.stringify(selectedInitiative));
    let newDecision = selectedInitiativeClone.decisions[key];
    
    newDecision.description = newDescription;
    newDecision.resolution = newResolution;
    newDecision.participants = newParticipants;
    if(newDate)
      newDecision.date = newDate;

    setSelectedInitiative(selectedInitiativeClone);
  }

  return (
      <Dialog
        id={DecisionModalIds.modal}
        open={props.isOpen}
        onClose={()=>props.setDecisionModalIsOpen(false)}
        fullWidth
        maxWidth={false}
        >
          <div>
            <h1><strong>{props.company.name}    {selectedInitiative.title}</strong></h1>
          </div>
          <div style={{margin: '5%'}}>
            <Grid container spacing={4}>
              {
              selectedInitiative.decisions.map((displayItem, key) => {
                let isEdit = (key === editIndex);
                
              return(
                <Grid item md={4} key={key}>
                  <Item>
                    <Card>
                      <CardContent>
                        <TextField value={currentDescription} onChange={e => setCurrentDescription(e.target.value)}></TextField>
                        <TextField value={currentResolution} onChange={e => setCurrentResolution(e.target.value)}></TextField>
                        <TextField value={currentParticipants} onChange={e => setCurrentParticipants(e.target.value)}></TextField>
                        <TextField type="date" value={currentDate ? MakeDateString(currentDate) : ""} onChange={e => setCurrentDate(MakeDateInfo(e.target.value))}></TextField>
                      </CardContent>
                      <CardActions>
                        {isEdit &&
                          <div className="flex w-full justify-between">
                            <button className={submitButtonStyle} onClick={() => EditDecision(key, currentDescription, currentResolution, currentParticipants.split(","), currentDate)}>Save</button>
                            <button className={cancelButtonStyle} onClick={() => setEditIndex(-1)}>Cancel</button>
                          </div>
                        }
                        {
                          !isEdit &&
                          <div className="flex w-full justify-start">
                            <button className={submitButtonStyle} onClick={() => setEditIndex(key)}>Edit</button>
                          </div>
                        }
                      </CardActions>
                    </Card>
                  </Item>
                </Grid>
              )})}
              {
                selectedInitiative.decisions.length === 0 && "No decisions to display."
              }
            </Grid>
          </div>
          <div className="h-10 w-full flex justify-between">
            <button id={DecisionModalIds.submitButton} className={submitButtonStyle} onClick={() => props.Submit(selectedInitiative.decisions)}>Save</button>
            <button id={DecisionModalIds.closeButton} className={cancelButtonStyle} onClick={() => props.setDecisionModalIsOpen(false)}>Close</button>
          </div>
        </Dialog>
  );
}