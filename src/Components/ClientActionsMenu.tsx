import { IconButton, Menu, ThemeProvider } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { Company, IntegrityId } from "../Store/CompanySlice"
import ArticleDataModal from "./Articles/ArticleDataModal"
import { IntegrityTheme } from "../Styles"
import { useState } from "react"
import { User } from "../Store/UserSlice";
import { DocumentMenuItem } from "./Documents/DocumentMenuItem";
import { ArticleMenuItem } from "./Articles/ArticleMenuItem";

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
          <ArticleMenuItem cypressData={props.cypressData.articleButton} company={props.company} currentUser={props.currentUser}/>
          {props.currentUser.companyId === IntegrityId &&
            <DocumentMenuItem cypressData={props.cypressData.documentButton} company={props.company} isAdmin={props.currentUser.isAdmin}/>
          }
        </Menu>
      </ThemeProvider>
    }
    </>
  )
}
