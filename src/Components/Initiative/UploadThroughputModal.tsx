import { Company, Initiative } from "../../Store/CompanySlice";
import  Modal  from 'react-modal';
import { cancelButtonStyle, modalStyle, submitButtonStyle } from "../../Styles";
import { useEffect, useRef, useState } from "react";
import { DateInfo, FindItemsRemaining, ThroughputData } from "../../Services/CompanyService";
import { useOutletContext } from "react-router-dom";
import { ValidationFailedPrefix } from "../../Services/Validation";
import { DateInput } from "../DateInput";

export const UploadThroughputIds = {
  modal: "uploadThroughputModal",
  selectCompany: "selectCompanyInThroughputModal",
  selectInitiative: "selectInitiativeInThroughputModal",
  fileSubmit: "submitThroughputAsFile",
  manualSubmit: "submitThroughputAsSingleEntry",
  date: "uploadThroughputDate",
  itemsComplete: "uploadThroughputItemsComplete",
  closeButton: "uploadThroughputClose"
}

interface ThroughputModalProps{
  companyList: Company[],
  uploadIsOpen: boolean,
  setUploadIsOpen: (value: boolean) => void,
  Submit: (companyId: number, initiativeId: number, dataList: ThroughputData[], emptyDataCheck: boolean) => void
}

