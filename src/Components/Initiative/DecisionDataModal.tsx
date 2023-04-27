import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import { Company, Initiative } from "../../Store/CompanySlice";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { Fragment, useEffect, useState } from "react";
import { cancelButtonStyle } from "../../Styles";
import { DateInfo, DecisionData } from "../../Services/CompanyService";
import TextField from "@mui/material/TextField";
import { MakeDateString } from "../DateInput";
import { Card, CardContent } from "@mui/material";

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

  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
  
  useEffect(() => {
    setSelectedInitiative(props.initiative);
  },[props.isOpen])

  function EditDecision(key: number, newDescription: string, newResolution: string, newParticipants: string[], newDate: DateInfo) {
    let selectedInitiativeClone:Initiative = JSON.parse(JSON.stringify(selectedInitiative));

    selectedInitiativeClone.decisions[key].description = newDescription;
    selectedInitiativeClone.decisions[key].resolution = newResolution;
    selectedInitiativeClone.decisions[key].participants = newParticipants;
    selectedInitiativeClone.decisions[key].date = newDate;

    setSelectedInitiative(selectedInitiativeClone);
  }

  return (
    <Fragment>
    <CssBaseline />
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
            <Grid container spacing={3}>
              {
              selectedInitiative.decisions.map((displayItem, key) => {
              return(
                <Grid item key={key}>
                  <Paper>
                    <Card>
                      <CardContent>
                        <TextField className="m-10" label="Decision Description" defaultValue={displayItem.description}/>
                        <TextField label="Resolution" defaultValue={displayItem.resolution}/>
                        <TextField label="Participants" defaultValue={displayItem.participants}/>
                        <TextField label="Date Resolved" type="date" defaultValue={MakeDateString(displayItem.date)}/>
                        <CardActions>
                          <Button>Share</Button>
                          <Button onClick={() => EditDecision(key, displayItem.description, displayItem.resolution, displayItem.participants, displayItem.date)}>
                            Submit Changes
                          </Button>
                        </CardActions>
                    </CardContent>
                    </Card>
                  </Paper>
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
    </Fragment>
  );
}