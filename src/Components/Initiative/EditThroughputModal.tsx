import { useEffect, useRef, useState } from "react";
import { DateInfo, ThroughputData } from "../../Services/CompanyService";
import { Company, Initiative } from "../../Store/CompanySlice";
import { cancelButtonStyle, defaultRowStyle, modalStyle, submitButtonStyle, TableHeaderStyle, tooltipStyle } from "../../Styles";
import { CompareDateInfos, DateInput, EqualDateInfos } from "../DateInput";
import Modal from "react-modal";
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { IconButton, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { ValidateCompanyAndInitiative, ValidateDate, ValidationFailedPrefix } from "../../Services/Validation";
import { enqueueSnackbar } from "notistack";
import { MakeClone } from "../../Services/Cloning";

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
  closeButton: "editThroughputCloseButton",
  addDate: "editThroughputAddDate",
  //addItemsComplete: "editThroughputAddItemsComplete",
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
  editIsOpen: boolean
  setEditIsOpen: (value: boolean) => void
  Submit: (companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean) => Promise<boolean>
}

export default function EditThroughputModal(this: any, props: ThroughputModalProps){
  const [dateWarning, setDateWarning] = useState("");
  const invalidDate: DateInfo = {day: NaN, month: NaN, year: NaN};
  const [currentItems, setCurrentItems] = useState<number>();
  const [currentDate, setCurrentDate] = useState<DateInfo>();
  const [state, setState] = useState(stateEnum.start);
  const [throughputToEdit, setThroughputToEdit] = useState<ThroughputData>();
  const [throughputList, setThroughputList] = useState<ThroughputData[]>([]);

  useEffect(() => {
    setDateWarning("");
    setCurrentDate(undefined);
    setCurrentItems(0);
    setState(stateEnum.start);
  },[props.editIsOpen]);

  useEffect(() => {
      const throughputClone = MakeClone(props.initiative.itemsCompletedOnDate);
      throughputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(b.date,a.date));
      setThroughputList(throughputClone);
  },[props.initiative]);

  function AddItem()
  {
    const validation = ValidateCompanyAndInitiative(props.allCompanies, props.company.id, props.initiative.id);
    if(validation.success)
    {
      const dateValidation = ValidateDate(currentDate);
      if(dateValidation.success && currentDate)
      {
        const throughputClone = MakeClone(props.initiative.itemsCompletedOnDate);
        if(throughputClone)
        {
          const matchingThroughput = throughputClone.find(t => EqualDateInfos(t.date,currentDate));
          if(matchingThroughput === undefined)
          {
            let newItem: ThroughputData = {date: currentDate, itemsCompleted: 1};
            
            throughputClone.unshift(newItem);
            throughputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(b.date,a.date));
            setThroughputList(throughputClone);
            EnterEditMode(newItem.date, throughputClone, true);
          }
          else
          {
            EnterEditMode(matchingThroughput.date, throughputClone, false);
          }

          setTimeout(() => {
            throughputRef.current?.scrollIntoView()
          },1);
        }
        else
          enqueueSnackbar(ValidationFailedPrefix + "A valid initiative must be selected.", {variant: "error"});
      }
      else
        enqueueSnackbar(ValidationFailedPrefix + dateValidation.message, {variant: "error"});
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
  }

  const InEditMode = () => state === stateEnum.edit || state === stateEnum.add;

  function EnterEditMode(date: DateInfo, throughputs: ThroughputData[], isNew: boolean)
  {
    if(!InEditMode())
    {
      let currentThroughput = throughputs.find(i => i.date === date);
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
        const successful = await props.Submit(props.company.id, props.initiative.id, selectedThroughputClone, false);
        if(successful)
        {
          selectedThroughputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(b.date,a.date));
          setThroughputList(selectedThroughputClone);
          LeaveEditMode();
        }
      }
    }
  }

  function Close()
  {
    props.setEditIsOpen(false);
  }

  const throughputRef = useRef<HTMLElement>(null);
  
  return(
    <Modal
      
      isOpen={props.editIsOpen}
      onRequestClose={()=>props.setEditIsOpen(false)}
      style={{'content': {...modalStyle.content, 'width' : 'fit-content', 'height' : 'fit-content'}}}
      appElement={document.getElementById('root') as HTMLElement}>
      <div className="space-y-5" data-cy={EditThroughputIds.modal}>
        <p className="text-3xl w-full">Edit Throughput Data</p>
        <DateInput cypressData={EditThroughputIds.addDate} disabled={InEditMode()} date={currentDate} setDate={setCurrentDate}/>
          {dateWarning}
        <button data-cy={EditThroughputIds.addNewEntryButton} className={submitButtonStyle + " h-full"} disabled={InEditMode()}
          onClick={() => AddItem()}>Add New</button>
        <div className="outline outline-[#879794] rounded space-y-2 p-2">
          <div>
            <p className="text-2xl">Edit Data</p>
          </div>
          <div className="rounded overflow-y-auto max-h-60">
            <TableContainer component={Paper} >
              <Table className="table-auto text-[#21345b] w-full outline outline-3 bg-gray-100">
                <TableHead className="outline outline-1">
                  <TableRow sx={{
                            borderBottom: "2px solid black",
                              "& th": {
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                fontFamily: "Arial, Helvetica" 
                              }
                            }}>
                    <TableHeaderStyle>Edit</TableHeaderStyle>
                    <TableHeaderStyle>Date</TableHeaderStyle>
                    <TableHeaderStyle>Items Completed</TableHeaderStyle>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {throughputList.map((throughput, key) => {
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
                            <TableCell ref={throughputRef}>
                              <IconButton data-cy={EditThroughputIds.saveChangesButton} onClick={() => SaveEdit()}>
                                <DoneIcon />
                              </IconButton>
                              <IconButton data-cy={EditThroughputIds.cancelChangesButton} onClick={() => CancelEdit()}>
                                <CancelIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell className="border border-spacing-x-0 border-y-gray-700">
                              {
                                <p className="px-2 w-full bg-inherit focus:outline-none" data-cy={EditThroughputIds.tableDate}>{throughput.date.month + "/" + throughput.date.day + "/" + throughput.date.year}</p> 
                              }
                              </TableCell>
                            <TableCell className={tooltipStyle}>
                              <input className="px-2 w-full bg-inherit focus:outline-none" data-cy={EditThroughputIds.tableItemsComplete} type="number" min="0" value={currentItems}
                              onChange={(e) => setCurrentItems(parseInt(e.target.value))}/>
                            </TableCell>
                          </>
                          :
                          <>
                            <TableCell>
                            <IconButton data-cy={EditThroughputIds.editButton} disabled={InEditMode()} onClick={() => EnterEditMode(throughput.date, throughputList, false)}>
                              <EditIcon />
                            </IconButton>
                            </TableCell>
                            <TableCell className="border border-spacing-x-0 border-y-gray-700">
                              <p className="px-2 w-full bg-inherit focus:outline-none" data-cy={EditThroughputIds.tableDate}>{throughput.date.month + "/" + throughput.date.day + "/" + throughput.date.year}</p> 
                            </TableCell>
                            <TableCell className={tooltipStyle}>
                              <input disabled className="px-2 w-full bg-inherit focus:outline-none" data-cy={EditThroughputIds.tableItemsComplete} type="number" min="0" value={throughput.itemsCompleted}/>
                            </TableCell>
                          </>
                        }
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="h-10 w-full flex justify-between">
          <button data-cy={EditThroughputIds.closeButton} className={cancelButtonStyle} onClick={() => Close()}>Close</button> 
        </div>
      </div>
    </Modal>
  )
}
