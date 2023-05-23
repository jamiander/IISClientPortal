import { useEffect, useState } from "react";
import { DateInfo, ThroughputData } from "../../Services/CompanyService";
import { Company, Initiative } from "../../Store/CompanySlice";
import { cancelButtonStyle, defaultRowStyle, inputStyle, modalStyle, submitButtonStyle, TableHeaderStyle, tooltipStyle } from "../../Styles";
import SelectCompanyAndInitiative from "./SelectCompanyAndInitiative";
import { CompareDateInfos, DateInput, DateToDateInfo, EqualDateInfos } from "../DateInput";
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
import { ValidateEditThroughputData, ValidateFileThroughputData, ValidationFailedPrefix } from "../../Services/Validation";
import { enqueueSnackbar } from "notistack";

enum stateEnum {
  start,
  add,
  edit
}

export const EditThroughputIds = {
  modal: "editThroughputModal",
  selectCompany: "editThroughputCompanySelect",
  selectInitiative: "editThroughputInititia",
  addEntrySubmitButton: "editThroughputAdd",
  submitButton: "editThroughputSubmitButton",
  closeButton: "editThroughputCloseButton",
  addDate: "editThroughputAddDate",
  addItemsComplete: "editThroughputAddItemsComplete",
  tableDate: "editThroughputTableDate",
  tableItemsComplete: "editThroughputTableItemsComplete",
  saveChangesButton: "saveChangesButton",
  cancelChangesButton: "cancelChangesButton"
}
  
interface ThroughputModalProps{
  companyList: Company[],
  editIsOpen: boolean,
  setEditIsOpen: (value: boolean) => void,
  Submit: (companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean) => boolean
}

