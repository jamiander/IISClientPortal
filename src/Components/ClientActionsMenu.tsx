import { Button, IconButton, Menu, MenuItem, ThemeProvider } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { Company, Initiative, IntegrityId } from "../Store/CompanySlice"
import { DocumentManagementModal } from "./Documents/DocumentManagementModal"
import ArticleDataModal from "./Articles/ArticleDataModal"
import { IntegrityTheme } from "../Styles"
import { useState } from "react"
import { DateInfo } from "../Services/CompanyService";
import { DateToDateInfo } from "../Services/DateHelpers";
import { User } from "../Store/UserSlice";

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

  const todayInfo: DateInfo = DateToDateInfo(new Date());
  const [articleModalIsOpen, setArticleModalIsOpen] = useState(false);
  const [documentModalIsOpen, setDocumentModalIsOpen] = useState(false);
  const dummyInitiative: Initiative = {
    id: "-1",
    title: "",
    targetDate: todayInfo,
    startDate: todayInfo,
    totalItems: 0,
    itemsCompletedOnDate: [],
    decisions: []
  };

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
          <MenuItem data-cy={props.cypressData.articleButton} onClick={() => HandleArticleModal()}>
            <Button style={{outlineColor: 'blue'}}>
              Articles
            </Button>
          </MenuItem>
          {props.currentUser.companyId === IntegrityId &&
            <MenuItem data-cy={props.cypressData.documentButton} onClick={() => HandleDocumentModal()}>
              <Button style={{outlineColor: 'blue'}}>
                Documents
              </Button>
            </MenuItem>
          }
        </Menu>
        <ArticleDataModal title={""} text={""} updatedDate={todayInfo} updatedBy={""} isIntegrityOnly={false} initiative={dummyInitiative} company={props.company} isOpen={articleModalIsOpen} isAdmin={props.currentUser.isAdmin} setArticleModalIsOpen={setArticleModalIsOpen }></ArticleDataModal>
        <DocumentManagementModal isOpen={documentModalIsOpen} setIsOpen={setDocumentModalIsOpen} company={props.company} isAdmin={props.currentUser.isAdmin} />
      </ThemeProvider>
    }
    </>
  )
}
