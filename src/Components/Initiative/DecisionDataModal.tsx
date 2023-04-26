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
import { BoxStyle } from "../../Styles";
import Input from "@mui/material/Input";

interface DecisionDataProps {
    company: Company
    initiative: Initiative 
    index: number
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
      <Modal
      open={props.isOpen}
      onClose={()=>props.setDecisionPageIsOpen(false)}
      >
          <div style={{margin: '25%'}}>
            <Box className={classes.root}>
              {
            props.initiative.decisions.map((displayItem,index) => {
              return(
              <Card sx={{ maxWidth: 600 }} variant='outlined'>
                <CardContent>
                  <Typography variant="h3">{displayItem.description}</Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="h3">{displayItem.resolution}</Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="h3">{displayItem.participants}</Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="h3">{displayItem.date.month + "/" + displayItem.date.day + "/" + displayItem.date.year}</Typography>
                </CardContent>
                <CardActions>
                  <Button>share</Button>
                </CardActions>
              </Card>
            )})}
            </Box>
      </div>
    </Modal>
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