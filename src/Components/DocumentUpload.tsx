import { useState } from "react";
import { yellowButtonStyle } from "../Styles";
import { v4 } from "uuid";
import { useAppDispatch } from "../Store/Hooks";
import { DocumentInfo, downloadDocument, getDocumentUrls, uploadDocument } from "../Store/DocumentSlice";
import { IntegrityId } from "../Store/CompanySlice";

export function DocumentUpload()
{
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<FileList>();
  const [docInfo, setDocInfo] = useState<DocumentInfo>();

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
      dispatch(uploadDocument({file: files[0], companyId: IntegrityId, documentId: documentId, isTest: true}));
    }
  }

  async function HandleGet()
  {
    const docs = (await dispatch(getDocumentUrls({companyId: IntegrityId}))).payload as DocumentInfo[];
    setDocInfo(docs[0]);
  }

  async function HandleDownload()
  {
    if(docInfo)
    {
      const result = await dispatch(downloadDocument({documentInfo: docInfo}))
    }
  }

  return (
    <>
      <div>
        <input type="file" onChange={(e) => HandleFile(e.target.files)}/>
        <button className={yellowButtonStyle} onClick={() => HandleUpload()}>Upload</button>
      </div>
      <div>
        <button className={yellowButtonStyle} onClick={() => HandleGet()}>Get Documents</button>
        <button className={yellowButtonStyle} onClick={() => HandleDownload()}>Download {docInfo?.name}</button>
      </div>
    </>
  )
}
