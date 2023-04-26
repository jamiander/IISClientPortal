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
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { Fragment } from "react";

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
   
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(3),
      },
    },
  })
);
  const classes = useStyles();

  return (
    <Fragment>
    <CssBaseline />
    <Container>
      <Box>
        <Dialog
        open={props.isOpen}
        onClose={()=>props.setDecisionModalIsOpen(false)}
        >
          <div>
            <h2>{props.company.name}</h2>
            <h3>{props.initiative.title}</h3>
          </div>
          <div style={{margin: '25%'}}>
            {
              props.initiative.decisions.map((displayItem) => {
              return(
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Item>
                      <Typography variant="h5">{displayItem.description}</Typography>
                    </Item>
                    <Item>
                      <Typography variant="body1">{displayItem.resolution}</Typography>
                    </Item>
                    <Item>
                      <Typography variant="body1">{displayItem.participants}</Typography>
                    </Item>
                    <Item>
                      <Typography variant="body2">{displayItem.date.month + "/" + displayItem.date.day + "/" + displayItem.date.year}</Typography>
                    </Item>
                    <CardActions>
                      <Button>share</Button>
                    </CardActions>
                  </Grid>
                </Grid>
            )})}
          </div>
        </Dialog>
      </Box>
    </Container>
    </Fragment>
  );


        {/* <Card sx={{ maxWidth: 1000 }} variant='outlined'>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Dragon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Large green monster that breathes fire
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
        </div>
        </Modal>
      ); */}
}