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

interface DecisionDataProps {
    title: string
    company: Company
    initiative: Initiative 
    isOpen: boolean
    setDecisionPageIsOpen: (value: boolean) => void
}

export default function DecisionDataPage(props: DecisionDataProps) {
  
    
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
      <Dialog
      open={props.isOpen}
      onClose={()=>props.setDecisionPageIsOpen(false)}
      >
        <div>
          <h2>{props.company.name}</h2>
          <h3>{props.initiative.title}</h3>
        </div>
          <div style={{margin: '25%'}}>
            {
              props.initiative.decisions.map((displayItem) => {
              return(
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid xs={6}>
              <Card sx={{ maxWidth: 600 }} variant='outlined'>
                <CardContent>
                  <Typography variant="h5">{displayItem.description}</Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="body1">{displayItem.resolution}</Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="body1">{displayItem.participants}</Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="body2">{displayItem.date.month + "/" + displayItem.date.day + "/" + displayItem.date.year}</Typography>
                </CardContent>
                <CardActions>
                  <Button>share</Button>
                </CardActions>
              </Card>
          </Grid>
          </Grid>
            )})}
      </div>
    </Dialog>
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