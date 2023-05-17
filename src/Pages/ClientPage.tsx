import { Checkbox, IconButton, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { StyledTextField, TableHeaderStyle, defaultRowStyle, yellowButtonStyle } from "../Styles";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Company, Initiative, selectAllCompanies, upsertCompanyInfo, upsertInitiativeInfo } from "../Store/CompanySlice";
import { enqueueSnackbar } from "notistack";
import { v4 } from "uuid";
import ValidateNewInitiative, { ValidateCompany, Validation, ValidationFailedPrefix } from "../Services/Validation";
import { UpdateInitiativeListModal } from "../Components/Initiative/UpdateInitiativeListModal";
import { DateInfo } from "../Services/CompanyService";
import { DateToDateInfo, MakeDateInfo } from "../Components/DateInput";

export const ClientPageIds = {
  modal: "clientPageModal",
  closeModalButton: "clientPageModalCloseModalButton",
  email: "clientPageEmail",
  password: "clientPagePassword",
  initiativeIds: "clientPageInitiativeIds",
  name: "clientPageName",
  phone: "clientPagePhone",
  isAdmin: "adminEditIsAdmin",
  isActive: "clientPageIsActive",
  addClientButton: "clientPageAddButton",
  editClientButton: "clientPageEditButton",
  saveClientChangesButton: "clientPageSaveChangesButton",
  cancelClientChangesButton: "clientPageCancelChangesButton",
  deleteButton: "clientPageDeleteButton",
  keywordFilter: "clientPageKeywordFilter",
  table: "clientPageTable"
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

  const [state, setState] = useState<State>(State.start);
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [displayCompanies, setDisplayCompanies] = useState<Company[]>([]);
  const [companyToEdit, setCompanyToEdit] = useState<Company>();

  const [currentName, setCurrentName] = useState("");
  const [currentInitiativeTitle, setCurrentInitiativeTitle] = useState("");

  useEffect(() => {
    const companiesClone: Company[] = JSON.parse(JSON.stringify(allCompanies));
    companiesClone.sort((a: Company, b: Company) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    setDisplayCompanies(companiesClone);
  },[allCompanies]);

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
        setCurrentInitiativeTitle("");
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
    let companiesClone: Company[] = JSON.parse(JSON.stringify(displayCompanies));
    companiesClone.unshift(newCompany);
    setDisplayCompanies(companiesClone);
    EnterEditMode(newCompany.id,companiesClone,true);
  }

  async function HandleSaveEdit()
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let companyClone: Company = JSON.parse(JSON.stringify(companyToEdit));
    companyClone.name = currentName;

    const today = new Date();
    const todayInfo = DateToDateInfo(today);
    let newInitiative: Initiative = {
      id: v4(),
      title: currentInitiativeTitle,
      targetDate: todayInfo,
      startDate: todayInfo,
      totalItems: 0,
      itemsCompletedOnDate: [],
      decisions: []
    }

    const validation = ValidateCompany(companyClone,displayCompanies);
    if(validation.success)
    {
      const initiativeValidation: Validation = 
        state === State.add ? ValidateNewInitiative(newInitiative,companyClone.id,[companyClone]) : {message: "There was no initiative to validate.", success: true};

      if(initiativeValidation.success)
      {
        let saveMessage = "Changes have been saved.";
        await dispatch(upsertCompanyInfo({isTest: isTest, company: companyClone}));
        if(state === State.add)
        {
          saveMessage = "New client added!";
          dispatch(upsertInitiativeInfo({isTest: isTest, initiative: newInitiative, companyId: companyClone.id}));
        }

        LeaveEditMode();
        enqueueSnackbar(saveMessage, {variant: "success"});
      }
      else
        enqueueSnackbar(ValidationFailedPrefix + initiativeValidation.message, {variant: "error"});
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
  }

  function HandleCancelEdit()
  {
    if(state === State.add && companyToEdit)
    {
      const companiesClone: Company[] = displayCompanies.filter(c => c.id !== companyToEdit.id);
      setDisplayCompanies(companiesClone);
    }
    LeaveEditMode();
  }

  return (
    <>
      <div className="flex col-span-4 bg-[#2ed7c3] rounded-md py-6 px-5">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl font-bold w-full">Client Management</p>
          </div>
        </div>
      </div>
      <div className="mx-[2%] mb-[2%]">
        {allCompanies.length !== 0 &&
          <div className="mt-2 mb-4">
            <StyledTextField className="w-1/2" id={ClientPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name or email" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)} />
          </div>
        }
        <div className="flex flex-col justify-between">
          <button disabled={InEditMode()} id={ClientPageIds.addClientButton} className={yellowButtonStyle} onClick={() => HandleAddEmptyClient()}>Add Client</button>
        </div>
        <div className="col-span-1 py-[2%]">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <TableContainer component={Paper}>
            <Table className="table-auto w-full outline outline-3 bg-gray-100">
            <colgroup>
                <col style={{ width: '7%' }} />
                <col style={{ width: '17%' }} />
            </colgroup>
              <TableHead className="outline outline-1">
                <TableRow sx={{
                  borderBottom: "2px solid black",
                    "& th": {
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    fontFamily: "Arial, Helvetica"
                  }
                }}>
                  <TableHeaderStyle>Edit Client</TableHeaderStyle>
                  <TableHeaderStyle>Name</TableHeaderStyle>
                  {state === State.add &&
                    <TableHeaderStyle>New Initiative Name</TableHeaderStyle>
                  }
                </TableRow>
              </TableHead>
              <TableBody id={ClientPageIds.table}>
                {displayCompanies.filter(c =>  c.name?.toUpperCase().includes(searchedKeyword.toUpperCase()))
                  .map((displayItem: Company, key: number) => {
                  let isEdit = InEditMode() && displayItem.id === companyToEdit?.id;
                  return (
                    <TableRow className={defaultRowStyle} sx={{
                      borderBottom: "1px solid black",
                      "& td": {
                        fontSize: "1.1rem",
                        fontFamily: "Arial, Helvetica"
                      }
                    }}
                      key={key}
                    >
                      {isEdit ? 
                      <>
                        <TableCell>
                          <IconButton id={ClientPageIds.saveClientChangesButton} onClick={() => HandleSaveEdit()}>
                            <DoneIcon />
                          </IconButton>
                          <IconButton id={ClientPageIds.cancelClientChangesButton} onClick={() => HandleCancelEdit()}>
                            <CancelIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell><Input id={ClientPageIds.name} value={currentName} onChange={e => setCurrentName(e.target.value)}/></TableCell>
                        {state === State.add &&
                          <TableCell>
                            <Input value={currentInitiativeTitle} onChange={e => setCurrentInitiativeTitle(e.target.value)}/>
                          </TableCell>
                        }
                        {/*
                        <TableCell><Input id={ClientPageIds.email} value={currentEmail} onChange={e => setCurrentEmail(e.target.value)}/></TableCell>
                        <TableCell><Input id={ClientPageIds.password} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/></TableCell>
                        <TableCell><Input id={ClientPageIds.phone} value={currentPhone} onChange={e => setCurrentPhone(e.target.value)}/></TableCell>
                        <TableCell><Checkbox id={ClientPageIds.isAdmin} checked={currentIsAdmin} onChange={e => setCurrentIsAdmin(e.target.checked)}/>Admin</TableCell>
                        <TableCell><Checkbox id={ClientPageIds.isActive} checked={currentIsActive} onChange={e => setCurrentIsActive(e.target.checked)}/>Active</TableCell>
                        <TableCell id={ClientPageIds.initiativeIds}></TableCell>
                        */}
                      </>
                      : 
                      <>
                        <TableCell>
                          <IconButton id={ClientPageIds.editClientButton} disabled={InEditMode()} onClick={() => EnterEditMode(displayItem.id, displayCompanies, false)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                        
                        <TableCell id={ClientPageIds.name}>{displayItem.name}</TableCell>
                        {/*
                        <TableCell id={ClientPageIds.email}>{displayItem.email}</TableCell>
                        <TableCell id={ClientPageIds.password}>{displayItem.password}</TableCell>
                        <TableCell id={ClientPageIds.phone}>{displayItem.phoneNumber}</TableCell>
                        <TableCell id={ClientPageIds.isAdmin}>{displayItem.isAdmin ? "Admin" : "User"}</TableCell>
                        <TableCell id={ClientPageIds.isActive}>{displayItem.isActive ? "Active" : "Inactive"}</TableCell>
                        <TableCell id={ClientPageIds.initiativeIds}><EditUserInitiativesButton user={displayItem} allCompanies={sortedCompanies} SubmitUserData={SubmitUserData}/></TableCell>
                        */}
                      </>
                      }
                    </TableRow>
                    
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  )
}
