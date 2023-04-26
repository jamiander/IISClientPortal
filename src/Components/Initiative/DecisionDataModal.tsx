import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { Company, Initiative } from "../../Store/CompanySlice";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { Fragment } from "react";
import { cancelButtonStyle, submitButtonStyle } from "../../Styles";
import { DecisionData } from "../../Services/CompanyService";

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
  }));
   
  const styles = {
    root: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        
      },
    },
  };

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
            <h2>{props.company.name}</h2>
            <h3>{props.initiative.title}</h3>
          </div>
          <div style={{margin: '5%'}}>
            <Grid container spacing={4}>
              {
              props.initiative.decisions.map((displayItem,index) => {
              return(
                <Grid item md={4} key={index}>
                  <Item>
                    <Typography variant="h5">{displayItem.description}</Typography>
                    <Typography variant="body1">{displayItem.resolution}</Typography>
                    <Typography variant="body1">{displayItem.participants}</Typography>
                    <Typography variant="body2">{displayItem.date.month + "/" + displayItem.date.day + "/" + displayItem.date.year}</Typography>
                    <CardActions>
                      <Button>share</Button>
                    </CardActions>
                  </Item>
                </Grid>
              )})}
              {
                props.initiative.decisions.length === 0 && "No decisions to display."
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