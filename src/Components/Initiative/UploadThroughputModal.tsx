import { Company, Initiative } from "../../Store/CompanySlice";
import { submitButtonStyle } from "../../Styles";
import { useEffect, useRef, useState } from "react";
import { DateInfo, ThroughputData } from "../../Services/CompanyService";
import { ValidationFailedPrefix } from "../../Services/Validation";
import { enqueueSnackbar } from "notistack";
import { BaseInitiativeModal } from "./BaseInitiativeModal";
import { FileUpload } from "../FileUpload";

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

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFileData([]);
    setFileWarning("");
    setFile(null);
  },[props.uploadIsOpen])

  function ReceiveFile(file: File | null)
  {
    if(!file)
      return;

    let splitName = file.name.split('.');
    let extension = splitName[splitName.length-1];
    if(extension !== 'csv')
    {
      setFile(null);
      setFileData([]);
      setFileWarning("");
      enqueueSnackbar(ValidationFailedPrefix + "File can only be of type .csv", {variant:"error"});
      return;
    }
    
    setFile(file);

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

  async function UploadFile()
  {
    setIsUploading(true);
    await props.Submit(props.company.id, props.initiative.id, fileData, true);
    setIsUploading(false);
  }

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
          <div className="outline outline-[#879794] rounded space-y-2 p-2">
            <p className="text-2xl w-full">Upload CSV File</p>
            <FileUpload cypressData={{uploadButton: UploadThroughputIds.uploadButton, submitButton: UploadThroughputIds.fileSubmit}} accept={'.csv'} file={file} setFile={ReceiveFile} isUploading={isUploading} UploadFile={UploadFile}/>
          </div>
        </div>
      </div>
    </BaseInitiativeModal>
  )
}