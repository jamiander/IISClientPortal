import { Button, IconButton, Menu, MenuItem, ThemeProvider, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { Company, Initiative, upsertThroughputData } from "../../Store/CompanySlice";
import DecisionDataModal from "./DecisionDataModal";
import { DocumentManagementModal } from "../Documents/DocumentManagementModal";
import UploadThroughputModal from "./UploadThroughputModal";
import EditThroughputModal from "./EditThroughputModal";
import { ValidateEditThroughputData, ValidateFileThroughputData, ValidationFailedPrefix } from "../../Services/Validation";
import { ThroughputData } from "../../Services/CompanyService";
import { useAppDispatch } from "../../Store/Hooks";
import { enqueueSnackbar } from "notistack";
import { IntegrityTheme } from "../../Styles";
import ArticleDataModal from "../Articles/ArticleDataModal";
import { User } from "../../Store/UserSlice";
import { ActionsMenuItem } from "../ActionsMenuItem";
import { DocumentMenuItem } from "../Documents/DocumentMenuItem";
import { ArticleMenuItem } from "../Articles/ArticleMenuItem";
import { DecisionMenuItem } from "./DecisionMenuItem";
import { EditThroughputMenuItem } from "./EditThroughputMenuItem";
import { UploadThroughputMenuItem } from "./UploadThroughputMenuItem";

interface InitiativeActionsMenuProps {
  cypressData: {
    menuButton: string
    decisionButton: string
    articleButton: string
    documentButton: string
    uploadThroughputButton: string
    editThroughputButton: string
  }
  allCompanies: Company[]
  company: Company
  initiative: Initiative
  disabled?: boolean
  size?: string
  currentUser: User
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

  async function SubmitUpdateThroughput(companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean = true) : Promise<boolean>
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const validation = emptyDataCheck ? ValidateFileThroughputData(props.allCompanies, companyId, initiativeId, dataList) : ValidateEditThroughputData(props.allCompanies, companyId, initiativeId, dataList);
    if(validation.success)
    {
      await dispatch(upsertThroughputData({companyId: companyId, initiativeId: initiativeId, itemsCompletedOnDate: dataList, isTest: isTest}));
      enqueueSnackbar("Throughput data changes have been saved.", {variant:'success'});
      return true;
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant:'error'});
    
    return false;
  }

  return (
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
        <DecisionMenuItem cypressData={props.cypressData.decisionButton} company={props.company} initiative={props.initiative} currentUser={props.currentUser}/>
        <ArticleMenuItem cypressData={props.cypressData.articleButton} company={props.company} initiative={props.initiative} currentUser={props.currentUser}/>
        <DocumentMenuItem cypressData={props.cypressData.documentButton} company={props.company} initiative={props.initiative} isAdmin={props.currentUser.isAdmin} />
        {props.currentUser.isAdmin &&
          <UploadThroughputMenuItem cypressData={props.cypressData.uploadThroughputButton} company={props.company} initiative={props.initiative} SubmitUpdateThroughput={SubmitUpdateThroughput}/>
        }
        <EditThroughputMenuItem cypressData={props.cypressData.editThroughputButton} allCompanies={props.allCompanies} company={props.company} initiative={props.initiative} currentUser={props.currentUser} SubmitUpdateThroughput={SubmitUpdateThroughput}/>
      </Menu>
    </ThemeProvider>
  )
}
