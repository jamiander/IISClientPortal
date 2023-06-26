import { Grid, IconButton, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { TableHeaderStyle, defaultRowStyle, tableButtonFontSize, tableCellFontSize, tableHeaderFontSize } from "../Styles";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Company, IntegrityId, selectAllCompanies, upsertCompanyInfo } from "../Store/CompanySlice";
import { enqueueSnackbar } from "notistack";
import { v4 } from "uuid";
import { ValidateCompany, ValidationFailedPrefix } from "../Services/Validation";
import { CompanyFilter } from "../Services/Filters";
import { selectCurrentUser } from "../Store/UserSlice";
import { AddButton } from "../Components/AddButton";
import { SearchBar } from "../Components/SearchBar";
import { Paginator } from "../Components/Paginator";
import { MakeClone } from "../Services/Cloning";
import { usePaginator } from "../Services/usePaginator";
import { ClientActionsMenu } from "../Components/ClientActionsMenu";
import { ActiveRadioSet } from "../Components/ActiveRadioSet";

export const ClientPageIds = {
  modal: "clientPageModal",
  closeModalButton: "clientPageModalCloseModalButton",
  addClientButton: "clientPageAddButton",
  editClientButton: "clientPageEditButton",
  saveClientChangesButton: "clientPageSaveChangesButton",
  cancelClientChangesButton: "clientPageCancelChangesButton",
  deleteButton: "clientPageDeleteButton",
  keywordFilter: "clientPageKeywordFilter",
  table: "clientPageTable",
  name: "clientPageName",
  editName: "clientPageEditName",
  radioIds: {
    active: "clientPageRadioActive",
    inactive: "clientPageRadioInactive",
    all: "clientPageRadioAll",
  },
  actionMenu: {
    menuButton: "clientPageMenuButton",
    articleButton: "clientPageArticlebutton",
    documentButton: "clientPageDocumentButton"
  }
}

