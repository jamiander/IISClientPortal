import { useState } from "react"
import { Company, Initiative } from "../../Store/CompanySlice"
import ArticleDataModal from "./ArticleDataModal"
import { User } from "../../Store/UserSlice"
import { ActionsMenuItem } from "../ActionsMenuItem"

interface ArticleMenuItemProps {
  cypressData: string
  company: Company
  initiative?: Initiative
  currentUser: User,
  CloseMenu: () => void
}
  
export function ArticleMenuItem(props: ArticleMenuItemProps)
{
  const [isOpen, setIsOpen] = useState(false);

  function HandleClose()
  {
    setIsOpen(false);
    props.CloseMenu();
  }

  return (
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="Articles" handleClick={() => setIsOpen(true)}/>
      <ArticleDataModal {...props} isOpen={isOpen} HandleClose={HandleClose}/>
    </>
  )
}