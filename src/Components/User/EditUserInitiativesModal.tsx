import { Company, IntegrityId } from "../../Store/CompanySlice"
import { User } from "../../Store/UserSlice"
import { Fragment, useEffect, useState } from "react"
import { AdminEditInitiativesList } from "./AdminEditInitiativesList"
import { Button, Dialog } from "@mui/material"
import { cancelButtonStyle, submitButtonStyle } from "../../Styles"
import { MakeClone } from "../../Services/Cloning"
import { BaseInitiativeModal } from "../Initiative/BaseInitiativeModal"

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
      <BaseInitiativeModal
        cypressData={{modal: EditUserInitiativesIds.modal, closeModalButton: EditUserInitiativesIds.cancelChangesButton }}
        open={props.isOpen}
        onClose={() => props.setIsOpen(false)}
        maxWidth={"sm"}
        title={`Selected Initiatives for ${props.user?.name ? props.user?.name : props.user?.email}`}
        subtitle={`Select Company to View Initiatives`}
      >
        <div className="m-2 space-y-2 rounded-md bg-[#E4E1E5]">
          <p className="text-center text-3xl w-full text-[#445362]"></p>
          <p className="text-center text-lg w-full text-[#445362] mt-2"></p>
          {
            props.allCompanies.map((company,index) => {
              return (
                <Fragment key={index}>
                  <AdminEditInitiativesList company={company} initiativeIds={initiativeIds} updateInitiativeIds={UpdateInitiativeIds} editable={true} expanded={props.expanded} user={props.user}/>
                </Fragment>
              )
            })
          }
        </div>
        <div className="flex w-full justify-end py-1">
          <Button variant="contained" data-cy={EditUserInitiativesIds.saveChangesButton} onClick={() => SaveEdit()}>Save</Button>
        </div>
      </BaseInitiativeModal>
    </>
  )
}
