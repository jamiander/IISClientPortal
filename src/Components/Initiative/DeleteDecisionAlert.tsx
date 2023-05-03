import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { cancelButtonStyle, submitButtonStyle } from "../../Styles";
import { DecisionData } from "../../Services/CompanyService";
import { v4 as UuidV4 } from "uuid";

export const DeleteDecisionAlertIds = {
  confirmButton: "deleteDecisionAlertConfirmButton",
  cancelButton: "deleteDecisionAlertCancelButton"
}

interface DeleteDecisionAlertProps {
  isOpen: boolean,
  setIsOpen: (value: boolean) => void,
  DeleteDecision: (id: string) => void,
  decision: DecisionData | undefined
}

export function DeleteDecisionAlert(props: DeleteDecisionAlertProps)
{
  let myUuid = UuidV4();

  return (
    <Dialog
    open={props.isOpen}
    onClose={()=>props.setIsOpen(false)}
    
    maxWidth={false}
    >
      <DialogTitle>
        Delete this decision?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Once removed, a decision cannot be recovered.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <div className="flex justify-between">
          <button id={DeleteDecisionAlertIds.confirmButton} className={submitButtonStyle} onClick={() => props.DeleteDecision(props.decision?.id ?? myUuid)}>Yes</button>
          <button id={DeleteDecisionAlertIds.cancelButton} className={cancelButtonStyle} onClick={() => props.setIsOpen(false)}>No</button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

