import { Grid, InputAdornment, CircularProgress, IconButton } from "@mui/material";
import { DateInfo } from "../../Services/CompanyService";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { UserTextField, Item, StyledCard, StyledCardContent, labelStyle, StyledTextarea, StyledTextField, StyledCardActions } from "../../Styles";
import { AddButton } from "../AddButton";
import { DateInput } from "../DateInput";
import { BaseInitiativeModal } from "../Initiative/BaseInitiativeModal";
import { DecisionModalIds } from "../Initiative/DecisionDataModal";
import { DeleteDecisionAlert } from "../Initiative/DeleteDecisionAlert";
import { useEffect, useState } from "react";
import { Company, Initiative } from "../../Store/CompanySlice";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { MakeClone } from "../../Services/Cloning";
import {v4 as UuidV4} from "uuid";
import { enqueueSnackbar } from "notistack";

enum stateEnum {
    start,
    edit,
    add,
    delete
} 

export const ArticleModalIds = {
    modal: "articleModal",
    addButton: "articleModalAddButton",
    closeModalButton: "articleModalCloseModalButton",
    keywordFilter: "articleModalKeywordFilter",
    editButton: "articleModalEditButton",
    deleteButton: "articleModalDeleteButton",
    aveChangesButton: "articleModalSaveChangesButton",
    cancelChangesButton: "articleModalCancelChangesButton",
    title: "articleModalTitle",
    text: "articleModalText",
    updatedDate: "articleModalUpdatedDate",
    updatedBy: "articleModalUpdatedBy",
    editTitle: "editTitle",
    editText: "editText",
    editUpdatedBy: "editUpdatedBy",
    editUpdatedDate: "editUpdatedDate",
    isIntegrityOnly: "articleModalIntegrityOnly",
    companyId: "articleModalCompanyId",
    initiativeId: "articleInitiativeId",
    grid: "decisionModalGrid"

}

interface ArticleDataProps {
    title: string
    text: string
    updatedDate: DateInfo
    updatedBy: string
    isIntegrityOnly: boolean
    company: Company
    initiative: Initiative
    isOpen: boolean
    isAdmin: boolean
    setArticleModalIsOpen: (value: boolean) => void
}

export interface Article {
    id: string
    title: string
    text: string
    updatedDate: DateInfo
    updatedBy: string
    companyId: string
    initiativeId?: string 
    isIntegrityOnly: boolean
}

