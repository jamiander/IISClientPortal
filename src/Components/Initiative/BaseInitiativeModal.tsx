import { Breakpoint, Button, Container, Dialog, DialogTitle, Grid, IconButton, Paper, Typography } from "@mui/material";
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
  maxWidth?: false | Breakpoint | undefined
  saveButton?: {
    cypressData: string
    saveFunction: () => void
  }
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
              <Grid item xs={9}>
                <Grid container direction="column" alignItems="center">
                  <Grid item>
                    <Typography textAlign="center" variant="h5">{props.title}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography textAlign="center" variant="body1">{props.subtitle}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} zeroMinWidth>
                {props.saveButton &&
                  <Button sx={{
                    position: "absolute",
                    right: 8,
                    top: 8
                  }} variant="contained" data-cy={props.saveButton?.cypressData} onClick={() => props.saveButton?.saveFunction()}>Save</Button>
                }
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
