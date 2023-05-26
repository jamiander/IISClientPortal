import { Divider, IconButton, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { StyledTextField, TableHeaderStyle, defaultRowStyle, genericButtonStyle, yellowButtonStyle } from "../Styles";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Company, Initiative, selectAllCompanies, upsertCompanyInfo, upsertInitiativeInfo } from "../Store/CompanySlice";
import { enqueueSnackbar } from "notistack";
import { v4 } from "uuid";
import ValidateNewInitiative, { ValidateCompany, Validation, ValidationFailedPrefix } from "../Services/Validation";
import { DateInput, DateToDateInfo, MakeDateString } from "../Components/DateInput";
import { RadioSet } from "../Components/RadioSet";
import { CompanyFilter } from "../Services/Filters";
import { useNavigate } from "react-router-dom";
import { DateInfo } from "../Services/CompanyService";
import { DocumentManagementButton } from "../Components/Documents/DocumentManagementButton";

export const ClientPageIds = {
  modal: "clientPageModal",
  closeModalButton: "clientPageModalCloseModalButton",
  name: "clientPageName",
  initiativeTitle: "clientPageInitiativeTitle",
  addClientButton: "clientPageAddButton",
  editClientButton: "clientPageEditButton",
  saveClientChangesButton: "clientPageSaveChangesButton",
  cancelClientChangesButton: "clientPageCancelChangesButton",
  deleteButton: "clientPageDeleteButton",
  keywordFilter: "clientPageKeywordFilter",
  table: "clientPageTable",
  targetDate: "clientPageTargetDate",
  totalItems: "clientPageTotalItems",
  radioIds: {
    active: "clientPageRadioActive",
    inactive: "clientPageRadioInactive",
    all: "clientPageRadioAll",
  },

}

