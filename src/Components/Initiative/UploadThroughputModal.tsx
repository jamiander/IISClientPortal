import { Company, Initiative } from "../../Store/CompanySlice";
import  Modal  from 'react-modal';
import { cancelButtonStyle, modalStyle, submitButtonStyle } from "../../Styles";
import { useEffect, useRef, useState } from "react";
import { DateInfo, ThroughputData } from "../../Services/CompanyService";
import { ValidationFailedPrefix } from "../../Services/Validation";
import { v4 as uuidV4} from "uuid";
import { enqueueSnackbar } from "notistack";
import { Dialog } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { BaseInitiativeModal } from "./BaseInitiativeModal";

export const UploadThroughputIds = {
  modal: "uploadThroughputModal",
  selectCompany: "selectCompanyInUploadThroughputModal",
  selectInitiative: "selectInitiativeInUploadThroughputModal",
  uploadButton: "uploadThroughputUploadButton",
  fileSubmit: "uploadThroughputSubmitButton",
  date: "uploadThroughputDate",
  closeModalButton: "uploadThroughputCloseModalButton"
}

interface ThroughputModalProps{
  company: Company
  initiative: Initiative
  uploadIsOpen: boolean
  setUploadIsOpen: (value: boolean) => void
  Submit: (companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean) => void
}

export default function UploadThroughputModal(props:ThroughputModalProps){
  const [fileData, setFileData] = useState<ThroughputData[]>([]);
  const [fileWarning, setFileWarning] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFileData([]);
    setFileWarning("");
  },[props.uploadIsOpen])

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
        enqueueSnackbar(ValidationFailedPrefix + "File can only be of type .csv", {variant:"error"});
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
        enqueueSnackbar("Something went wrong when trying to load that file.",{variant:"error"});
    }
    reader.readAsText(file);
  }

  let myUuid = uuidV4();
  return(
    <BaseInitiativeModal
      cypressData={{modal: UploadThroughputIds.modal, closeModalButton: UploadThroughputIds.closeModalButton}}
      open={props.uploadIsOpen}
      onClose={()=>props.setUploadIsOpen(false)}
      company={props.company}
      initiative={props.initiative}
    >
      <div className="space-y-5">
        <div className="flex justify-between">
          <p className="text-3xl w-full">Upload Throughput Data</p>
        </div>
        {fileWarning}
        <div className="flex">
          <div className="outline outline-[#879794] rounded space-y-2 p-2 w-64">
            <p className="text-2xl w-full">Upload CSV File</p>
            <input data-cy={UploadThroughputIds.uploadButton} className="w-full" ref={fileRef} type={'file'} accept={'.csv'} onChange={(e) => ReceiveFile(e.target.value)}/>
            <div className="grid justify-end h-1/2">
              <button data-cy={UploadThroughputIds.fileSubmit} className={submitButtonStyle} onClick={() => props.Submit(props.company.id, props.initiative.id, fileData, true)}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </BaseInitiativeModal>
  )
}