import { useState } from "react";
import { yellowButtonStyle } from "../Styles";
import { v4 } from "uuid";
import { useAppDispatch } from "../Store/Hooks";
import { getDocumentUrls, uploadDocuments } from "../Store/DocumentSlice";
import { IntegrityId } from "../Store/CompanySlice";

export function DocumentUpload()
{
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<FileList>();

  function HandleFile(newFiles: FileList | null)
  {
    if(newFiles)
    {
      setFiles(newFiles);
    }
  }

  function HandleUpload()
  {
    if(files)
    {
      let documentId = v4();
      dispatch(uploadDocuments({files: files, companyId: IntegrityId, documentId: documentId, isTest: true}));
    }
  }

  return (
    <>
        <div>
          <input type="file" onChange={(e) => HandleFile(e.target.files)}/>
          <button className={yellowButtonStyle} onClick={() => HandleUpload()}>Upload</button>
        </div>
        <div>
          <button className={yellowButtonStyle} onClick={() => dispatch(getDocumentUrls({companyId: IntegrityId}))}>Get Documents</button>
        </div>
    </>
  )
}
