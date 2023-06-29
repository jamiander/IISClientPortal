import { Grid, CircularProgress, IconButton, Checkbox, Button, Typography, TextField, Divider } from "@mui/material";
import { DateInfo } from "../../Services/CompanyService";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { Item, StyledCard, StyledCardContent, labelStyle, StyledTextarea, StyledCardActions, StyledTextField } from "../../Styles";
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
import { ReactQuillWrapper } from "./ReactQuillWrapper";
import { DateToDateInfo, MakeDateString } from "../../Services/DateHelpers";
import ReactQuill from "react-quill";
import { ArticleCard } from "./ArticleCard";

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
  grid: "articleModalGrid",
  documents: "articleModalDocuments"
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
    const [isIntegrityOnly, setIsIntegrityOnly] = useState(false);
    const [selectedInitiative, setSelectedInitiative] = useState<Initiative>();
    const [selectedCompany, setSelectedCompany] = useState<Company>(props.company);
    const [articleToEdit, setArticleToEdit] = useState<Article>();

    const InEditMode = () => modalState === stateEnum.edit || modalState === stateEnum.add;
    const [searchedKeyword, setSearchedKeyword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingModal, setLoadingModal] = useState(true);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [documentModalOpen, setDocumentModalOpen] = useState(false);
    const [articleWithDocsId, setArticleWithDocsId] = useState("");

    let userHasPermission = props.currentUser.companyId === IntegrityId;

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
      setIsSubmitting(false);
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
          setIsIntegrityOnly(currentArticle.isIntegrityOnly);
        }
      }
    }

    async function HandleEditArticle(id: string, newTitle: string, newText: string, newIsIntegrityOnly: boolean) {
      let selectedArticlesClone: Article[] = MakeClone(filteredArticles);
      let newArticle = selectedArticlesClone.find(a => a.id === id);
      if(newArticle)
      {
        newArticle.title = newTitle;
        newArticle.text = newText;
        newArticle.updatedBy = props.currentUser.name ?? props.currentUser.email;
        newArticle.updatedDate = DateToDateInfo(new Date());
        newArticle.isIntegrityOnly = newIsIntegrityOnly;

        setIsSubmitting(true);
        let successfulSubmit = await SubmitArticle(newArticle);
        if(successfulSubmit)
          setFilteredArticles(selectedArticlesClone);
        setIsSubmitting(false);
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
                {isSubmitting &&
                  <CircularProgress color={"warning"}/>
                }
                {!isSubmitting && filteredArticles.length === 0 &&
                  <p className="m-2 p-2 text-2xl font-bold">There are no articles to display</p>
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
                  <ArticleCard article={displayItem} currentUser={props.currentUser} isEditingAnyone={InEditMode()} isEditingMe={isEdit}
                    currentTitle={currentTitle} setCurrentTitle={setCurrentTitle} currentText={currentText} setCurrentText={setCurrentText}
                    isIntegrityOnly={isIntegrityOnly} setIsIntegrityOnly={setIsIntegrityOnly} isSubmitting={isSubmitting}
                    HandleDocButton={() => {setDocumentModalOpen(true); setArticleWithDocsId(displayItem.id)}}
                    HandleStartEdit={() => EnterEditMode(displayItem.id, filteredArticles, false)}
                    HandleCancelEdit={() => HandleCancelEdit()}
                    HandleSubmit={() => HandleEditArticle(displayItem.id, currentTitle, currentText, isIntegrityOnly)}
                  />
                </Grid>
                )
              })
            }
          </Grid>
        </div>
        }
        {loadingModal &&
          <div className="flex justify-center">
            <CircularProgress color="warning"/>
          </div>
        }
      </BaseInitiativeModal>
      <DocumentManagementModal articleWithDocsId={articleWithDocsId} userHasPermission={userHasPermission} company={props.company} currentUser={props.currentUser} title={"Related Documentation"} isOpen={documentModalOpen} HandleClose={HandleClose}></DocumentManagementModal>
    </>
  );
}

