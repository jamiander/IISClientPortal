import { useState } from "react";
import { uploadDocument } from "../../Store/DocumentSlice";
import { v4 } from "uuid";
import { Company, Initiative } from "../../Store/CompanySlice";
import { useAppDispatch } from "../../Store/Hooks";
import { enqueueSnackbar } from "notistack";
import { FileUpload } from "../FileUpload";

interface DocumentUploadProps {
  cypressData: {
    uploadButton: string,
    submitButton: string
  }
  company: Company
  initiative?: Initiative
  GetData: () => Promise<void>
}

export function DocumentUpload(props: DocumentUploadProps)
{
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  function ResetFiles()
  {
    setFile(null);
    setIsUploading(false);
    //if(fileRef.current)
      //fileRef.current.value = "";
  }

  async function UploadFile()
  {
    if(file)
    {
      setIsUploading(true);
      let documentId = v4();
      await dispatch(uploadDocument({file: file, companyId: props.company.id, initiativeId: props.initiative?.id, documentId: documentId}));

      setTimeout(async () => {
        await props.GetData();
        enqueueSnackbar("File uploaded successfully!", {variant:"success"});
        ResetFiles();
      }, 2000);
    }
  }

  return (
    <>
      <FileUpload cypressData={props.cypressData} file={file} setFile={setFile} isUploading={isUploading} UploadFile={UploadFile}/>
    </>
  )
}
