import { useState } from "react";
import { User } from "../../Store/UserSlice";
import { IntegrityTheme, genericButtonStyle, integrityColors, yellowButtonStyle } from "../../Styles";
import { EditUserInitiativesModal } from "./EditUserInitiativesModal";
import { Company } from "../../Store/CompanySlice";
import { Button, ThemeProvider } from "@mui/material";

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
    <ThemeProvider theme={IntegrityTheme}>
      <Button variant="outlined" style={{outlineColor: 'blue'}} onClick={() => setIsOpen(true)}>Initiatives</Button>
      <EditUserInitiativesModal SubmitUserData={props.SubmitUserData} user={props.user} allCompanies={props.allCompanies} isOpen={isOpen} setIsOpen={setIsOpen} expanded={props.expanded}/>
    </ThemeProvider>
  )
}
