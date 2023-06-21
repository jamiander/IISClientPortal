import { Button, IconButton, Menu, MenuItem, ThemeProvider } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { Company, IntegrityId } from "../Store/CompanySlice"
import { DocumentManagementModal } from "./Documents/DocumentManagementModal"
import ArticleDataModal from "./Articles/ArticleDataModal"
import { IntegrityTheme } from "../Styles"
import { useState } from "react"
import { DateInfo } from "../Services/CompanyService";
import { DateToDateInfo } from "../Services/DateHelpers";
import { User } from "../Store/UserSlice";
import { ActionsMenuItem } from "./ActionsMenuItem";

interface ClientActionsMenuProps {
  cypressData: {
    menuButton: string
    documentButton: string
    articleButton: string
  }
  company: Company
  currentUser: User | undefined
  disabled?: boolean
  size?: string
}

export function ClientActionsMenu(props: ClientActionsMenuProps)
{
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [articleModalIsOpen, setArticleModalIsOpen] = useState(false);
  const [documentModalIsOpen, setDocumentModalIsOpen] = useState(false);
 
  function HandleArticleModal()
  {
    setArticleModalIsOpen(true);
    handleClose();
  }

  function HandleDocumentModal()
  {
    setDocumentModalIsOpen(true);
    handleClose();
  }

  return (
    <>
    { props.currentUser &&
      <ThemeProvider theme={IntegrityTheme}>
        <IconButton
          data-cy={props.cypressData.menuButton}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          disabled={props.disabled}
        >
          <MenuIcon sx={{ fontSize: props.size ?? "large" }}/>
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <ActionsMenuItem cypressData={props.cypressData.articleButton} text="Articles" handleClick={HandleArticleModal}/>
          {props.currentUser.companyId === IntegrityId &&
            <ActionsMenuItem cypressData={props.cypressData.documentButton} text="Documents" handleClick={HandleDocumentModal}/>
          }
        </Menu>
        <ArticleDataModal company={props.company} isOpen={articleModalIsOpen} currentUser={props.currentUser} setArticleModalIsOpen={setArticleModalIsOpen }></ArticleDataModal>
        <DocumentManagementModal isOpen={documentModalIsOpen} setIsOpen={setDocumentModalIsOpen} company={props.company} isAdmin={props.currentUser.isAdmin} />
      </ThemeProvider>
    }
    </>
  )
}
