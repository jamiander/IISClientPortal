import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Dialog from "@mui/material/Dialog";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Company, Initiative, selectAllCompanies } from "../../Store/CompanySlice";
//import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { Fragment, useEffect, useState } from "react";
import { Theme, createStyles, makeStyles, TextField } from "@mui/material";
import { DecisionData } from "../../Services/CompanyService";
import React from "react";

export const DecisionModalIds = {
  addButton: "decisionModalAddButton",
  closeButton: "decisionModalCloseButton"
}

interface DecisionDataProps {
    title: string
    company: Company
    initiative: Initiative 
    isOpen: boolean
    setDecisionModalIsOpen: (value: boolean) => void
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

  function Submit(decisions: DecisionData[])
  {

  }

  function EditDescription(key: number, newDescription: string) {
    let selectedInitiativeClone:Initiative = JSON.parse(JSON.stringify(selectedInitiative));

    let index = selectedInitiativeClone.decisions.findIndex(d => d.id === key);
    if(index !== -1) {
      selectedInitiativeClone.decisions[index].description = newDescription;
      setSelectedInitiative(selectedInitiativeClone);
    }
  }

  return (
    <Fragment>
    <CssBaseline />
        <Dialog
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
                        autoFocus={false}
                        defaultValue={displayItem.description}
                        onChange={event => EditDescription(displayItem.id, event.target.value)}
                       />
                      <Typography variant="body1">{displayItem.resolution}</Typography>
                      <Typography variant="body1">{displayItem.participants}</Typography>
                      <Typography variant="body2">{displayItem.date.month + "/" + displayItem.date.day + "/" + displayItem.date.year}</Typography>
                    </Item>
                    <CardActions>
                      <Button>share</Button>
                    </CardActions>
                  </Grid>
              )})}
            </Grid>
          </div>
        </Dialog>
    </Fragment>
  );
}