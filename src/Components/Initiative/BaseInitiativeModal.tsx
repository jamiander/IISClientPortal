import { Breakpoint, Container, Dialog, DialogTitle, Grid, IconButton, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";
import { Company, Initiative } from "../../Store/CompanySlice";
import CloseIcon from '@mui/icons-material/Close';

interface BaseInitiativeModalProps {
  children: ReactNode
  open: boolean
  onClose: () => void
  cypressData: {
    modal: string
    closeModalButton: string
  }
  title?: string
  subtitle?: string
  company?: Company
  initiative?: Initiative
  maxWidth?: false | Breakpoint | undefined
}


export function BaseInitiativeModal(props: BaseInitiativeModalProps)
{
  return (
    <Container>
      <Dialog
        open={props.open}
        onClose={() => props.onClose()}
        fullWidth
        maxWidth={props.maxWidth}
        data-cy={props.cypressData.modal}
        sx={{}}
      >
        <Paper sx={{backgroundColor: "#E4E1E5"}} elevation={3}>
          <DialogTitle sx={{width: "100%"}}>
            <Grid container display="flex" columns={12} alignItems="center" justifyContent="space-between" wrap="nowrap">
              <Grid item xs={3}>
                {/* nothing; used to center the title */}
              </Grid>
              <Grid item xs="auto">
                <Grid container direction="column" justifyContent="center" alignItems="center">
                  <Grid item>
                    <Typography variant="h5">{props.title}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">{props.subtitle}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} zeroMinWidth>
                <div className="ml-2">
                  <Typography noWrap variant="h6" className="text-5xl font-bold w-full">{props.company?.name}</Typography>
                  <Typography noWrap variant="body1" className="text-3xl w-full">{props.initiative?.title}</Typography>
                </div>
              </Grid>
            </Grid>
            <IconButton data-cy={props.cypressData.closeModalButton} onClick={() => props.onClose()}
              sx={{
                position: "absolute",
                left: 8,
                top: 8
              }}>
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
        </Paper>
        <Container className="m-4" maxWidth={props.maxWidth}>
          {props.children}
        </Container>
      </Dialog>
    </Container>
  )
}
