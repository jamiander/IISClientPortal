import { Grid, CircularProgress, IconButton, Checkbox } from "@mui/material";
import { DateInfo } from "../../Services/CompanyService";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { Item, StyledCard, StyledCardContent, labelStyle, StyledTextarea, StyledCardActions } from "../../Styles";
import { AddButton } from "../AddButton";
import { DateInput } from "../DateInput";
import { BaseInitiativeModal } from "../Initiative/BaseInitiativeModal";
import { useEffect, useState } from "react";
import { Company, Initiative, IntegrityId } from "../../Store/CompanySlice";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import FlagIcon from "@mui/icons-material/Flag";
import CancelIcon from "@mui/icons-material/Cancel";
import FolderIcon from "@mui/icons-material/Folder";
import { MakeClone } from "../../Services/Cloning";
import {v4 as UuidV4} from "uuid";
import { enqueueSnackbar } from "notistack";
import { Article, clearArticles, getArticle, selectAllArticles, upsertArticle } from "../../Store/ArticleSlice";
import { ValidateArticle, ValidationFailedPrefix } from "../../Services/Validation";
import { User } from "../../Store/UserSlice";
import { SearchBar } from "../SearchBar";
import { DocumentManagementModal } from "../Documents/DocumentManagementModal";

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
  saveChangesButton: "articleModalSaveChangesButton",
  cancelChangesButton: "articleModalCancelChangesButton",
  title: "articleModalTitle",
  text: "articleModalText",
  updatedDate: "articleModalUpdatedDate",
  updatedBy: "articleModalUpdatedBy",
  editTitle: "articleEditTitle",
  editText: "articleEditText",
  editUpdatedBy: "editUpdatedBy",
  editUpdatedDate: "editUpdatedDate",
  isIntegrityOnly: "articleModalIntegrityOnly",
  companyId: "articleModalCompanyId",
  initiativeId: "articleInitiativeId",
  grid: "articleModalGrid"
}

interface ArticleDataProps {
  company: Company
  initiative?: Initiative | undefined
  isOpen: boolean
  currentUser: User
  HandleClose: () => void
}

