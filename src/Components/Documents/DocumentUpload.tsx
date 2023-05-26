import { useState } from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadDocument } from "../../Store/DocumentSlice";
import { v4 } from "uuid";
import { Company, Initiative } from "../../Store/CompanySlice";
import { useAppDispatch } from "../../Store/Hooks";
import { IconButton } from "@mui/material";

interface DocumentUploadProps {
  company: Company
  initiative?: Initiative
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

  function HandleFiles(files: FileList | null)
  {
    if(files)
      setFile(files[0]);
  }

  return (
    <>
      <div className="flex  h-full">
        <input type="file" className="block align-middle text-sm text-slate-500 file:mt-4
          file:mr-2 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-gray-50 file:text-gray-700
          hover:file:bg-gray-100"
          onChange={(e) => HandleFiles(e.target.files)}
        />
        <UploadFileIcon className={(file === null ? "text-gray-400" : "hover:text-gray-400") + " block-inline align-baseline mt-4"} onClick={() => HandleUpload()} sx={{ fontSize:28 }}></UploadFileIcon>
      </div>
    </>
  )
}
