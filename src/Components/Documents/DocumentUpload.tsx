import { useRef, useState } from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadDocument } from "../../Store/DocumentSlice";
import { v4 } from "uuid";
import { Company, Initiative } from "../../Store/CompanySlice";
import { useAppDispatch } from "../../Store/Hooks";
import { enqueueSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

interface DocumentUploadProps {
  company: Company
  initiative?: Initiative
  GetData: () => Promise<void>
}

export function DocumentUpload(props: DocumentUploadProps)
{
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function CanUpload(myFile: File | null): myFile is File
  {
    return (myFile !== null && !isUploading);
  }

  function ResetFiles()
  {
    setFile(null);
    setIsUploading(false);
    if(fileRef.current)
      fileRef.current.value = "";
  }

  async function HandleUpload()
  {
    if(CanUpload(file))
    {
      let documentId = v4();
      try
      {
        setIsUploading(true);
        await dispatch(uploadDocument({file: file, companyId: props.company.id, initiativeId: props.initiative?.id, documentId: documentId}));

        setTimeout(async () => {
          await props.GetData();
          enqueueSnackbar("File uploaded successfully!", {variant:"success"});
          ResetFiles();
        }, 2000);
      }
      catch(e)
      {
        console.log((e as Error).message);
      }
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
          file:bg-gray-100 file:text-gray-700
          hover:file:bg-gray-200"
          onChange={(e) => HandleFiles(e.target.files)}
          ref={fileRef}
        />
        <UploadFileIcon className={(!CanUpload(file) ? "text-gray-400" : "hover:text-gray-400") + " block-inline align-baseline mt-4"} onClick={() => HandleUpload()} sx={{ fontSize:28 }}></UploadFileIcon>
        {isUploading &&
          <CircularProgress size={30} color={"warning"} className="mt-4 ml-2"/>
        }
      </div>
    </>
  )
}