export default function UploadThroughputModal(props:ThroughputModalProps){;
  const [selectedCompany, setSelectedCompany] = useState<Company>();
  const [selectedInitiativeIndex, setSelectedInitiativeIndex] = useState(-1);
  const [fileData, setFileData] = useState<ThroughputData[]>([]);
  const [fileWarning, setFileWarning] = useState("");
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();
  const today = new Date();
  const todayInfo: DateInfo = {month: today.getMonth()+1, day: today.getDate(), year: today.getFullYear()}
  const [entryDate, setEntryDate] = useState<DateInfo>(todayInfo);
  const [itemsCompleted, setItemsCompleted] = useState(-1);
  const manualEntry: ThroughputData[] = [{date:entryDate,itemsCompleted:itemsCompleted}]

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedCompany(undefined);
    setSelectedInitiativeIndex(-1);
    setFileData([]);
    setFileWarning("");
    setEntryDate(todayInfo);
    setItemsCompleted(-1);
  },[props.uploadIsOpen])

  function SelectCompany(companyId: number)
  {
    setSelectedCompany(props.companyList.find(company => company.id === companyId));
    setSelectedInitiativeIndex(-1);
  }

  function SelectInitiative(initiativeIndex: number)
  {
    if(selectedCompany)
    {
      if(selectedCompany.initiatives[initiativeIndex])
        setSelectedInitiativeIndex(initiativeIndex);
      else
        setSelectedInitiativeIndex(-1);
    }
  }

  function ReceiveFile(fileName: string)
  {
    if(fileName)
    {
      let splitName = fileName.split('.');
      let extension = splitName[splitName.length-1];
      if(extension !== 'csv')
      {
        setFileData([]);
        setFileWarning("");
        ShowToast(ValidationFailedPrefix + "File can only be of type .csv", "Error");
        return;
      }
    }

    let files = fileRef.current?.files ?? [];
    let file = files[0];
    let fileContent;
    const reader = new FileReader();
    reader.onload = function(e) {
      fileContent = reader.result;
      if(fileContent && typeof(fileContent) === 'string')
      {
        let parseData: ThroughputData[] = [];
        let warningMessage = "";
        let isWarning = false;
        let lines = fileContent.split("\n");
        for(let i = 0; i < lines.length; i++)
        {
          let wordsInLine = lines[i].split(",");
          if(wordsInLine.length === 2)
          {
            let dateString = wordsInLine[0];
            let itemsCompletedString = wordsInLine[1];

            let dateWords = dateString.split('/');
            let month = parseInt(dateWords[0]);
            let day = parseInt(dateWords[1]);
            let year = parseInt(dateWords[2]);

            let itemsCompleted = parseInt(itemsCompletedString);

            if(!month || !day || !year || (!itemsCompleted && itemsCompleted !== 0))
            {
              if(dateString.toUpperCase() !== 'DATE' && itemsCompletedString.toUpperCase() !== "ITEMSCOMPLETED")
                isWarning = true;
              continue;
            }

            let date: DateInfo = {month: month, day: day, year: year};
            let dataEntry: ThroughputData = {date: date, itemsCompleted: itemsCompleted};
            parseData.push(dataEntry);
          }
          else
            isWarning = true;
        }
        
        if(isWarning)
          warningMessage = 'Warning: This file contains data that is not properly formatted. Entries that are not provided as "MM/DD/YYYY, #itemsCompleted" will be ignored.';

        setFileWarning(warningMessage);
        setFileData(parseData);
      }
      else
        ShowToast("Something went wrong when trying to load that file.","Error");
    }
    reader.readAsText(file);
  }

  return(
    <Modal
    id={UploadThroughputIds.modal}
    isOpen={props.uploadIsOpen}
    onRequestClose={()=>props.setUploadIsOpen(false)}
    style={{'content': {...modalStyle.content, 'width' : 'fit-content', 'height' : 'fit-content'}}}
    appElement={document.getElementById('root') as HTMLElement}>
      <div className="space-y-5">
        <p className="text-3xl w-full">Enter Throughput Data</p>
        <div className="space-x-5 flex w-full">
          <select id={UploadThroughputIds.selectCompany} onChange={(e) => SelectCompany(parseInt((e.target as HTMLSelectElement).value))} className="outline outline-1 rounded w-56 h-10">
            <option>Select Company</option>
              {props.companyList.map((company,index)=>{
                return(
                  <option value={company.id} key={index}>{company.name}</option>
                )
              })}
          </select>
          <select id={UploadThroughputIds.selectInitiative} value={selectedInitiativeIndex} onChange={(e) => SelectInitiative(parseInt((e.target as HTMLSelectElement).value))} className="outline outline-1 rounded w-56 h-10">
            <option>Select Initiative</option>
              {selectedCompany?.initiatives.map((initiative,index)=>{
                return(
                  <option value={index} key={index}>{initiative.title}</option>
                )
              })}
          </select>
          {selectedInitiativeIndex >= 0 && <p className="p-2">Items Remaining: {FindItemsRemaining(selectedCompany?.initiatives.at(selectedInitiativeIndex))}</p>}
        </div>
        {fileWarning}
        <div className="flex">
          <div className="outline outline-[#879794] rounded space-y-2 p-2 w-64">
            <p className="text-2xl w-full">Upload CSV File</p>
            <input className="w-full" ref={fileRef} type={'file'} accept={'.csv'} onChange={(e) => ReceiveFile(e.target.value)}/>
              <button id={UploadThroughputIds.fileSubmit} className={submitButtonStyle} onClick={() => props.Submit(selectedCompany?.id ?? -1, selectedCompany?.initiatives.at(selectedInitiativeIndex)?.id ?? -1, fileData, true)}>Submit</button>
          </div>
          <p className="text-2xl m-3">OR</p>
          <div className="outline outline-[#879794] rounded space-y-2 p-2 w-64">
            <div>
              <p className="text-2xl">Manually Entry</p>
            </div>
            <DateInput id={UploadThroughputIds.date} date={entryDate} setDate={setEntryDate}/>
            <div>
              <p>Items Completed</p>
            </div>
            <div className='flex w-full h-10'>
              <input id={UploadThroughputIds.itemsComplete} type={'number'} className={'outline outline-1 rounded p-2 w-1/4'} onChange={(e) => {setItemsCompleted(parseInt(e.target.value))}}/>
              <button id={UploadThroughputIds.manualSubmit} className={submitButtonStyle} onClick={() => props.Submit(selectedCompany?.id ?? -1, selectedCompany?.initiatives[selectedInitiativeIndex]?.id ?? -1, manualEntry, true)}>Submit</button>
            </div>
          </div>
        </div>
        <div className="h-10 w-full">
          <button id={UploadThroughputIds.closeButton} className={cancelButtonStyle} onClick={() => props.setUploadIsOpen(false)}>Close</button>
        </div>
      </div>
    </Modal>
  )
}