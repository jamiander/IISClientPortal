import { useState } from "react";
import { MuiFileInput } from "mui-file-input";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { DocumentInfo, getDocumentUrls, uploadDocument } from "../../Store/DocumentSlice";
import { v4 } from "uuid";
import { Company, IntegrityId } from "../../Store/CompanySlice";
import { useAppDispatch } from "../../Store/Hooks";
import { yellowButtonStyle } from "../../Styles";
import { IconButton } from "@mui/material";

interface DocumentUploadProps {
  company: Company
  GetData: () => void
}

export function DocumentUpload(props: DocumentUploadProps)
{
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  async function HandleUpload()
  {
    if(file)
    {
      let documentId = v4();
      await dispatch(uploadDocument({file: file, companyId: props.company.id, documentId: documentId}));
      props.GetData();
      setFile(null);
    }
  }

  return (
    <>
      <div className="flex justify-center h-full">
        <MuiFileInput 
          value={file}
          onChange={setFile}
        />
          <IconButton className="align-middle" disabled={file === null} onClick={() => HandleUpload()}>
            <UploadFileIcon sx={{ fontSize:28 }}></UploadFileIcon>
          </IconButton>
        
      </div>
    </>
  )
}
