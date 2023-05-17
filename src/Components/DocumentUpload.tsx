import { useState } from "react";
import { yellowButtonStyle } from "../Styles";
import { v4 } from "uuid";
import { useAppDispatch } from "../Store/Hooks";
import { getDocuments, uploadDocuments } from "../Store/DocumentSlice";

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
      dispatch(uploadDocuments({files: files, documentId: documentId, isTest: true}));
    }
  }

  return (
    <>
        <div>
          <input type="file" onChange={(e) => HandleFile(e.target.files)}/>
          <button className={yellowButtonStyle} onClick={() => HandleUpload()}>Upload</button>
        </div>
        <div>
          <button className={yellowButtonStyle} onClick={() => dispatch(getDocuments({documentId: ""}))}>Get Documents</button>
        </div>
    </>
  )
}
