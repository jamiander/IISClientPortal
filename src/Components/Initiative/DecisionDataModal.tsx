import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Company, Initiative, selectAllCompanies } from "../../Store/CompanySlice";

interface DecisionDataProps {
    company: Company
    initiative: Initiative 
    index: number
    isOpen: boolean
    setDecisionPageIsOpen: (value: boolean) => void
}

export default function DecisionDataPage(props: DecisionDataProps) {
  
    return (
      <Modal
      open={props.isOpen}
      onClose={()=>props.setDecisionPageIsOpen(false)}
      >
        <div style={{margin: '25%'}}>
        <Card sx={{ maxWidth: 600 }} variant='outlined'>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Slimy creature that lives in the marsh
             </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
        <Card sx={{ maxWidth: 600 }} variant='outlined'>
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
      );
}