export function ClientPage()
{
  enum State {
    start,
    add,
    edit
  }

  const dispatch = useAppDispatch();
  const allCompanies = useAppSelector(selectAllCompanies);
  const currentUser = useAppSelector(selectCurrentUser);

  const [state, setState] = useState<State>(State.start);
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [displayCompanies, setDisplayCompanies] = useState<Company[]>([]);
  const [companyToEdit, setCompanyToEdit] = useState<Company>();

  const [currentName, setCurrentName] = useState("");
  const [radioValue,setRadioValue] = useState("active");

  const paginator = usePaginator();

  const isIntegrityUser = currentUser?.companyId === IntegrityId;
  const isReadOnly = !isIntegrityUser || !currentUser?.isAdmin;

  useEffect(() => {
    const filteredCompanies = CompanyFilter(allCompanies,radioValue).filter(c =>  c.name?.toUpperCase().includes(searchedKeyword.toUpperCase()));
    filteredCompanies.sort((a: Company, b: Company) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    const paginatedCompanies = paginator.PaginateItems(filteredCompanies);
    setDisplayCompanies(paginatedCompanies);
    LeaveEditMode();
  },[allCompanies, radioValue, paginator.page, paginator.rowsPerPage, searchedKeyword]);

  useEffect(() => {
    if(!isIntegrityUser)
      setRadioValue("all");
  },[])

  function InEditMode()
  {
    return state === State.add || state === State.edit;
  }

  function EnterEditMode(companyId: string, companies: Company[], isNew: boolean)
  {
    if(state === State.start)
    {
      const foundCompany = companies.find(c => c.id === companyId);
      if(foundCompany)
      {
        setCompanyToEdit(foundCompany);
        setCurrentName(foundCompany.name);
        setState(isNew ? State.add : State.edit);
      }
    }
    else
      enqueueSnackbar("An edit is already in progress.",{variant:"error"});
  }

  function LeaveEditMode()
  {
    setState(State.start);
    setCompanyToEdit(undefined);
  }

  function HandleAddEmptyClient()
  {
    const newCompany: Company = {
      id: v4(),
      name: "",
      initiatives: []
    }
    let companiesClone = MakeClone(displayCompanies);
    companiesClone.unshift(newCompany);
    setDisplayCompanies(companiesClone);
    EnterEditMode(newCompany.id,companiesClone,true);
    setSearchedKeyword("");
  }

  async function HandleSaveEdit()
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let companyClone = MakeClone(companyToEdit);
    if(companyClone)
    {
      companyClone.name = currentName;

      const validation = ValidateCompany(companyClone,allCompanies);
      if(validation.success)
      {
          let saveMessage = "Changes have been saved.";
          await dispatch(upsertCompanyInfo({isTest: isTest, company: companyClone}));
          if(state === State.add)
          {
            saveMessage = "New client added!";
          }

          LeaveEditMode();
          enqueueSnackbar(saveMessage, {variant: "success"});
      }
      else
        enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
    }
  }

  function HandleCancelEdit()
  {
    if(state === State.add && companyToEdit)
    {
      const companiesWithoutEdit: Company[] = displayCompanies.filter(c => c.id !== companyToEdit.id);
      setDisplayCompanies(companiesWithoutEdit);
    }
    LeaveEditMode();
  }
  

  return (
    <>
    {currentUser &&
      <div className="mx-[2%] mb-2">
        <div className="flex flex-row justify-content:space-between">
          <Grid container sx={{ display: 'flex',
            placeItems: 'center',
            flexDirection: 'row',
            p: 1,
            mt: 2,
            mb: 1,
            ml: 2,
            mr: 2,
            borderRadius: 1, }}>
            <Grid item xs={3}
              sx={{ display: 'flex',
              justifyContent: 'flex-start'
              }}> 
              {isIntegrityUser &&
              <SearchBar cypressData={ClientPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in Name" value={searchedKeyword} setValue={setSearchedKeyword} />}
            </Grid>
            {isIntegrityUser &&
              <ActiveRadioSet cypressData={ClientPageIds.radioIds} name="clientPage" setRadioValue={setRadioValue} listItems={allCompanies} filterFunc={CompanyFilter}/>
            }
            {allCompanies.length !== 0 && !isReadOnly &&
            <Grid item xs={3}
              sx={{ display: 'flex',
              justifyContent: 'flex-end'
              }}>
              <AddButton cypressData={ClientPageIds.addClientButton} HandleClick={() => HandleAddEmptyClient()} disabled={InEditMode()}/> 
            </Grid>
            }
          </Grid>
        </div>
        <div className="col-span-1 py-2">
          <TableContainer elevation={12} component={Paper}>
            <Table className="table-auto w-full outline outline-3 bg-gray-100">
            <colgroup>
                <col style={{ width: '25vw' }} />
                <col style={{ width: '10vw' }} />
                {!isReadOnly &&
                  <col style={{ width: '15vw' }} />
                }
            </colgroup>
              <TableHead className="outline outline-1">
                <TableRow sx={{
                  borderBottom: "2px solid black",
                    "& th": {
                    fontSize: tableHeaderFontSize,
                    fontWeight: "bold",
                    fontFamily: "Arial, Helvetica"
                  }
                }}>
                  <TableHeaderStyle>Name</TableHeaderStyle>
                  <TableHeaderStyle>Actions</TableHeaderStyle>
                  {!isReadOnly &&
                    <TableHeaderStyle>Edit Client</TableHeaderStyle>
                  }
                </TableRow>
              </TableHead>
              <TableBody data-cy={ClientPageIds.table}>
                {displayCompanies.map((displayItem: Company, key: number) => {
                  const isEdit = InEditMode() && displayItem.id === companyToEdit?.id;
                  const clientActionsMenuProps = {
                    company: displayItem,
                    cypressData: ClientPageIds.actionMenu,
                    currentUser: currentUser
                  }
                  return (
                    <TableRow className={defaultRowStyle} sx={{
                      borderBottom: "1px solid black",
                      "& td": {
                        fontSize: tableCellFontSize,
                        fontFamily: "Arial, Helvetica",
                        color: "#21345b"
                      }
                    }}
                      key={key}
                    >
                      {isEdit ? 
                      <>
                        <TableCell><Input sx={{fontSize: tableCellFontSize}} data-cy={ClientPageIds.editName} value={currentName} onChange={e => setCurrentName(e.target.value)}/></TableCell>
                        <TableCell>
                          <ClientActionsMenu disabled={true} {...clientActionsMenuProps}/>
                        </TableCell>
                        <TableCell>
                          <IconButton data-cy={ClientPageIds.saveClientChangesButton} onClick={() => HandleSaveEdit()}>
                            <DoneIcon sx={{fontSize: tableButtonFontSize}}/>
                          </IconButton>
                          <IconButton data-cy={ClientPageIds.cancelClientChangesButton} onClick={() => HandleCancelEdit()}>
                            <CancelIcon sx={{fontSize: tableButtonFontSize}}/>
                          </IconButton>
                        </TableCell>
                      </>
                      : 
                      <>
                        <TableCell data-cy={ClientPageIds.name}>{displayItem.name}</TableCell>
                        <TableCell>
                          <ClientActionsMenu {...clientActionsMenuProps}/>
                        </TableCell>
                        {!isReadOnly &&
                        <TableCell>
                          <IconButton data-cy={ClientPageIds.editClientButton} disabled={InEditMode()} onClick={() => EnterEditMode(displayItem.id, displayCompanies, false)}>
                            <EditIcon sx={{fontSize: tableButtonFontSize}}/>
                          </IconButton>
                        </TableCell>
                        }
                      </>
                      }
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {currentUser?.companyId === IntegrityId &&
          <Paginator paginator={paginator}/>}
        </div>
      </div>
    }
    </>
  )
}
