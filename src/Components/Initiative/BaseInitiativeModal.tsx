import { Dialog, IconButton } from "@mui/material";
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
  company?: Company
  initiative?: Initiative
}


export function BaseInitiativeModal(props: BaseInitiativeModalProps)
{
  return (
    <Dialog
      open={props.open}
      onClose={() => props.onClose()}
      fullWidth
      maxWidth={false}
      data-cy={props.cypressData.modal}
    >
      <div className="flex col-span-4 bg-[#69D5C3] rounded-md py-6 px-5">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl font-bold w-full">{props.company?.name}</p>
            <p className="text-3xl w-full">{props.initiative?.title}</p>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex justify-end">
              <IconButton data-cy={props.cypressData.closeModalButton} onClick={() => props.onClose()}>
                <CloseIcon/>
              </IconButton>
            </div>
            
          </div>
        </div>
      </div>
      <div className="m-2">
        {props.children}
      </div>
    </Dialog>
  )
}
