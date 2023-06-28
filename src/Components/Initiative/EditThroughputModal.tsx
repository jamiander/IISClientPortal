import { useEffect, useRef, useState } from "react";
import { DateInfo, ThroughputData } from "../../Services/CompanyService";
import { Company, Initiative } from "../../Store/CompanySlice";
import { defaultRowStyle, TableHeaderStyle, tooltipStyle } from "../../Styles";
import { DateInput } from "../DateInput";
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { CircularProgress, Grid, IconButton, Input, Paper, TablePagination } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { ValidateCompanyAndInitiative, ValidateDate, ValidationFailedPrefix } from "../../Services/Validation";
import { enqueueSnackbar } from "notistack";
import { MakeClone } from "../../Services/Cloning";
import { CompareDateInfos, EqualDateInfos } from "../../Services/DateHelpers";
import { BaseInitiativeModal } from "./BaseInitiativeModal";
import { AddButton } from "../AddButton";

enum stateEnum {
  start,
  add,
  edit
}

export const EditThroughputIds = {
  modal: "editThroughputModal",
  selectCompany: "editThroughputCompanySelect",
  selectInitiative: "editThroughputInititia",
  addNewEntryButton: "editThroughputAdd",
  submitButton: "editThroughputSubmitButton",
  closeModalButton: "editThroughputCloseModalButton",
  addDate: "editThroughputAddDate",
  tableDate: "editThroughputTableDate",
  tableItemsComplete: "editThroughputTableItemsComplete",
  saveChangesButton: "editThroughputSaveChangesButton",
  cancelChangesButton: "editThroughputCancelChangesButton",
  editButton: "editThroughputEditButton"
}
  
interface ThroughputModalProps{
  allCompanies: Company[]
  company: Company
  initiative: Initiative
  isAdmin: boolean
  isOpen: boolean
  title: string
  HandleClose: () => void
  SubmitUpdateThroughput: (companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean) => Promise<boolean>
}