export default function ArticleDataModal(props: ArticleDataProps) {
    const dispatch = useAppDispatch();
/*     const allArticles = useAppSelector(selectAllArticles);
 */    
    
    const [modalState, setModalState] = useState(stateEnum.start);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentText, setCurrentText] = useState("");
    const [currentUpdatedDate, setCurrentUpdatedDate] = useState<DateInfo>();
    const [currentUpdatedBy, setCurrentUpdatedBy] = useState("");
    const [currentInitiativeId, setCurrentInitiativeId] = useState("");
    const [currentCompanyId, setCurrentCompanyId] = useState("");
    const [selectedInitiative, setSelectedInitiative] = useState<Initiative>(props.initiative);
    const [selectedCompany, setSelectedCompany] = useState<Company>(props.company);
    const [articleToEdit, setArticleToEdit] = useState<Article>();

    const InEditMode = () => modalState === stateEnum.edit || modalState === stateEnum.add;
    const today = new Date();
    const todayInfo: DateInfo = {month: today.getMonth()+1, day: today.getDate(), year: today.getFullYear()}
    const [searchedKeyword, setSearchedKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

    const allArticles: Article[] = [{id:"id", title:"title", text:"text", updatedDate: todayInfo, updatedBy:"updatedBy", companyId:"companyId", initiativeId:"8b9dfc4e-2e79-4477-ade0-74c3234fbf86", isIntegrityOnly:false},
    {id:"id", title:"Testing Article", text:"Article for testing purposes", updatedDate: todayInfo, updatedBy:"Jamie", companyId:"secondCompany", initiativeId:"653da209-3345-4213-882c-42e663b28186", isIntegrityOnly:false}];

    useEffect(() => {
        setSelectedInitiative(props.initiative);
        setSelectedCompany(props.company);
        setIsLoading(false);
        LeaveEditMode();
    },[props.isOpen])

    useEffect(() => {
        setFilteredArticles(allArticles.filter(
            a => a.initiativeId === selectedInitiative?.id &&
            (a.title.toUpperCase().includes(searchedKeyword.toUpperCase())
            || a.text.toUpperCase().includes(searchedKeyword.toUpperCase())
            )) 
        );
    },[selectedInitiative,searchedKeyword])

    function HandleEmptyArticle(){
        if(modalState === stateEnum.start)
        {
            let articlesClone = MakeClone(filteredArticles);
            let newId = UuidV4();
            let newArticle: Article = {
                id: newId, 
                title: "", 
                text: "", 
                updatedBy: "", 
                updatedDate: todayInfo,
                companyId: selectedCompany.id,
                initiativeId: selectedInitiative?.id,
                isIntegrityOnly: false
            };
            articlesClone.unshift(newArticle);
            setSearchedKeyword("");
            setFilteredArticles(articlesClone);
            EnterEditMode(newId,articlesClone,true);
        }
        else
            enqueueSnackbar("Save current changes before adding a new article.", {variant: "error"});
    }
    function HandleEditArticle(id: string, currentTitle: string, currentText: string, currentUpdatedBy: string, currentUpdatedDate: DateInfo): void {
        throw new Error("Function not implemented.");
    }

    function HandleCancelEdit() {
        if(modalState === stateEnum.add && articleToEdit)
        {
            let articleClone: Article = MakeClone(articleToEdit);
            articleClone = allArticles.find(a => a.id !== articleToEdit.id)!;
            setArticleToEdit(articleClone);
        }
        LeaveEditMode();
    }

    function LeaveEditMode() {
        setArticleToEdit(undefined);
        setModalState(stateEnum.start);
    }
    

    function HandleAttemptDelete(id: string): void {
        throw new Error("Function not implemented.");
    }

    function EnterEditMode(id: string, articles: Article[], isNew: boolean)
    {
        if(!InEditMode())
        {
            let currentArticle = articles.find(u => u.id === id);
            if(currentArticle)
        {
            setModalState(isNew ? stateEnum.add : stateEnum.edit);
            setArticleToEdit(currentArticle);
            setCurrentTitle(currentArticle.title);
            setCurrentText(currentArticle.text);
            setCurrentInitiativeId(currentArticle.initiativeId ?? "");
            setCurrentCompanyId(currentArticle.companyId);
            setCurrentUpdatedBy(currentArticle.updatedBy);
            setCurrentUpdatedDate(currentArticle.updatedDate);
        }
        }
    }

    return (
        <>
        <BaseInitiativeModal
        open={props.isOpen}
        onClose={()=>props.setArticleModalIsOpen(false)}
        cypressData={{modal: ArticleModalIds.modal, closeModalButton: ArticleModalIds.closeModalButton}}
        title="Articles"
        subtitle={selectedCompany?.name}
        maxWidth={false}
        >
        <div className="mx-1 mb-2">
          <div className="flex flex-row justify-content:space-between">
            <Grid container sx={{ display: 'flex',
              placeItems: 'center',
              flexDirection: 'row',
              p: 1,
              mt: 2,
              mb: 1,
              ml: 2,
              mr: 2,
              borderRadius: 1, 
              }}>
              {selectedInitiative !== undefined &&
              <Grid item xs={4} sx={{ display: 'flex',
                justifyContent: 'flex-start',
              }}>
                <UserTextField data-cy={ArticleModalIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)}
                  
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              }
              <Grid item xs={4} sx={{ display: "flex",
                justifyContent: "center"}}>
                {isLoading &&
                  <CircularProgress color={"warning"}/>
                }
              </Grid>
              {props.isAdmin &&
              <Grid item xs={4} sx={{ display: 'flex',
              justifyContent: 'flex-end'
              }}> 
                <AddButton cypressData={ArticleModalIds.addButton} HandleClick={() => HandleEmptyArticle()} disabled={InEditMode()}/>
              </Grid>
              }
            </Grid>
            </div>
            <Grid container sx={{ display: 'flex',
              justifyContent: "space-between",
              placeItems: 'center',
              flexDirection: 'row'}}
              spacing={4}
              data-cy={ArticleModalIds.grid}>
              {
                filteredArticles.map((displayItem, key) => {
                let matched = displayItem.id === (articleToEdit?.id ?? -1);
                let isEdit = matched && InEditMode();
                return(
                  <Grid item md={6} lg={4} key={key}>
                    <Item>
                      <StyledCard>
                        <StyledCardContent>
                          {isEdit ?
                          <>
                            <label className={labelStyle} htmlFor="title">Title</label>
                            <StyledTextarea id="title" data-cy={ArticleModalIds.editTitle} value={currentTitle} onChange={e => setCurrentTitle(e.target.value)}/>
                            <label className={labelStyle} htmlFor="text">Content</label>
                            <StyledTextarea id="text" data-cy={ArticleModalIds.editText} value={currentText} onChange={e => setCurrentText(e.target.value)}/>
                            <label className={labelStyle} htmlFor="updatedby">Updated By</label>
                            <StyledTextarea id="updatedby" data-cy={ArticleModalIds.editUpdatedBy} value={currentUpdatedBy} onChange={e => setCurrentUpdatedBy(e.target.value)}/>
                            <DateInput cypressData={ArticleModalIds.editUpdatedDate} label="Date Updated" date={currentUpdatedDate} setDate={setCurrentUpdatedDate}/>
                          </>
                          :
                          <>
                            <label className={labelStyle} htmlFor="description">Title</label>
                            <StyledTextarea id="title" data-cy={ArticleModalIds.title} disabled value={displayItem.title}/>
                            <label className={labelStyle} htmlFor="text">Content</label>
                            <StyledTextarea id="text" data-cy={ArticleModalIds.text} disabled value={displayItem.text}/>
                            <label className={labelStyle} htmlFor="text">Updated By</label>
                            <StyledTextarea id="updatedby" data-cy={ArticleModalIds.updatedBy} disabled value={displayItem.updatedBy}/>
                            <DateInput cypressData={ArticleModalIds.updatedDate} label="Date Updated" disabled={true} date={displayItem.updatedDate} setDate={setCurrentUpdatedDate}/>
                          </>
                          }
                        </StyledCardContent>
                        <StyledCardActions>
                          {isEdit &&
                            <div className="flex w-full justify-between">
                              <IconButton disabled={isLoading} data-cy={DecisionModalIds.saveChangesButton}
                                onClick={() => HandleEditArticle(displayItem.id, currentTitle, currentText, currentUpdatedBy, currentUpdatedDate ?? displayItem.updatedDate)}>
                                <DoneIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                              {isLoading &&
                                <CircularProgress color={"warning"}/>
                              }
                              <IconButton disabled={isLoading} data-cy={DecisionModalIds.cancelChangesButton} onClick={() => HandleCancelEdit()}>
                                <CancelIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                            </div>
                          }
                          {
                            !isEdit && !InEditMode() && props.isAdmin &&
                            <div className="flex w-full justify-between">
                              <IconButton disabled={isLoading} data-cy={ArticleModalIds.editButton} onClick={() => EnterEditMode(displayItem.id, filteredArticles, false)}>
                                <EditIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                              {isLoading && matched &&
                                <CircularProgress color={"warning"}/>
                              }
                              <IconButton disabled={isLoading} data-cy={ArticleModalIds.deleteButton} onClick={() => HandleAttemptDelete(displayItem.id)}>
                                <DeleteIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                            </div>
                          }
                        </StyledCardActions>
                      </StyledCard>
                    </Item>
                  </Grid>
                )
              })}
              {
              filteredArticles.length === 0 && <Grid item>No decisions to display.</Grid>
              }
            </Grid>
          </div>
        </BaseInitiativeModal>
      </>
  );
}

