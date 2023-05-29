import { useRef, useState } from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadDocument } from "../../Store/DocumentSlice";
import { v4 } from "uuid";
import { Company, Initiative } from "../../Store/CompanySlice";
import { useAppDispatch } from "../../Store/Hooks";
import { enqueueSnackbar } from "notistack";

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

  async function HandleUpload()
  {
    if(file && !isUploading)
    {
      let documentId = v4();
      try
      {
        setIsUploading(true);
        await dispatch(uploadDocument({file: file, companyId: props.company.id, initiativeId: props.initiative?.id, documentId: documentId}));
        enqueueSnackbar("File uploaded successfully!", {variant:"success"})
        await props.GetData();
        setFile(null);
        setIsUploading(false);
        if(fileRef.current)
          fileRef.current.value = "";
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
          file:bg-gray-50 file:text-gray-700
          hover:file:bg-gray-100"
          onChange={(e) => HandleFiles(e.target.files)}
          ref={fileRef}
        />
        <UploadFileIcon className={((file === null || isUploading) ? "text-gray-400" : "hover:text-gray-400") + " block-inline align-baseline mt-4"} onClick={() => HandleUpload()} sx={{ fontSize:28 }}></UploadFileIcon>
      </div>
    </>
  )
}
