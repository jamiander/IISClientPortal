import { useEffect, useState } from "react";
import { DateInfo, ThroughputData } from "../../Services/CompanyService";
import { Company, Initiative } from "../../Store/CompanySlice";
import { cancelButtonStyle, defaultRowStyle, inputStyle, modalStyle, submitButtonStyle, TableHeaderStyle, tooltipStyle } from "../../Styles";
import SelectCompanyAndInitiative from "./SelectCompanyAndInitiative";
import { CompareDateInfos, DateInput, EqualDateInfos } from "../DateInput";
import { ValidateDate, ValidateEditThroughputData, ValidationFailedPrefix } from "../../Services/Validation";
import { useOutletContext } from "react-router-dom";
import Modal from "react-modal";
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper } from "@mui/material";

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
    tableItemsComplete: "editThroughputTableItemsComplete"
  }
  
  interface ThroughputModalProps{
    companyList: Company[],
    editIsOpen: boolean,
    setEditIsOpen: (value: boolean) => void,
    Submit: (companyId: string, initiativeId: number, dataList: ThroughputData[], emptyDataCheck: boolean) => void
  }

export default function EditThroughputModal(this: any, props: ThroughputModalProps){
  const [selectedCompany, setSelectedCompany] = useState<Company>();
  const [selectedInitiativeIndex, setSelectedInitiativeIndex] = useState(-1);
  const [dateWarning, setDateWarning] = useState("");
  const today = new Date();
  const todayInfo: DateInfo = {month: today.getMonth()+1, day: today.getDate(), year: today.getFullYear()}
  const [entryDate, setEntryDate] = useState<DateInfo>(todayInfo);
  const [itemsCompleted, setItemsCompleted] = useState(-1);
  const manualEntry: ThroughputData = { date:entryDate, itemsCompleted:itemsCompleted }
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();

  useEffect(() => {
    setSelectedCompany(undefined);
    setSelectedInitiativeIndex(-1);
    setDateWarning("");
    setEntryDate(todayInfo);
    setItemsCompleted(-1);
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
        initiative.itemsCompletedOnDate = throughputClone.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(a.date,b.date));
        setSelectedCompany(companyClone);
      }
    }
  },[selectedInitiativeIndex])

  function GetInitiativeFromCompany(company: Company | undefined, initiativeIndex: number) : Initiative | undefined
  {
    let initiatives = company?.initiatives[initiativeIndex];
    return initiatives;
  }

  function AddThroughputEntry()
  {
    let initiative = GetInitiativeFromCompany(selectedCompany,selectedInitiativeIndex);
    let validate = ValidateEditThroughputData(props.companyList, selectedCompany?.id ?? "-1", initiative?.id ?? -1, [manualEntry]);
    if(validate.success)
    {
      ShowToast("New data added!", "Success");
      UpsertThroughput(manualEntry);
    }
    else
      ShowToast(ValidationFailedPrefix + validate.message, "Error");
  }
  
  function UpsertThroughput(newData: ThroughputData)
  {
    let selectedCompanyClone = JSON.parse(JSON.stringify(selectedCompany));
    let initiative = GetInitiativeFromCompany(selectedCompanyClone,selectedInitiativeIndex)
    if(initiative)
    {
      let existingThroughputIndex = initiative.itemsCompletedOnDate.findIndex((data) => EqualDateInfos(data.date,newData.date));
      if(existingThroughputIndex === -1)
        initiative.itemsCompletedOnDate.push(newData);
      else
        initiative.itemsCompletedOnDate[existingThroughputIndex] = newData;

      initiative.itemsCompletedOnDate.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(a.date,b.date));
      setSelectedCompany(selectedCompanyClone);
    }
  }

  function EditItems(key: number, newItems: string)
  {
    let selectedCompanyClone = JSON.parse(JSON.stringify(selectedCompany));
    let initiative = GetInitiativeFromCompany(selectedCompanyClone,selectedInitiativeIndex);
    if(initiative)
    {
      let changeThroughput = initiative.itemsCompletedOnDate[key];
      if (changeThroughput)
      {
        changeThroughput.itemsCompleted = parseInt(newItems);

        initiative.itemsCompletedOnDate.sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(a.date,b.date));
        setSelectedCompany(selectedCompanyClone);
      }
    }
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
        <div className="outline outline-[#879794] rounded space-y-2 p-2">
          <div>
            <p className="text-2xl">Add Data</p>
          </div>
          <div className="flex justify-between h-full">
            <div>
              <p>Date</p>
              <DateInput id={EditThroughputIds.addDate} date={entryDate} setDate={setEntryDate}/>
            </div>
            <div>
              <p>Items Completed</p>
              <input id={EditThroughputIds.addItemsComplete} type={'number'} className={inputStyle + ' w-1/2'} min={0} onChange={(e) => {setItemsCompleted(parseInt(e.target.value))}}/>
            </div>
          </div>
          <div className="grid">
            {dateWarning}
            <button id={EditThroughputIds.addEntrySubmitButton} className={submitButtonStyle + " h-full"} 
              onClick={() => AddThroughputEntry()}>Submit</button>
          </div>
        </div>
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
                {(selectedInitiativeIndex >= 0) && selectedCompany?.initiatives[selectedInitiativeIndex]?.itemsCompletedOnDate.map((throughput, key) => {
                    return (
                    <TableRow key={key} className={defaultRowStyle} sx={{
                      borderBottom: "1px solid black",
                        "& td": {
                          fontSize: "1rem",
                          fontFamily: "Arial, Helvetica" 
                        }
                      }}>
                        <TableCell className="border border-spacing-x-0 border-y-gray-700" id={EditThroughputIds.tableDate}>
                          <p className="px-2 w-full bg-inherit focus:outline-none" id={EditThroughputIds.tableDate}>{throughput.date.month + "/" + throughput.date.day + "/" + throughput.date.year}</p> 
                        </TableCell>
                        <TableCell className={tooltipStyle}>
                          <input className="px-2 w-full bg-inherit focus:outline-none" id={EditThroughputIds.tableItemsComplete} type="number" min="0" value={throughput.itemsCompleted}
                          onChange={(e) =>EditItems(key, e.target.value)}/>
                        </TableCell>
                    </TableRow>
                    )
                })}
            </TableBody>
          </Table>
          </TableContainer>
          </div>
        </div>
        <div className="h-10 w-full flex justify-between">
          <button id={EditThroughputIds.submitButton} className={submitButtonStyle} onClick={() => props.Submit(selectedCompany?.id ?? "-1", selectedCompany?.initiatives[selectedInitiativeIndex]?.id ?? -1, GetInitiativeFromCompany(selectedCompany,selectedInitiativeIndex)?.itemsCompletedOnDate ?? [], false)}>Save</button>
          <button id={EditThroughputIds.closeButton} className={cancelButtonStyle} onClick={() => props.setEditIsOpen(false)}>Cancel</button>
        </div>
      </div>
    </Modal>
  )
}
