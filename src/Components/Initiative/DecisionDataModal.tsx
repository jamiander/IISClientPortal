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
              props.initiative.decisions.map((displayItem) => {
              return(
                  <Grid item md={4}>
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
            </Grid>
          </div>
        </Dialog>
    </Fragment>
  );
}