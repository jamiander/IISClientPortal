import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { ViewDecisionDataButton } from "./ViewDecisionDataButton";
import { Company, Initiative } from "../../Store/CompanySlice";
import { DocumentManagementButton } from "../Documents/DocumentManagementButton";
import DecisionDataModal from "./DecisionDataModal";
import { DocumentManagementModal } from "../Documents/DocumentManagementModal";

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
  

  const [viewDecisionDataIsOpen, setViewDecisionDataIsOpen] = useState(false);
  const [documentModalIsOpen, setDocumentModalIsOpen] = useState(false);

  return (
    <>
      <IconButton
        data-cy={props.ids.menuButton}
        id="basic-button"
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
        <MenuItem onClick={handleClose}>
          {/*<ViewDecisionDataButton id={props.ids.decisionButton} company={props.company} initiative={props.initiative}/>*/}
          <Button data-cy={props.ids.decisionButton} onClick={() => setViewDecisionDataIsOpen(true)}>
            Decisions
          </Button>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {/*<DocumentManagementButton id={props.ids.documentButton} company={props.company} initiative={props.initiative} isAdmin={props.isAdmin}/>*/}
          <Button data-cy={props.ids.documentButton} onClick={() => setDocumentModalIsOpen(true)}>
            Documents
          </Button>
        </MenuItem>
      </Menu>
      <DecisionDataModal title='View Decision Data' isOpen={viewDecisionDataIsOpen} setDecisionModalIsOpen={setViewDecisionDataIsOpen} initiative={props.initiative} company={props.company}/>
      <DocumentManagementModal isOpen={documentModalIsOpen} setIsOpen={setDocumentModalIsOpen} company={props.company} initiative={props.initiative} isAdmin={props.isAdmin} />
    </>
  )
}
