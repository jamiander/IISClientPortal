import { useState } from "react";
import { User } from "../../Store/UserSlice";
import { genericButtonStyle, yellowButtonStyle } from "../../Styles";
import { EditUserInitiativesModal } from "./EditUserInitiativesModal";
import { Company } from "../../Store/CompanySlice";
import { Button } from "@mui/material";

interface EditUserInitiativesButtonProps {
  user: User
  allCompanies: Company[]
  SubmitUserData: (user: User) => boolean
  expanded: boolean
}

export function EditUserInitiativesButton(props: EditUserInitiativesButtonProps)
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setIsOpen(true)}>Initiatives</Button>
      <EditUserInitiativesModal SubmitUserData={props.SubmitUserData} user={props.user} allCompanies={props.allCompanies} isOpen={isOpen} setIsOpen={setIsOpen} expanded={props.expanded}/>
    </>
  )
}
