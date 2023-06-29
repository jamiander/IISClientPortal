import { TextField, Checkbox, Typography, Button, Divider, CircularProgress, IconButton } from "@mui/material";
import { props } from "cypress/types/bluebird";
import ReactQuill from "react-quill";
import { MakeDateString } from "../../Services/DateHelpers";
import { IntegrityId } from "../../Store/CompanySlice";
import { Item, StyledCard, StyledCardActions, StyledCardContent } from "../../Styles";
import { ArticleModalIds } from "./ArticleDataModal";
import { ReactQuillWrapper } from "./ReactQuillWrapper";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import FlagIcon from "@mui/icons-material/Flag";
import CancelIcon from "@mui/icons-material/Cancel";
import FolderIcon from "@mui/icons-material/Folder";
import { Article } from "../../Store/ArticleSlice";
import { User } from "../../Store/UserSlice";

interface ArticleCardProps {
  article: Article
  isEditingAnyone: boolean
  isEditingMe: boolean
  currentUser: User
  currentTitle: string
  setCurrentTitle: (value: string) => void
  currentText: string
  setCurrentText: (value: string) => void
  isIntegrityOnly: boolean
  setIsIntegrityOnly: (value: boolean) => void
  isSubmitting: boolean
  HandleDocButton: () => void
  HandleStartEdit: () => void
  HandleCancelEdit: () => void
  HandleSubmit: () => void
}

export function ArticleCard(props: ArticleCardProps)
{

  return (
    <Item>
      <StyledCard>
        <StyledCardContent>
          {props.isEditingMe ?
            <>
              <TextField data-cy={ArticleModalIds.editTitle} label="Title" sx={{width: "100%"}} value={props.currentTitle} onChange={e => props.setCurrentTitle(e.target.value)}/>
              <div className="flex items-center justify-start">
                <Checkbox data-cy={ArticleModalIds.isIntegrityOnly} color="darkBlue" checked={props.isIntegrityOnly} onChange={e => props.setIsIntegrityOnly(e.target.checked)}/>
                <Typography variant="subtitle2">Integrity Only</Typography>
              </div>
              <ReactQuillWrapper data-cy={ArticleModalIds.editText} initialValue={props.article.text} valueSetter={props.setCurrentText}/>
            </>
            :
            <>
              <Typography data-cy={ArticleModalIds.title} variant="h5">{props.article.title}</Typography>
              <div className="flex justify-between">
                <div className="flex items-center">
                  {props.article.isIntegrityOnly &&
                    <>
                      <FlagIcon sx={{ color: "red", marginRight: 1 }}/>
                      <Typography variant="subtitle2">Integrity Only</Typography>
                    </>
                  }
                </div>
                <Button data-cy={ArticleModalIds.documents} variant="text" onClick={() => props.HandleDocButton()} sx={{ fontSize: "1.2rem" }}>
                  <FolderIcon sx={{ color: "blue", fontSize: "inherit", marginRight: 1 }}/>
                  <Typography variant="button">Related Docs</Typography>
                </Button>
              </div>
              <Divider/>
              <ReactQuill data-cy={ArticleModalIds.text} value={props.article.text} readOnly={true} modules={{toolbar: false}}
                style={{
                  maxHeight: "100px",
                  overflow: "auto"
                }}
                theme="bubble"
              />
              <Divider/>
            </>
          }
            
        </StyledCardContent>
        <StyledCardActions>
            {props.isEditingMe &&
              <div className="flex w-full justify-end">
                {props.isSubmitting &&
                  <CircularProgress color={"warning"}/>
                }
                <IconButton disabled={props.isSubmitting} data-cy={ArticleModalIds.saveChangesButton}
                  onClick={() => props.HandleSubmit()}>
                  <DoneIcon sx={{fontSize: "inherit"}}/>
                </IconButton>
                <IconButton disabled={props.isSubmitting} data-cy={ArticleModalIds.cancelChangesButton} onClick={() => props.HandleCancelEdit()}>
                  <CancelIcon sx={{fontSize: "inherit"}}/>
                </IconButton>
              </div>
            }
            {
              !props.isEditingMe && !props.isEditingAnyone && props.currentUser.companyId === IntegrityId &&
              <div className="flex w-full justify-between">
                <Typography variant="subtitle2" className="w-2/3" color="gray">
                  Last updated on {MakeDateString(props.article.updatedDate)} ({props.article.updatedBy.split(" ").join("\u00a0")})
                </Typography>
                <IconButton disabled={props.isSubmitting} data-cy={ArticleModalIds.editButton} onClick={() => props.HandleStartEdit()}>
                  <EditIcon sx={{fontSize: "inherit"}}/>
                </IconButton>
              </div>
            }
        </StyledCardActions>
      </StyledCard>
    </Item>
  )
}
