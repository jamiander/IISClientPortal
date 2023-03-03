import { Company, Initiative } from "../../Store/CompanySlice";
import  Modal  from 'react-modal';
import { cancelButtonStyle, modalStyle, submitButtonStyle } from "../../Styles";
import { useEffect, useRef, useState } from "react";
import { DateInfo, FindItemsRemaining, ThroughputData } from "../../Services/CompanyService";
//import * as fs from "fs";
import { useOutletContext } from "react-router-dom";
import { ValidationFailedPrefix } from "../../Services/Validation";
//import { parse } from 'csv-parse';

export const UploadThroughputIds = {
  selectCompany: "selectCompanyInThroughputModal",
  selectInitiative: "selectInitiativeInThroughputModal",
  fileSubmit: "submitThroughputAsFile",
  manualSubmit: "submitThroughputAsSingleEntry"
}

interface ThroughputModalProps{
  companyList: Company[],
  uploadIsOpen: boolean,
  setUploadIsOpen: (value: boolean) => void,
  Submit: (companyId: number, initiativeId: number, dataList: ThroughputData[]) => void
}

export default function UploadThroughputModal(props:ThroughputModalProps){;
  const [selectedCompany, setSelectedCompany] = useState<Company>();
  const [selectedInitiativeIndex, setSelectedInitiativeIndex] = useState(-1);
  const [fileData, setFileData] = useState<ThroughputData[]>([]);
  const [fileWarning, setFileWarning] = useState("");
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();
  const emptyDate: DateInfo = {month: 0, day: 0, year: 0};
  const [entryDate, setEntryDate] = useState<DateInfo>(emptyDate);
  const fakeEntry:ThroughputData[] = [{date:emptyDate,itemsCompleted:0}];
  const fakeInit:Initiative = {id:-1, title:'', targetDate:emptyDate, totalItems:0, itemsCompletedOnDate:fakeEntry};
  const [itemsCompleted, setItemsCompleted] = useState(0);
  const manualEntry:ThroughputData[] = [{date:entryDate,itemsCompleted:itemsCompleted}]

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedCompany(undefined);
    setSelectedInitiativeIndex(-1);
    setFileData([]);
    setFileWarning("");
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
        for(let i = 0; i < lines.length; i++) {
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
            console.log(parseData)
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
    isOpen={props.uploadIsOpen}
    onRequestClose={()=>props.setUploadIsOpen(false)}
    style={{'content': {...modalStyle.content, 'width' : '25%', 'height' : 'fit-content'}}}
    appElement={document.getElementById('root') as HTMLElement}>
      <div className="flex flex-wrap space-y-5">
        <p className="text-3xl">Enter Throughput Data</p>

        <select id={UploadThroughputIds.selectCompany} onChange={(e) => SelectCompany(parseInt((e.target as HTMLSelectElement).value))} className="outline rounded w-[200px] h-[40px]">
        <option>Select Company</option>
          {props.companyList.map((company,index)=>{
            return(
              <option value={company.id} key={index}>{company.name}</option>
            )
          })}
        </select>
        <select id={UploadThroughputIds.selectInitiative} value={selectedInitiativeIndex} onChange={(e) => SelectInitiative(parseInt((e.target as HTMLSelectElement).value))} className="outline rounded w-[200px] h-[40px]">
          <option>Select Initiative</option>
          {selectedCompany?.initiatives.map((initiative,index)=>{
            return(
              <option value={index} key={index}>{initiative.title}</option>
            )
          })}
        </select>
        {selectedInitiativeIndex !== -1 && <p className="p-2">Items Remaining: {FindItemsRemaining(selectedCompany?.initiatives.at(selectedInitiativeIndex) ?? fakeInit)}</p>}
        {fileWarning}
        <div className="space-y-2">
          <div className="outline outline-[#879794] rounded space-y-2 p-1">
            <p className="text-2xl">Upload CSV File</p>
            <input ref={fileRef} type={'file'} accept={'.csv'} onChange={(e) => ReceiveFile(e.target.value)}/>
            <button id={UploadThroughputIds.fileSubmit} className={'rounded bg-lime-600 h-[40px] w-[80px]'} onClick={() => props.Submit(selectedCompany?.id ?? -1, selectedCompany?.initiatives[selectedInitiativeIndex]?.id ?? -1, fileData)}>Submit</button>
          </div>
          <p className="text-2xl">OR</p>
          <div className="outline outline-[#879794] rounded space-y-2 p-1">
            <div>
              <p className="text-2xl">Manually Enter Single Entry</p>
            </div>
            <div className="flex space-x-2">
              <div className="w-[20%]">
                <p>Month</p>
                <input 
                type={'text'} className={'outline rounded p-2 w-full'} maxLength={2} placeholder={'MM'}
                onChange={(e)=>{setEntryDate({...entryDate, month:parseInt(e.target.value)})}}/>
              </div>
              <div className="w-[20%]">
                <p>Day</p>
                <input type={'text'} className={'outline rounded p-2 w-full'} maxLength={2} placeholder={'DD'}
                onChange={(e)=>{setEntryDate({...entryDate, day:parseInt(e.target.value)})}}/>
              </div>
              <div className="w-[30%]">
                <p>Year</p>
                <input type={'text'} className={'outline rounded p-2 w-full'} maxLength={4} placeholder={'YYYY'}
                onChange={(e)=>{setEntryDate({...entryDate, year:parseInt(e.target.value)})}}/>
              </div>
            </div>
            <div>
              <p>Items Completed</p>
            </div>
            <div className='w-full flex justify-end h-10'>
              <input type={'number'} className={'outline rounded p-2 w-1/2'} onChange={(e) => {setItemsCompleted(parseInt(e.target.value))}}/>
              <button id={UploadThroughputIds.manualSubmit} className={submitButtonStyle} onClick={() => props.Submit(selectedCompany?.id ?? -1, selectedCompany?.initiatives[selectedInitiativeIndex]?.id ?? -1, manualEntry)}>Submit</button>
              <button className={cancelButtonStyle} onClick={() => props.setUploadIsOpen(false)}>Close</button>
            </div>
          </div>  
      </div>
    </div>
    </Modal>
  )
}