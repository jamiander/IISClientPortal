import { Company, IntegrityId } from "../../Store/CompanySlice"
import { User } from "../../Store/UserSlice"
import { Fragment, useEffect, useState } from "react"
import { AdminEditInitiativesList } from "./AdminEditInitiativesList"
import { Dialog } from "@mui/material"
import { cancelButtonStyle, submitButtonStyle } from "../../Styles"
import { MakeClone } from "../../Services/Cloning"

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
  expanded: boolean
}

export function EditUserInitiativesModal(props: EditUserInitiativesModalProps)
{
  const [initiativeIds, setInitiativeIds] = useState<string[]>([]);
  const [companyId, setCompanyId] = useState<string>("");

  useEffect(() => {
    if(props.isOpen)
    {
      setInitiativeIds(props.user.initiativeIds);
      setCompanyId(props.user.companyId)
    }
  },[props.isOpen])

  function UpdateInitiativeIds(initId: string, checked: boolean)
  {
    let initiativesClone = MakeClone(initiativeIds);
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
    let userClone = MakeClone(props.user);
    if(userClone)
    {
      userClone.initiativeIds = initiativeIds;
      userClone.companyId = companyId;
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
        <div className="m-2 space-y-2 rounded-md bg-[#E4E1E5]">
          <p className="text-center text-3xl w-full text-[#445362]">Selected Initiatives for {props.user?.name ? props.user?.name : props.user?.email}</p>
          <p className="text-center text-lg w-full text-[#445362] mt-2">Select Company to View Initiatives</p>

        {
          props.allCompanies.map((company,index) => {
            return (
              <Fragment key={index}>
                <AdminEditInitiativesList company={company} initiativeIds={initiativeIds} updateInitiativeIds={UpdateInitiativeIds} editable={true} expanded={props.expanded} user={props.user}/>
              </Fragment>
            )
          })
        }
          <div className="flex w-full justify-between py-1">
            <button id={EditUserInitiativesIds.saveChangesButton} className={submitButtonStyle} onClick={() => SaveEdit()}>Save</button>
            <button id={EditUserInitiativesIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => CancelEdit()}>Cancel</button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
