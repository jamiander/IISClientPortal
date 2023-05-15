import { useState } from "react";
import { User } from "../../Store/UserSlice";
import { yellowButtonStyle } from "../../Styles";
import { EditUserInitiativesModal } from "./EditUserInitiativesModal";
import { Company } from "../../Store/CompanySlice";

interface EditUserInitiativesButtonProps {
  user: User
  allCompanies: Company[]
  SubmitUserData: (user: User) => boolean
}

export function EditUserInitiativesButton(props: EditUserInitiativesButtonProps)
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={yellowButtonStyle}>Edit Selected Initiatives</button>
      <EditUserInitiativesModal SubmitUserData={props.SubmitUserData} user={props.user} allCompanies={props.allCompanies} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </>
  )
}
