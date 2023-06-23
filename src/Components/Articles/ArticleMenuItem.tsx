import { useState } from "react"
import { Company, Initiative } from "../../Store/CompanySlice"
import ArticleDataModal from "./ArticleDataModal"
import { User } from "../../Store/UserSlice"
import { ActionsMenuItem } from "../ActionsMenuItem"

interface ArticleDataButtonProps {
  cypressData: string
  company: Company
  initiative?: Initiative
  currentUser: User
}
  
export function ArticleMenuItem(props: ArticleDataButtonProps)
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="Articles" handleClick={() => setIsOpen(true)}/>
      <ArticleDataModal initiative={props.initiative} company={props.company} isOpen={isOpen} currentUser={props.currentUser} setArticleModalIsOpen={setIsOpen}/>
    </>
  )
}