export function ClientPage()
{
  enum State {
    start,
    add,
    edit
  }

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const allCompanies = useAppSelector(selectAllCompanies);
  const today = new Date();
  const todayInfo = DateToDateInfo(today);

  const [state, setState] = useState<State>(State.start);
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [displayCompanies, setDisplayCompanies] = useState<Company[]>([]);
  const [companyToEdit, setCompanyToEdit] = useState<Company>();

  const [currentName, setCurrentName] = useState("");
  const [currentInitiativeTitle, setCurrentInitiativeTitle] = useState("");
  const [currentTargetDate, setCurrentTargetDate] = useState<DateInfo>();
  const [currentTotalItems, setCurrentTotalItems] = useState<number>();
  const [radioValue,setRadioValue] = useState("active");

  useEffect(() => {
    const companiesClone: Company[] = CompanyFilter(allCompanies,radioValue);
    companiesClone.sort((a: Company, b: Company) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    setDisplayCompanies(companiesClone);
    LeaveEditMode();
  },[allCompanies, radioValue]);

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
    if(state === State.add) 
    {
      setCurrentTargetDate(todayInfo);
      setCurrentTotalItems(1);
    }
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
    setSearchedKeyword("");
  }

  async function HandleSaveEdit()
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    let companyClone: Company = JSON.parse(JSON.stringify(companyToEdit));
    companyClone.name = currentName;

    let newInitiative: Initiative = {
      id: v4(),
      title: currentInitiativeTitle,
      targetDate: currentTargetDate ?? todayInfo,
      startDate: todayInfo,
      totalItems: currentTotalItems ?? 1,
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
      <div className="flex col-span-4 bg-[#69D5C3] py-6 px-5">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl text-[#21345b] font-bold w-full">Client Management</p>
          </div>
        </div>
      </div>
      <div className="mx-[2%] mb-[2%]">
        <RadioSet dark={true} setter={setRadioValue} name="clientPage" options={[
          {id: ClientPageIds.radioIds.all, label: "Show All", value: "all"},
          {id: ClientPageIds.radioIds.active, label: "Only Active", value: "active", default: true},
          {id: ClientPageIds.radioIds.inactive, label: "Only Inactive", value: "inactive"}
        ]} />
        {allCompanies.length !== 0 &&
          <div className="mt-2 mb-4">
            <StyledTextField className="w-1/2" id={ClientPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)} />
          </div>
        }
        <div className="flex flex-col justify-between">
          <div className="space-x-2 flex flex-wrap">
            <button disabled={InEditMode()} id={ClientPageIds.addClientButton} className={yellowButtonStyle} onClick={() => HandleAddEmptyClient()}>Add Client</button>
            <button className={yellowButtonStyle} onClick={() => navigate("/Initiatives")}>Initiatives Page</button>
          </div>
        </div>
        <div className="col-span-1 py-[2%]">
          <TableContainer elevation={10} component={Paper}>
            <Table className="table-auto w-full outline outline-3 bg-gray-100">
            <colgroup>
                <col style={{ width: '25%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '10%' }} />
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
                  <TableHeaderStyle>Name</TableHeaderStyle>
                  <TableHeaderStyle>First Initiative Name</TableHeaderStyle>
                  <TableHeaderStyle>First Initiative Target Completion Date</TableHeaderStyle>
                  <TableHeaderStyle>First Initiative Total Items</TableHeaderStyle>
                  <TableHeaderStyle>Documents</TableHeaderStyle>
                  <TableHeaderStyle>Edit Client</TableHeaderStyle>
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
                        fontFamily: "Arial, Helvetica",
                        color: "#21345b"
                      }
                    }}
                      key={key}
                    >
                      {isEdit ? 
                      <>
                        <TableCell><Input id={ClientPageIds.name} value={currentName} onChange={e => setCurrentName(e.target.value)}/></TableCell>
                        {state === State.add &&
                          <>
                            <TableCell>
                              <Input id={ClientPageIds.initiativeTitle} value={currentInitiativeTitle} onChange={e => setCurrentInitiativeTitle(e.target.value)} />
                            </TableCell>
                            <TableCell>
                              <DateInput date={currentTargetDate} setDate={setCurrentTargetDate} id={ClientPageIds.targetDate}></DateInput>
                            </TableCell>
                            <TableCell>
                              <Input type='number' value={currentTotalItems} onChange={e => setCurrentTotalItems(parseInt(e.target.value))}/>
                            </TableCell>
                            
                          </>
                        }
                        {state !== State.add &&
                          <>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </>
                        }
                        <TableCell>
                          <DocumentManagementButton disabled={true} company={displayItem}/>
                        </TableCell>
                        <TableCell>
                          <IconButton id={ClientPageIds.saveClientChangesButton} onClick={() => HandleSaveEdit()}>
                            <DoneIcon />
                          </IconButton>
                          <IconButton id={ClientPageIds.cancelClientChangesButton} onClick={() => HandleCancelEdit()}>
                            <CancelIcon />
                          </IconButton>
                        </TableCell>
                      </>
                      : 
                      <>
                        <TableCell id={ClientPageIds.name}>{displayItem.name}</TableCell>
                        <TableCell id={ClientPageIds.initiativeTitle}>{displayItem.initiatives.at(0)?.title}</TableCell>
                        <TableCell id={ClientPageIds.name}>{displayItem.initiatives.at(0) !== undefined ? (displayItem.initiatives.at(0)!.targetDate.month + "/" + displayItem.initiatives.at(0)!.targetDate.day + "/" + displayItem.initiatives.at(0)!.targetDate.year) : ""}</TableCell>
                        <TableCell id={ClientPageIds.name}>{displayItem.initiatives.at(0)?.totalItems}</TableCell>
                        <TableCell>
                          <DocumentManagementButton company={displayItem}/>
                        </TableCell>
                        <TableCell>
                          <IconButton id={ClientPageIds.editClientButton} disabled={InEditMode()} onClick={() => EnterEditMode(displayItem.id, displayCompanies, false)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
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
