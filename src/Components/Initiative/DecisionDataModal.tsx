import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { Company, Initiative } from "../../Store/CompanySlice";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { Fragment, useEffect, useState } from "react";
import { cancelButtonStyle, submitButtonStyle } from "../../Styles";
import { DecisionData } from "../../Services/CompanyService";
import TextField from "@mui/material/TextField";

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

export default function DecisionDataModal(props: DecisionDataProps) {
  
  const Item = styled(Paper)(() => ({
    backgroundColor: '#98d6a9',
    padding: 8,
    textAlign: 'center',
    color: 'black',
    elevation: 5
  }));

  const [description, setDescription] = useState("");
  const [isDescriptionFocused, setDescriptionFocused] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);

  useEffect(() => {
    setSelectedInitiative(props.initiative);
  },[props.isOpen])

  function EditDescription(key: number, newDescription: string) {
    let selectedInitiativeClone:Initiative = JSON.parse(JSON.stringify(selectedInitiative));

    selectedInitiativeClone.decisions[key].description = newDescription;
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
            <Grid container spacing={4}>
              {
              selectedInitiative.decisions.map((displayItem, key) => {
              return(
                <Grid item md={4} key={key}>
                  <Item>
                    <TextField
                      defaultValue={displayItem.description}>
                      </TextField>
                    <Typography variant="body1">{displayItem.resolution}</Typography>
                    <Typography variant="body1">{displayItem.participants}</Typography>
                    <Typography variant="body2">{displayItem.date.month + "/" + displayItem.date.day + "/" + displayItem.date.year}</Typography>
                    <CardActions>
                      <Button>Share</Button>
                      <button onClick={() => EditDescription(key, displayItem.description)}>Enter Changes
                      </button>
                    </CardActions>
                  </Item>
                </Grid>
              )})}
              {
                selectedInitiative.decisions.length === 0 && "No decisions to display."
              }
            </Grid>
          </div>
          <div className="h-10 w-full flex justify-between">
            <button id={DecisionModalIds.submitButton} className={submitButtonStyle} onClick={() => props.Submit(props.initiative.decisions)}>Save</button>
            <button id={DecisionModalIds.closeButton} className={cancelButtonStyle} onClick={() => props.setDecisionModalIsOpen(false)}>Close</button>
          </div>
        </Dialog>
    </Fragment>
  );
}