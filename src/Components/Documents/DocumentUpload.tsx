import { useState } from "react";
import { MuiFileInput } from "mui-file-input";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { DocumentInfo, getDocumentUrls, uploadDocument } from "../../Store/DocumentSlice";
import { v4 } from "uuid";
import { IntegrityId } from "../../Store/CompanySlice";
import { useAppDispatch } from "../../Store/Hooks";
import { yellowButtonStyle } from "../../Styles";

interface DocumentUploadProps {
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
      await dispatch(uploadDocument({file: file, companyId: IntegrityId, documentId: documentId, isTest: true}));
      props.GetData();
      setFile(null);
    }
  }

  return (
    <>
      <div>
        <MuiFileInput 
          value={file}
          onChange={setFile}
        />
        <button disabled={file === null} className={yellowButtonStyle} onClick={() => HandleUpload()}>Upload</button>
      </div>
      <div>
        
      </div>
    </>
  )
}
