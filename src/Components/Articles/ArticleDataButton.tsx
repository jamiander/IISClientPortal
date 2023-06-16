import { Button, ThemeProvider } from "@mui/material"
import { useState } from "react"
import { DateInfo } from "../../Services/CompanyService"
import { Company, Initiative } from "../../Store/CompanySlice"
import { IntegrityTheme } from "../../Styles"
import ArticleDataModal from "./ArticleDataModal"

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
    isAdmin: boolean
}
  
  export function ArticleDataButton(props: ArticleDataButtonProps)
  {
    const [isOpen, setIsOpen] = useState(false);
    const today = new Date();

    return (
      <div>
        <ThemeProvider theme={IntegrityTheme}>
          <Button variant="outlined" style={{outlineColor: 'blue'}} data-cy={props.cypressData} onClick={() => setIsOpen(true)}>
            Articles
          </Button>
        </ThemeProvider>
        <ArticleDataModal title={""} text={""} updatedDate={{month: today.getMonth()+1, day: today.getDate(), year: today.getFullYear()}} updatedBy={""} isIntegrityOnly={false} initiative={props.initiative} company={props.company} isOpen={isOpen} isAdmin={props.isAdmin} setArticleModalIsOpen={setIsOpen }></ArticleDataModal>
      </div>
    )
  }