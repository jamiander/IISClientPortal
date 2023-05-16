import { Company } from "../../Store/CompanySlice"
import { User } from "../../Store/UserSlice"
import { Fragment, useEffect, useState } from "react"
import { AdminEditInitiativesList } from "./AdminEditInitiativesList"
import { Dialog } from "@mui/material"
import { cancelButtonStyle, submitButtonStyle } from "../../Styles"

export const EditUserInitiativesIds = {
  modal: "editUserInitiativesModal",
  saveChangesButton: "editUserInitiativesSaveButton",
  cancelChangesButton: "editUserInitiativesCancelButton"
}

interface EditUserInitiativesModalProps {
  user: User
  allCompanies: Company[]
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  SubmitUserData: (user: User) => boolean
}

export function EditUserInitiativesModal(props: EditUserInitiativesModalProps)
{
  const [initiativeIds, setInitiativeIds] = useState<string[]>([]);

  useEffect(() => {
    if(props.isOpen)
      setInitiativeIds(props.user.initiativeIds);
  },[props.isOpen])

  function UpdateInitiativeIds(initId: string, checked: boolean)
  {
    let initiativesClone: string[] = JSON.parse(JSON.stringify(initiativeIds));
    let matchingIdIndex = initiativesClone.findIndex(id => id === initId);
    if(matchingIdIndex > -1)
    {
      if(!checked)
        initiativesClone.splice(matchingIdIndex,1);
    }
    else
    {
      if(checked)
        initiativesClone.push(initId);
    }
    setInitiativeIds(initiativesClone);
  }

  function CancelEdit()
  {
    props.setIsOpen(false);
  }

  function SaveEdit()
  {
    let userClone: User = JSON.parse(JSON.stringify(props.user));
    if(userClone)
    {
      userClone.initiativeIds = initiativeIds;

      let successfulSubmit = props.SubmitUserData(userClone);
      if(successfulSubmit)
        props.setIsOpen(false);
    }
  }

  return (
    <>
      <Dialog
        id={EditUserInitiativesIds.modal}
        open={props.isOpen}
        onClose={() => props.setIsOpen(false)}
        fullWidth
        maxWidth={"sm"}
      >
        <div className="m-2 space-y-2">
          <p className="text-2xl w-full">Edit Selected Initiatives for {props.user.name ? props.user.name : props.user.email}</p>
          <p className="text-4sm w-full">Select Company to View Initiatives</p>

        {
          props.allCompanies.map((company,index) => {
            return (
              <Fragment key={index}>
                <AdminEditInitiativesList company={company} initiativeIds={initiativeIds} updateInitiativeIds={UpdateInitiativeIds} editable={true} />
              </Fragment>
            )
          })
        }
          <div className="flex w-full justify-between">
            <button id={EditUserInitiativesIds.saveChangesButton} className={submitButtonStyle} onClick={() => SaveEdit()}>Save</button>
            <button id={EditUserInitiativesIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => CancelEdit()}>Cancel</button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
