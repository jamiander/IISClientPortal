import { Button, ThemeProvider } from "@mui/material"
import { useState } from "react"
import { DateInfo } from "../../Services/CompanyService"
import { Company, Initiative } from "../../Store/CompanySlice"
import { IntegrityTheme } from "../../Styles"
import ArticleDataModal from "./ArticleDataModal"
import { User } from "../../Store/UserSlice"

interface ArticleDataButtonProps {
    cypressData: any
    title: string
    text: string
    updatedDate: DateInfo
    updatedBy: string
    isIntegrityOnly: boolean
    company: Company
    initiative?: Initiative
    isOpen: boolean
    currentUser: User
}
  
  export function ArticleDataButton(props: ArticleDataButtonProps)
  {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <ThemeProvider theme={IntegrityTheme}>
          <Button variant="outlined" style={{outlineColor: 'blue'}} data-cy={props.cypressData} onClick={() => setIsOpen(true)}>
            Articles
          </Button>
        </ThemeProvider>
        <ArticleDataModal initiative={props.initiative} company={props.company} isOpen={isOpen} currentUser={props.currentUser} setArticleModalIsOpen={setIsOpen }></ArticleDataModal>
      </div>
    )
  }