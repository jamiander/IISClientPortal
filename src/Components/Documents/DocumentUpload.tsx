import { useState } from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { DocumentInfo, getDocumentUrls, uploadDocument } from "../../Store/DocumentSlice";
import { v4 } from "uuid";
import { Company, IntegrityId } from "../../Store/CompanySlice";
import { useAppDispatch } from "../../Store/Hooks";
import { StyledTextField, yellowButtonStyle } from "../../Styles";
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

  function HandleFiles(files: FileList | null)
  {
    if(files)
      setFile(files[0]);
  }

  return (
    <>
      <div className="flex justify-center h-full">
        <input type="file" className="block w-full text-sm text-slate-500 file:mt-4
          file:mr-2 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-gray-50 file:text-gray-700
          hover:file:bg-gray-100"
          onChange={(e) => HandleFiles(e.target.files)}
        />
        <IconButton className="align-middle" disabled={file === null} onClick={() => HandleUpload()}>
          <UploadFileIcon sx={{ fontSize:28 }}></UploadFileIcon>
        </IconButton>
      </div>
    </>
  )
}