export default function EditThroughputModal(this: any, props: ThroughputModalProps){
  const invalidDate: DateInfo = {day: -1, month: -1, year: -1};
  const [currentItems, setCurrentItems] = useState<number>();
  const [currentDate, setCurrentDate] = useState<DateInfo>();
  const [state, setState] = useState(stateEnum.start);
  const [throughputToEdit, setThroughputToEdit] = useState<ThroughputData>();
  const [throughputList, setThroughputList] = useState<ThroughputData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setIsLoading(false);
    setCurrentDate(undefined);
    setCurrentItems(0);
    setState(stateEnum.start);
  },[props.isOpen]);

  useEffect(() => {
    const throughputClone = MakeClone(props.initiative.itemsCompletedOnDate);
    throughputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(b.date,a.date));
    setThroughputList(throughputClone);
  },[props.initiative]);

  function AddItem()
  {
    function CorrectPageOnAdd(throughputIndex: number)
    {
      const newPage = Math.floor(throughputIndex/rowsPerPage);
      setPage(newPage);
    }

    const validation = ValidateCompanyAndInitiative(props.allCompanies, props.company.id, props.initiative.id);
    if(!validation.success)
    {
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
      return;
    }
    
    const dateValidation = ValidateDate(currentDate);
    if(!dateValidation.success || !currentDate)
    {
      enqueueSnackbar(ValidationFailedPrefix + dateValidation.message, {variant: "error"});
      return;
    }

    const throughputClone = MakeClone(throughputList);
    if(!throughputClone)
    {
      enqueueSnackbar(ValidationFailedPrefix + "A valid initiative must be selected.", {variant: "error"});
      return;
    }

    let matchingThroughputIndex = throughputClone.findIndex(t => EqualDateInfos(t.date,currentDate));
    if(matchingThroughputIndex <= -1)
    {
      let newItem: ThroughputData = {date: currentDate, itemsCompleted: 1};
      
      throughputClone.unshift(newItem);
      throughputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(b.date,a.date));
      const newIndex = throughputClone.findIndex(t => EqualDateInfos(t.date,currentDate));
      CorrectPageOnAdd(newIndex);

      setThroughputList(throughputClone);
      EnterEditMode(newItem.date, throughputClone, true);
    }
    else
    {
      throughputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(b.date,a.date));
      const newIndex = throughputClone.findIndex(t => EqualDateInfos(t.date,currentDate));
      CorrectPageOnAdd(newIndex);

      setThroughputList(throughputClone);
      EnterEditMode(currentDate, throughputClone, false);
    }

    setTimeout(() => {
      throughputRef.current?.scrollIntoView()
    },1);
  }

  const InEditMode = () => state === stateEnum.edit || state === stateEnum.add;

  function EnterEditMode(date: DateInfo, throughputs: ThroughputData[], isNew: boolean)
  {
    if(!InEditMode())
    {
      let currentThroughput = throughputs.find(i => EqualDateInfos(i.date, date));
      if(currentThroughput)
      {
        setState(isNew ? stateEnum.add : stateEnum.edit);
        setThroughputToEdit(currentThroughput);
        setCurrentItems(currentThroughput.itemsCompleted);
      }
    }
  }

  function LeaveEditMode()
  {
    setState(stateEnum.start);
    setThroughputToEdit(undefined);
  }

  function CancelEdit() 
  {
    if(state === stateEnum.add && throughputToEdit)
    {
      let selectedThroughputClone: ThroughputData[] = throughputList.filter(t => t.date !== throughputToEdit.date);
      setThroughputList(selectedThroughputClone);
    }
    LeaveEditMode();
  }

  async function SaveEdit()
  {
    if(throughputToEdit)
    {
      const selectedThroughputClone = MakeClone(throughputList);
      let newItem = selectedThroughputClone.find(t => EqualDateInfos(t.date, throughputToEdit.date));
      if(newItem)
      {
        newItem.itemsCompleted = currentItems ?? -1;
        setIsLoading(true);
        const successful = await props.SubmitUpdateThroughput(props.company.id, props.initiative.id, selectedThroughputClone, false);
        if(successful)
        {
          selectedThroughputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(b.date,a.date));
          setThroughputList(selectedThroughputClone);
          LeaveEditMode();
        }
        setIsLoading(false);
      }
    }
  }

  const indexOfLastItem = (page+1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentThroughputList = throughputList.slice(indexOfFirstItem, indexOfLastItem);

  const throughputRef = useRef<HTMLElement>(null);
  
  return(
    <BaseInitiativeModal
      data-cy={EditThroughputIds.modal}
      open={props.isOpen}
      onClose={() => props.HandleClose()}
      cypressData={{modal: EditThroughputIds.modal, closeModalButton: EditThroughputIds.closeModalButton}}
      title={props.title}
      subtitle={`${props.company.name}${props.initiative ? ` - ${props.initiative.title}` : ``}`}
      maxWidth="md"
      >
      {props.isAdmin &&
      <div className="mb-4">
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
            <Grid item xs={4} sx={{ display: 'flex',
                justifyContent: 'flex-start'}}>
              <DateInput cypressData={EditThroughputIds.addDate} label={"New Date"} disabled={InEditMode()} date={currentDate} setDate={setCurrentDate}/>
            </Grid>
            <Grid item xs={4} sx={{ display: "flex",
              justifyContent: "center"}}>
              {isLoading &&
                <CircularProgress color={"warning"}/>
              }
            </Grid>
            <Grid item xs={4} sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <AddButton cypressData={EditThroughputIds.addNewEntryButton} disabled={InEditMode() || !currentDate} HandleClick={AddItem}/>
            </Grid>
          </Grid>
        </div>
      </div>
      }
      <div className="outline outline-[#879794] rounded space-y-2 p-2">
        <div className="rounded overflow-y-auto max-h-60">
          <TableContainer component={Paper} >
            <Table className="table-auto text-[#21345b] w-full outline outline-3 bg-gray-100">
              <TableHead>
                <TableRow sx={{
                          borderBottom: "2px solid black",
                            "& th": {
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              fontFamily: "Arial, Helvetica"
                            }
                          }}>
                  <TableHeaderStyle>Date</TableHeaderStyle>
                  <TableHeaderStyle>Items Completed</TableHeaderStyle>
                  {props.isAdmin &&
                    <TableHeaderStyle>Edit</TableHeaderStyle>
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {currentThroughputList.map((throughput, key) => {
                  let isEdit = InEditMode() && EqualDateInfos(throughput.date,throughputToEdit?.date ?? invalidDate);
                  return (
                    <TableRow key={key} className={defaultRowStyle} sx={{
                      borderBottom: "1px solid black",
                        "& td": {
                          fontSize: "1rem",
                          fontFamily: "Arial, Helvetica" 
                        }
                      }}>
                      {isEdit ?
                        <>
                          <TableCell className="border border-spacing-x-0 border-y-gray-700">
                            {
                              <p className="px-2 w-full bg-inherit focus:outline-none" data-cy={EditThroughputIds.tableDate}>{throughput.date.month + "/" + throughput.date.day + "/" + throughput.date.year}</p> 
                            }
                          </TableCell>
                          <TableCell className={tooltipStyle}>
                            <Input className="px-2 w-full bg-inherit focus:outline-none" data-cy={EditThroughputIds.tableItemsComplete} type="number" value={currentItems}
                            onChange={(e) => setCurrentItems(parseInt(e.target.value))}/>
                          </TableCell>
                          <TableCell ref={throughputRef}>
                            <IconButton disabled={isLoading} data-cy={EditThroughputIds.saveChangesButton} onClick={() => SaveEdit()}>
                              <DoneIcon />
                            </IconButton>
                            <IconButton disabled={isLoading} data-cy={EditThroughputIds.cancelChangesButton} onClick={() => CancelEdit()}>
                              <CancelIcon />
                            </IconButton>
                          </TableCell>
                        </>
                        :
                        <>
                          <TableCell className="border border-spacing-x-0 border-y-gray-700">
                            <p className="px-2 w-full bg-inherit focus:outline-none" data-cy={EditThroughputIds.tableDate}>{throughput.date.month + "/" + throughput.date.day + "/" + throughput.date.year}</p> 
                          </TableCell>
                          <TableCell>
                            <input disabled className="px-2 w-full bg-inherit focus:outline-none" data-cy={EditThroughputIds.tableItemsComplete} type="number" min="0" value={throughput.itemsCompleted}/>
                          </TableCell>
                          {props.isAdmin &&
                            <TableCell>
                              <IconButton data-cy={EditThroughputIds.editButton} disabled={InEditMode() || isLoading} onClick={() => EnterEditMode(throughput.date, throughputList, false)}>
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                          }
                        </>
                      }
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <TablePagination
          component="div"
          count={throughputList.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </div>
    </BaseInitiativeModal>
  )
}