export default function ArticleDataModal(props: ArticleDataProps) {
    const dispatch = useAppDispatch();
    const allArticles = useAppSelector(selectAllArticles);  
    const today = new Date();
    const todayInfo: DateInfo = {month: today.getMonth()+1, day: today.getDate(), year: today.getFullYear()}  
    
    const [modalState, setModalState] = useState(stateEnum.start);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentText, setCurrentText] = useState("");
    const [currentUpdatedDate, setCurrentUpdatedDate] = useState<DateInfo>();
    const [currentUpdatedBy, setCurrentUpdatedBy] = useState("");
    const [isIntegrityOnly, setIsIntegrityOnly] = useState(false);
    const [selectedInitiative, setSelectedInitiative] = useState<Initiative>();
    const [selectedCompany, setSelectedCompany] = useState<Company>(props.company);
    const [articleToEdit, setArticleToEdit] = useState<Article>();

    const InEditMode = () => modalState === stateEnum.edit || modalState === stateEnum.add;
    const [searchedKeyword, setSearchedKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(true);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [documentModalOpen, setDocumentModalOpen] = useState(false);
    const [articleWithDocsId, setArticleWithDocsId] = useState("");

    useEffect(() => {
      if(props.isOpen)
        CallDispatch();
      
    }, [props.isOpen]);

    function CloseModalAndReset()
    {
      dispatch(clearArticles());
      props.HandleClose();
    }

    async function CallDispatch() {
      setLoadingModal(true);
      await dispatch(getArticle({companyId: props.company.id, initiativeId: props.initiative?.id, userCompanyId: props.currentUser.companyId}))
      setLoadingModal(false);
    } 

    useEffect(() => {
      if(props.initiative)
        setSelectedInitiative(props.initiative);
        
      setSelectedCompany(props.company);
      setIsLoading(false);
      LeaveEditMode();
    },[props.isOpen]);

    useEffect(() => {
      const articles = allArticles.filter(a => a.title.toUpperCase().includes(searchedKeyword.toUpperCase())
      || a.title.toUpperCase().includes(searchedKeyword.toUpperCase()));
      setFilteredArticles(articles);
    },[searchedKeyword,allArticles])

    function HandleEmptyArticle()
    {
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
          setCurrentUpdatedBy(currentArticle.updatedBy);
          setCurrentUpdatedDate(currentArticle.updatedDate);
          setIsIntegrityOnly(currentArticle.isIntegrityOnly);
        }
      }
    }

    async function HandleEditArticle(id: string, newTitle: string, newText: string, newUpdatedBy: string, newUpdatedDate: DateInfo, newIsIntegrityOnly: boolean) {
      let selectedArticlesClone: Article[] = MakeClone(filteredArticles);
      let newArticle = selectedArticlesClone.find(a => a.id === id);
      if(newArticle)
      {
        newArticle.title = newTitle;
        newArticle.text = newText;
        newArticle.updatedBy = newUpdatedBy;
        newArticle.updatedDate = newUpdatedDate;
        newArticle.isIntegrityOnly = newIsIntegrityOnly;

        setIsLoading(true);
        let successfulSubmit = await SubmitArticle(newArticle);
        if(successfulSubmit)
          setFilteredArticles(selectedArticlesClone);
        setIsLoading(false);
      }
    }

    async function SubmitArticle(article: Article): Promise<boolean> {
        let isTest = false;
        if((window as any).Cypress)
          isTest = true;
        
        const validation = ValidateArticle(article);

        if(validation.success)
        {
            await dispatch(upsertArticle({isTest: isTest, articles: [article]}));
            enqueueSnackbar("Article changes have been saved.", {variant: "success"});
            LeaveEditMode();
            return true;
        }
        else
            enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});

        return false;
    }

    function HandleCancelEdit()
    {
      if(modalState === stateEnum.add && articleToEdit)
      {
        const articlesClone = filteredArticles.filter(a => a.id !== articleToEdit.id);
        setFilteredArticles(articlesClone);
      }
      LeaveEditMode();
    }

    function LeaveEditMode() {
        setArticleToEdit(undefined);
        setModalState(stateEnum.start);
    }

    function HandleClose() {
      setDocumentModalOpen(false);
    }
    
  return (
    <>
      <BaseInitiativeModal
        open={props.isOpen}
        onClose={()=>CloseModalAndReset()}
        cypressData={{modal: ArticleModalIds.modal, closeModalButton: ArticleModalIds.closeModalButton}}
        title="Articles"
        subtitle={selectedCompany?.name + (selectedInitiative ? " - " + selectedInitiative.title : "")}
        maxWidth={false}
        >
        {!loadingModal &&
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
              <Grid item xs={4} sx={{ display: 'flex',
                justifyContent: 'flex-start',
              }}>
                {allArticles.length !== 0 &&
                  <SearchBar cypressData={ArticleModalIds.keywordFilter} placeholder="Keyword" value={searchedKeyword} setValue={setSearchedKeyword} />
                }
              </Grid>
              <Grid item xs={4} sx={{ display: "flex",
                justifyContent: "center"}}>
                {isLoading &&
                  <CircularProgress color={"warning"}/>
                }
              </Grid>
              {props.currentUser.companyId === IntegrityId && 
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
                            <div className="ml-[75%]"><Checkbox data-cy={ArticleModalIds.isIntegrityOnly} color="darkBlue" checked={isIntegrityOnly} onChange={e => setIsIntegrityOnly(e.target.checked)}/>Integrity Only</div>
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
                          {displayItem.isIntegrityOnly &&
                            <div className="ml-[75%]"><FlagIcon sx={{ color: "red", marginRight: 1 }}></FlagIcon>Integrity Only</div>}
                            <label className={labelStyle} htmlFor="description">Title</label>
                            <StyledTextarea id="title" data-cy={ArticleModalIds.title} disabled value={displayItem.title}/>
                            <label className={labelStyle} htmlFor="text">Content</label>
                            <StyledTextarea id="text" data-cy={ArticleModalIds.text} disabled value={displayItem.text}/>
                            <label className={labelStyle} htmlFor="text">Updated By</label>
                            <StyledTextarea id="updatedby" data-cy={ArticleModalIds.updatedBy} disabled value={displayItem.updatedBy}/>
                            <div className="flex flex-row justify-content:space-between">
                              <DateInput cypressData={ArticleModalIds.updatedDate} label="Date Updated" disabled={true} date={displayItem.updatedDate} setDate={setCurrentUpdatedDate}/>
                              <IconButton onClick={() => {setDocumentModalOpen(true); setArticleWithDocsId(displayItem.id)}} sx={{ fontSize: "1.2rem", width: "50%", alignContent: "right" }}>
                              <FolderIcon sx={{ color: "blue", fontSize: "inherit",  marginRight: 1 }}></FolderIcon>Related Documentation
                              </IconButton>
                            </div>
                          </>
                          }
                          
                      </StyledCardContent>
                      <StyledCardActions>
                          {isEdit &&
                            <div className="flex w-full justify-between">
                              <IconButton disabled={isLoading} data-cy={ArticleModalIds.saveChangesButton}
                                onClick={() => HandleEditArticle(displayItem.id, currentTitle, currentText, currentUpdatedBy, currentUpdatedDate ?? {month: -1, day: -1, year: -1}, isIntegrityOnly)}>
                                <DoneIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                              {isLoading &&
                                <CircularProgress color={"warning"}/>
                              }
                              <IconButton disabled={isLoading} data-cy={ArticleModalIds.cancelChangesButton} onClick={() => HandleCancelEdit()}>
                                <CancelIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                            </div>
                          }
                          {
                            !isEdit && !InEditMode() && props.currentUser.companyId === IntegrityId &&
                            <div className="flex w-full justify-between">
                              <IconButton disabled={isLoading} data-cy={ArticleModalIds.editButton} onClick={() => EnterEditMode(displayItem.id, filteredArticles, false)}>
                                <EditIcon sx={{fontSize: "inherit"}}/>
                              </IconButton>
                              {isLoading && matched &&
                                <CircularProgress color={"warning"}/>
                              }
                            </div>
                          }
                      </StyledCardActions>
                    </StyledCard>
                  </Item>
                </Grid>
                )
              })
            }
            {
            filteredArticles.length === 0 && <Grid item className="mt-4 text-2xl font-bold">No articles to display.</Grid>
            }
          </Grid>
        </div>
        }
      </BaseInitiativeModal>
      <DocumentManagementModal articleWithDocsId={articleWithDocsId} company={props.company} currentUser={props.currentUser} isOpen={documentModalOpen} HandleClose={HandleClose}></DocumentManagementModal>
    </>
  );
}

