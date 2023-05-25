import { useState } from "react";
import { MuiFileInput } from "mui-file-input";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { DocumentInfo, getDocumentUrls, uploadDocument } from "../../Store/DocumentSlice";
import { v4 } from "uuid";
import { IntegrityId } from "../../Store/CompanySlice";
import { useAppDispatch } from "../../Store/Hooks";
import { yellowButtonStyle } from "../../Styles";

interface DocumentUploadProps {

}

export function DocumentUpload(props: DocumentUploadProps)
{
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [docInfo, setDocInfo] = useState<DocumentInfo>();

  function HandleUpload()
  {
    if(file)
    {
      let documentId = v4();
      dispatch(uploadDocument({file: file, companyId: IntegrityId, documentId: documentId, isTest: true}));
    }
  }

  async function HandleGet()
  {
    const docs = (await dispatch(getDocumentUrls({companyId: IntegrityId}))).payload as DocumentInfo[];
    setDocInfo(docs[0]);
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
