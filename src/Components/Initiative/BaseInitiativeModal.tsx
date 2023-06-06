import { Breakpoint, Container, Dialog, DialogTitle, Grid, IconButton, Typography } from "@mui/material";
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
        <div className="flex col-span-4 bg-[#69D5C3]">
          <DialogTitle sx={{width: "100%"}}>
            <Grid container display="flex" columns={12} alignItems="center" justifyContent="space-between" wrap="nowrap">
              <Grid item xs={3} zeroMinWidth>
                <Typography noWrap variant="h6" className="text-5xl font-bold w-full">{props.company?.name}</Typography>
                <Typography noWrap variant="body1" className="text-3xl w-full">{props.initiative?.title}</Typography>
              </Grid>
              <Grid item xs="auto">
                <Typography variant="h5">{props.title}</Typography>
              </Grid>
              <Grid item xs={3}>
                {/* nothing */}
              </Grid>
            </Grid>
            <IconButton data-cy={props.cypressData.closeModalButton} onClick={() => props.onClose()}
              sx={{
                position: "absolute",
                right: 8,
                top: 8
              }}>
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
        </div>
        <Container className="m-4" maxWidth={props.maxWidth}>
          {props.children}
        </Container>
      </Dialog>
    </Container>
  )
}