export default function EditThroughputModal(this: any, props: ThroughputModalProps){
  const [selectedCompany, setSelectedCompany] = useState<Company>();
  const [selectedInitiativeIndex, setSelectedInitiativeIndex] = useState(-1);
  const [dateWarning, setDateWarning] = useState("");
  const todayInfo: DateInfo = DateToDateInfo(new Date);
  const [entryDate, setEntryDate] = useState<DateInfo>(todayInfo);
  const [itemsCompleted, setItemsCompleted] = useState(-1);
  const [currentItems, setCurrentItems] = useState<number>();
  const [currentDate, setCurrentDate] = useState<DateInfo>();
  const [state, setState] = useState(stateEnum.start);
  const [throughputToEdit, setThroughputToEdit] = useState<ThroughputData>();
  const [throughputList, setThroughputList] = useState<ThroughputData[]>([]);

  useEffect(() => {
    setSelectedCompany(undefined);
    setSelectedInitiativeIndex(-1);
    setDateWarning("");
    setEntryDate(todayInfo);
    setItemsCompleted(-1);
    setState(stateEnum.start);
  },[props.editIsOpen])

  useEffect(() => {
    let warningMessage = "";
    let initiative = selectedCompany?.initiatives[selectedInitiativeIndex];
    if(initiative)
    {
      let dates = initiative.itemsCompletedOnDate;
      if(dates)
      {
        let dateExists = false;
        let existingItems = -1;
        for(let i = 0; i < dates.length; i++)
        {
          if(EqualDateInfos(dates[i].date,entryDate))
          {
            existingItems = dates[i].itemsCompleted;
            dateExists = true;
            break;
          }
        }

        if(dateExists)
          warningMessage = "Warning: This date already has " + existingItems + " item(s). Submitting will overwrite this.";
      }
    }
    setDateWarning(warningMessage);
  },[entryDate,selectedInitiativeIndex,selectedCompany])

  useEffect(() => {
    if(selectedCompany)
    {
      let companyClone = JSON.parse(JSON.stringify(selectedCompany));
      let initiative = GetInitiativeFromCompany(companyClone,selectedInitiativeIndex);
      if(initiative)
      {
        let throughputClone = JSON.parse(JSON.stringify(initiative.itemsCompletedOnDate));
        initiative.itemsCompletedOnDate = throughputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(b.date,a.date));
        setThroughputList(throughputClone);
      }
    }
  },[selectedInitiativeIndex])

  function GetInitiativeFromCompany(company: Company | undefined, initiativeIndex: number) : Initiative | undefined
  {
    let initiatives = company?.initiatives[initiativeIndex];
    return initiatives;
  }

  function AddItem(initiative: Initiative | undefined)
  {
    const validation = ValidateEditThroughputData(props.companyList, selectedCompany?.id ?? "-1", initiative?.id ?? "-1", throughputList);
    if(validation.success)
    {
      let newItem: ThroughputData = {date: todayInfo, itemsCompleted: 1};
      let throughtputClone: ThroughputData[] = JSON.parse(JSON.stringify(initiative?.itemsCompletedOnDate));
      throughtputClone.unshift(newItem);
      throughtputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(b.date,a.date));
      setThroughputList(throughtputClone);
      EnterEditMode(todayInfo, throughtputClone, true)
    } else 
    {
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
    }
  }

  const InEditMode = () => state === stateEnum.edit || state === stateEnum.add;

  function EnterEditMode(date: DateInfo, throughputs: ThroughputData[], isNew: boolean) {
    if(!InEditMode())
    {
      let currentThroughput = throughputs.find(i => i.date === date);
      if(currentThroughput)
      {
        setState(isNew ? stateEnum.add : stateEnum.edit);
        setThroughputToEdit(currentThroughput);
        setCurrentDate(currentThroughput.date);
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
      let selectedThroughputClone: ThroughputData[] = JSON.parse(JSON.stringify(throughputList));

      selectedThroughputClone = selectedThroughputClone.splice(1);
      setThroughputList(selectedThroughputClone);
    }
    LeaveEditMode();
  }

  function SaveEdit()
  {
    let selectedThroughputClone = JSON.parse(JSON.stringify(throughputList));
    let initiative = GetInitiativeFromCompany(selectedCompany,selectedInitiativeIndex)!;
    let newItem = selectedThroughputClone.find((i: { date: DateInfo; }) => (CompareDateInfos(i.date, throughputToEdit?.date ?? {day: 1, month: 1, year: 1900}) === 0));
    if(newItem)
    {
        newItem.date = currentDate;
        newItem.itemsCompleted = currentItems ?? 1;
        let successful = props.Submit(selectedCompany?.id ?? "-1", initiative.id ?? "-1", selectedThroughputClone, false);   

        if(successful)
        {
          selectedThroughputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(b.date,a.date));
          setThroughputList(selectedThroughputClone);
          LeaveEditMode();
        }
    }
  }

  function Close()
  {
    props.setEditIsOpen(false);
  }

  return(
    <Modal
      id={EditThroughputIds.modal}
      isOpen={props.editIsOpen}
      onRequestClose={()=>props.setEditIsOpen(false)}
      style={{'content': {...modalStyle.content, 'width' : 'fit-content', 'height' : 'fit-content'}}}
      appElement={document.getElementById('root') as HTMLElement}>
      <div className="space-y-5">
        <p className="text-3xl w-full">Edit Throughput Data</p>
        <SelectCompanyAndInitiative companyList={props.companyList} selectedCompany={selectedCompany} selectedInitiativeIndex={selectedInitiativeIndex} setSelectedCompany={setSelectedCompany} setSelectedInitiativeIndex={setSelectedInitiativeIndex} companyElementId={EditThroughputIds.selectCompany} initiativeElementId={EditThroughputIds.selectInitiative}/>
            {dateWarning}
        <button id={EditThroughputIds.addEntrySubmitButton} className={submitButtonStyle + " h-full"} disabled={InEditMode()}
          onClick={() => AddItem(selectedCompany?.initiatives[selectedInitiativeIndex])}>Add New</button>
        <div className="outline outline-[#879794] rounded space-y-2 p-2">
          <div>
          <p className="text-2xl">Edit Data</p>
          </div>
        <div className="rounded overflow-y-auto max-h-60">
          <TableContainer component={Paper} >
          <Table className="table-auto w-full rounded-md bg-white overflow-y-auto">
            <TableHead className="outline outline-1">
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
              </TableRow>
            </TableHead>
            <TableBody>
                {(selectedInitiativeIndex >= 0) && throughputList.map((throughput, key) => {
                  let isEdit = InEditMode() && throughput.date === throughputToEdit?.date;
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
                        <TableCell>
                        <IconButton id={EditThroughputIds.saveChangesButton} onClick={() => SaveEdit()}>
                            <DoneIcon />
                        </IconButton>
                        <IconButton id={EditThroughputIds.cancelChangesButton} onClick={() => CancelEdit()}>
                            <CancelIcon />
                        </IconButton>
                        </TableCell>
                        <TableCell className="border border-spacing-x-0 border-y-gray-700" id={EditThroughputIds.tableDate}>
                          {state === stateEnum.add ?
                            <DateInput date={currentDate} setDate={setCurrentDate} id={EditThroughputIds.tableDate}></DateInput> 
                          :
                            <p className="px-2 w-full bg-inherit focus:outline-none" id={EditThroughputIds.tableDate}>{throughput.date.month + "/" + throughput.date.day + "/" + throughput.date.year}</p> 
                          }
                          </TableCell>
                        <TableCell className={tooltipStyle}>
                          <input className="px-2 w-full bg-inherit focus:outline-none" id={EditThroughputIds.tableItemsComplete} type="number" min="0" value={currentItems}
                          onChange={(e) => setCurrentItems(parseInt(e.target.value))}/>
                        </TableCell>
                        </>
                        :
                        <>
                        <TableCell>
                        <IconButton id={EditThroughputIds.saveChangesButton} onClick={() => EnterEditMode(throughput.date, throughputList, false)}>
                            <EditIcon />
                        </IconButton>
                        </TableCell>
                        <TableCell className="border border-spacing-x-0 border-y-gray-700" id={EditThroughputIds.tableDate}>
                          <p className="px-2 w-full bg-inherit focus:outline-none" id={EditThroughputIds.tableDate}>{throughput.date.month + "/" + throughput.date.day + "/" + throughput.date.year}</p> 
                        </TableCell>
                        <TableCell className={tooltipStyle}>
                          <input disabled className="px-2 w-full bg-inherit focus:outline-none" id={EditThroughputIds.tableItemsComplete} type="number" min="0" value={throughput.itemsCompleted}/>
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
          <button id={EditThroughputIds.closeButton} className={cancelButtonStyle} onClick={() => Close()}>Close</button> 
        </div>
      </div>
    </Modal>
  )
}
