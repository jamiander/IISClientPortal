import Dialog from "@mui/material/Dialog";
import { Company } from "../../Store/CompanySlice";
import { Fragment, useState } from "react";
import { User } from "../../Store/UserSlice";
import { StyledFormGroup, StyledTextField, cancelButtonStyle, submitButtonStyle } from "../../Styles";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AdminEditInitiativesList } from "./AdminEditInitiativesList";
import {v4 as UuidV4} from "uuid";


export const AdminAddUserModalIds = {
    selectCompany: "adminAddUserSelectCompany",
    selectInitiative: "adminAddUserSelectInitiative",
    name: "adminAddUserName",
    email: "adminAddUserEmail",
    password: "adminAddUserPassword",
    phone: "adminAddUserPhone",
    isAdmin: "adminAddUserIsAdmin",
    isActive: "adminAddUserIsActive",
    saveChangesButton: "adminAddUserSave",
    cancelChangesButton: "adminAddUserCancel"
}
interface AdminAddUserProps {
    title: string
    isOpen: boolean
    companies: Company[]
    setAdminAddUserModalIsOpen: (value: boolean) => void
    Submit: (user: User) => boolean
    expanded: boolean
}
export default function AdminAddUserModal(props: AdminAddUserProps){

    const [AdminAddUserIsOpen, setEditUserDataIsOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company>();
    const [selectedInitiativeIndex, setSelectedInitiativeIndex] = useState(-1);
    const [currentName, setCurrentName] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentPhone, setCurrentPhone] = useState("");
    const [currentIsAdmin, setCurrentIsAdmin] = useState(false);
    const [currentIsActive, setCurrentIsActive] = useState(false);
    const [initiativeIds, setInitiativeIds] = useState<string[]>([]);
    const [companyId, setCompanyId] = useState<string>("");

    let myUuid = UuidV4();

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

  function UpdateCompanyId(companyId: string, checked: boolean)
  {
    if(checked)
      setCompanyId(companyId);
  }


  function CancelEdit()
  {
    props.setAdminAddUserModalIsOpen(false);
  }

  function SaveEdit()
  {
    let userClone: User = JSON.parse(JSON.stringify({id: myUuid, name: currentName, email: currentEmail, password: currentPassword, companyId: (selectedCompany?.id ?? "-1"), phoneNumber: currentPhone, isAdmin: currentIsAdmin, isActive: currentIsActive, initiativeIds: [] }));
    if(userClone)
    {
      userClone.initiativeIds = initiativeIds;
      userClone.companyId = companyId;
      let successfulSubmit = props.Submit(userClone);
      if(successfulSubmit)
        props.setAdminAddUserModalIsOpen(false);
    }
  } 

    return(
        <Dialog
        open={props.isOpen}
        onClose={() => props.setAdminAddUserModalIsOpen(false)}
        maxWidth={false}
      >
        <div className="space-y-5">
            <p className="text-3xl w-full">{props.title}</p>
                <StyledTextField id={AdminAddUserModalIds.name} label="Name" value={currentName} onChange={e => setCurrentName(e.target.value)} />
                <StyledTextField id={AdminAddUserModalIds.email} label="Email" value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} />
                <StyledTextField id={AdminAddUserModalIds.password} label="Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                <StyledTextField id={AdminAddUserModalIds.phone} label="Phone Number" value={currentPhone} onChange={e => setCurrentPhone(e.target.value)} />
                <StyledFormGroup>
                    <FormControlLabel control={<Checkbox id={AdminAddUserModalIds.isAdmin} checked={currentIsAdmin} onChange={(e) => setCurrentIsAdmin(e.target.checked)}/>} label="Admin" />
                </StyledFormGroup>
                <StyledFormGroup>
                    <FormControlLabel control={<Checkbox id={AdminAddUserModalIds.isActive} checked={currentIsActive} onChange={(e) => setCurrentIsActive(e.target.checked)}/>} label="Active" />
                </StyledFormGroup>

                {
          props.companies.map((company,index) => {
            return (
              <Fragment key={index}>
                <AdminEditInitiativesList company={company} initiativeIds={initiativeIds} updateInitiativeIds={UpdateInitiativeIds} updateCompanyId={UpdateCompanyId} editable={true} expanded={props.expanded}/>
              </Fragment>
            )
          })
        }
                <div className="flex w-full justify-between">
                <button id={AdminAddUserModalIds.saveChangesButton} className={submitButtonStyle} onClick={() => SaveEdit()}>Save</button>
                <button id={AdminAddUserModalIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => CancelEdit()}>Cancel</button>
                </div>
        </div>
      </Dialog>
    )
}