import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { ViewDecisionDataButton } from "./ViewDecisionDataButton";
import { Company, Initiative, upsertThroughputData } from "../../Store/CompanySlice";
import { DocumentManagementButton } from "../Documents/DocumentManagementButton";
import DecisionDataModal from "./DecisionDataModal";
import { DocumentManagementModal } from "../Documents/DocumentManagementModal";
import UploadThroughputModal from "./UploadThroughputModal";
import EditThroughputModal from "./EditThroughputModal";
import { ValidateEditThroughputData, ValidateFileThroughputData, ValidationFailedPrefix } from "../../Services/Validation";
import { ThroughputData } from "../../Services/CompanyService";
import { useAppDispatch } from "../../Store/Hooks";
import { enqueueSnackbar } from "notistack";

interface InitiativeActionsMenuProps {
  cypressData: {
    menuButton: string
    decisionButton: string
    documentButton: string
    uploadThroughputButton: string
    editThroughputButton: string
  }
  allCompanies: Company[]
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

  const dispatch = useAppDispatch();

  const [decisionModalIsOpen, setDecisionModalIsOpen] = useState(false);
  const [documentModalIsOpen, setDocumentModalIsOpen] = useState(false);
  const [uploadThroughputModalIsOpen, setUploadThroughputModalIsOpen] = useState(false);
  const [editThroughputModalIsOpen, setEditThroughputModalIsOpen] = useState(false);

  async function SubmitUpdateThroughput(companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean = true) : Promise<boolean>
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const validation = emptyDataCheck ? ValidateFileThroughputData(props.allCompanies, companyId, initiativeId, dataList) : ValidateEditThroughputData(props.allCompanies, companyId, initiativeId, dataList);
    if(validation.success)
    {
      await dispatch(upsertThroughputData({companyId: companyId, initiativeId: initiativeId, itemsCompletedOnDate: dataList, isTest: isTest}));
      setUploadThroughputModalIsOpen(false);
      enqueueSnackbar("Throughput data changes have been saved.", {variant:'success'});
      return true;
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant:'error'});
    
    return false;
  }

  function HandleDecisionModal()
  {
    setDecisionModalIsOpen(true);
    handleClose();
  }

  function HandleDocumentModal()
  {
    setDocumentModalIsOpen(true);
    handleClose();
  }

  function HandleUploadThroughputModal()
  {
    setUploadThroughputModalIsOpen(true);
    handleClose();
  }

  function HandleEditThroughputModal()
  {
    setEditThroughputModalIsOpen(true);
    handleClose();
  }

  return (
    <>
      <IconButton
        data-cy={props.cypressData.menuButton}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disabled={props.disabled}
      >
        <MenuIcon sx={{ fontSize: "calc(12px + 0.390625vw)" }}/>
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
        <MenuItem data-cy={props.cypressData.decisionButton} onClick={() => HandleDecisionModal()}>
          {/*<ViewDecisionDataButton id={props.ids.decisionButton} company={props.company} initiative={props.initiative}/>*/}
          <Button>
            Decisions
          </Button>
        </MenuItem>
        <MenuItem data-cy={props.cypressData.documentButton} onClick={() => HandleDocumentModal()}>
          {/*<DocumentManagementButton id={props.ids.documentButton} company={props.company} initiative={props.initiative} isAdmin={props.isAdmin}/>*/}
          <Button>
            Documents
          </Button>
        </MenuItem>
        <MenuItem data-cy={props.cypressData.uploadThroughputButton} onClick={() => HandleUploadThroughputModal()}>
          <Button>
            Upload Throughput
          </Button>
        </MenuItem>
        <MenuItem data-cy={props.cypressData.editThroughputButton} onClick={() => HandleEditThroughputModal()}>
          <Button>
            Edit Throughput
          </Button>
        </MenuItem>
      </Menu>
      <DecisionDataModal title='View Decision Data' isOpen={decisionModalIsOpen} setDecisionModalIsOpen={setDecisionModalIsOpen} initiative={props.initiative} company={props.company} isAdmin={props.isAdmin}/>
      <DocumentManagementModal isOpen={documentModalIsOpen} setIsOpen={setDocumentModalIsOpen} company={props.company} initiative={props.initiative} isAdmin={props.isAdmin} />
      <UploadThroughputModal company={props.company} initiative={props.initiative} uploadIsOpen={uploadThroughputModalIsOpen} setUploadIsOpen={setUploadThroughputModalIsOpen} Submit={SubmitUpdateThroughput}/>
      <EditThroughputModal allCompanies={props.allCompanies} company={props.company} initiative={props.initiative} editIsOpen={editThroughputModalIsOpen} setEditIsOpen={setEditThroughputModalIsOpen} Submit={SubmitUpdateThroughput}/>
    </>
  )
}
