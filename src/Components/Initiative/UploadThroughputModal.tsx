import { Company, Initiative } from "../../Store/CompanySlice";
import { useEffect, useState } from "react";
import { DateInfo, ThroughputData } from "../../Services/CompanyService";
import { ValidationFailedPrefix } from "../../Services/Validation";
import { enqueueSnackbar } from "notistack";
import { BaseInitiativeModal } from "./BaseInitiativeModal";
import { FileUpload } from "../FileUpload";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { TableHeaderStyle, tableHeaderFontSize } from "../../Styles";

export const UploadThroughputIds = {
  modal: "uploadThroughputModal",
  selectCompany: "selectCompanyInUploadThroughputModal",
  selectInitiative: "selectInitiativeInUploadThroughputModal",
  fileUpload: {
    fileInput: "uploadThroughputFileInput",
    chooseFileButton: "uploadThroughputChooseFileButton",
    submitButton: "uploadThroughputSubmitButton"
  },
  date: "uploadThroughputDate",
  closeModalButton: "uploadThroughputCloseModalButton"
}

interface ThroughputModalProps{
  company: Company
  initiative: Initiative
  isOpen: boolean
  HandleClose: () => void
  Submit: (companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean) => Promise<boolean>
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
  },[props.isOpen])

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
          warningMessage = 'Warning: This file contains data that is not properly formatted. Entries that are not provided in proper format will be ignored.';

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
    const response = await props.Submit(props.company.id, props.initiative.id, fileData, true);
    setIsUploading(false);
    if(response)
      props.HandleClose();
  }

  return(
    <BaseInitiativeModal
      cypressData={{modal: UploadThroughputIds.modal, closeModalButton: UploadThroughputIds.closeModalButton}}
      open={props.isOpen}
      onClose={()=>props.HandleClose()}
      title="Upload Throughput"
      subtitle={`${props.company.name}${props.initiative ? ` - ${props.initiative.title}` : ``}`}
    >
      <div className="space-y-5">
        <Typography>Submit a .csv file formatted as follows:</Typography>
        <TableContainer>
          <Table className="table-auto w-full outline outline-3 bg-gray-100">
            <colgroup>
              <col style={{ width: '24vw' }} />
              <col style={{ width: '16vw' }} />
            </colgroup>
            <TableHead className="outline outline-1">
              <TableRow sx={{
                  borderBottom: "2px solid black",
                  "& th": {
                    fontSize: tableHeaderFontSize,
                    fontFamily: "Arial, Helvetica"
                  }
                }}>
                <TableHeaderStyle>
                  Date
                </TableHeaderStyle>
                <TableHeaderStyle>
                  ItemsCompleted
                </TableHeaderStyle>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  MM/DD/YYYY
                </TableCell>
                <TableCell>
                  #itemsCompleted
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  MM/DD/YYYY
                </TableCell>
                <TableCell>
                  #itemsCompleted
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  ...
                </TableCell>
                <TableCell>
                  ...
                </TableCell>
              </TableRow>
            </TableBody>
            
          </Table>
        </TableContainer>
        <Typography>{fileWarning}</Typography>
        <div className="flex">
          <FileUpload cypressData={UploadThroughputIds.fileUpload} accept={'.csv'} file={file} setFile={ReceiveFile} isUploading={isUploading} UploadFile={UploadFile}/>
        </div>
      </div>
    </BaseInitiativeModal>
  )
}