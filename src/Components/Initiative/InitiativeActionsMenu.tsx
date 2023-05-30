import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { ViewDecisionDataButton } from "./ViewDecisionDataButton";
import { Company, Initiative } from "../../Store/CompanySlice";
import { DocumentManagementButton } from "../Documents/DocumentManagementButton";

interface InitiativeActionsMenuProps {
  ids: {
    menuButton: string
    decisionButton: string
    documentButton: string
  }
  company: Company
  initiative: Initiative
  disabled?: boolean
  isAdmin: boolean
}

export function InitiativeActionsMenu(props: InitiativeActionsMenuProps)
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
      <IconButton
        id={props.ids.menuButton}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disabled={props.disabled}
      >
        <MenuIcon/>
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
        <MenuItem>
          <ViewDecisionDataButton id={props.ids.decisionButton} company={props.company} initiative={props.initiative}/>
        </MenuItem>
        <MenuItem>
          <DocumentManagementButton id={props.ids.documentButton} company={props.company} initiative={props.initiative} isAdmin={props.isAdmin}/>
        </MenuItem>
      </Menu>
    </>
  )
}
