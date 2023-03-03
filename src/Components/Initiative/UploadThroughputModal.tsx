import { Company, Initiative } from "../../Store/CompanySlice";
import  Modal  from 'react-modal';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from "../../Styles";
import { useEffect, useRef, useState } from "react";
import { DateInfo, ThroughputData } from "../../Services/CompanyService";
//import * as fs from "fs";
import * as path from "path";
import { useOutletContext } from "react-router-dom";
import { ValidateDate } from "../../Services/Validation";
//import { parse } from 'csv-parse';

export const UploadThroughputIds = {
  selectCompany: "selectCompanyInThroughputModal",
  selectInitiative: "selectInitiativeInThroughputModal"
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
  const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedCompany(undefined);
    setSelectedInitiativeIndex(-1);
    setFileData([]);
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
    let files = fileRef.current?.files ?? [];
    let file = files[0];
    let fileContent;
    const reader = new FileReader();
    reader.onload = function(e) {

      fileContent = reader.result;
      if(fileContent && typeof(fileContent) === 'string')
      {
        let parseData: ThroughputData[] = [];
        let lines = fileContent.split("\n");
        for(let i = 0; i < lines.length; i++) {
          let wordsInLine = lines[i].split(",");
          if(wordsInLine.length === 2)
          {
            let dateString = wordsInLine[0];
            let itemsCompletedString = wordsInLine[1];

            let dateWords = dateString.split('/');
            let date: DateInfo = {month: parseInt(dateWords[0]), day: parseInt(dateWords[1]), year: parseInt(dateWords[2])};
            
            let dataEntry: ThroughputData = {date: date, itemsCompleted: parseInt(itemsCompletedString)};
            parseData.push(dataEntry);
          }
        }
        
        console.log(parseData);
        setFileData(parseData);
      }
      else
        ShowToast("Something went wrong when trying to load that file.","Error")
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
        <p className="text-3xl">Upload Throughput Data</p>

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
        <input ref={fileRef} type={'file'} accept={'.csv'} onChange={(e) => ReceiveFile(e.target.value)}/>
        <div>
          <p>--OR--</p>
          <p className="text-2xl">Manually Enter Single Entry</p>
        </div>
        <div className="flex space-x-2">
          <div className="w-[20%]">
            <p>Month</p>
            <input type={'text'} className={'outline rounded p-2 w-full'} maxLength={2} placeholder={'MM'}/>
          </div>
          <div className="w-[20%]">
            <p>Day</p>
            <input type={'text'} className={'outline rounded p-2 w-full'} maxLength={2} placeholder={'DD'}/>
          </div>
          <div className="w-[30%]">
            <p>Year</p>
            <input type={'text'} className={'outline rounded p-2 w-full'} maxLength={4} placeholder={'YYYY'}/>
          </div>
          
        </div>
        <div>
          <p>Items Completed</p>
          <input type={'number'} className={inputStyle}/>
        </div>
        <div className='w-full flex justify-end h-10'>
          <button className={submitButtonStyle} onClick={() => props.Submit(selectedCompany?.id ?? -1, selectedCompany?.initiatives[selectedInitiativeIndex]?.id ?? -1, fileData)}>Submit</button> {/*submit button does nothing right now*/}
          <button className={cancelButtonStyle} onClick={() => props.setUploadIsOpen(false)}>Close</button>
        </div>
        <p>{selectedCompany?.id}</p>
    </div>
    </Modal>
  )
}