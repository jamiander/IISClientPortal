import { Button, CircularProgress } from "@mui/material";
import { useRef, useState } from "react";

interface FileUploadProps {
  file: File | null
  setFile: (value: File | null) => void
  isUploading: boolean
  UploadFile: () => Promise<void>
  cypressData: {
    chooseFileButton: string
    submitButton: string
    fileInput: string
  }
  accept?: string
}

export function FileUpload(props: FileUploadProps)
{
  const fileRef = useRef<HTMLInputElement>(null);

  function CanUpload(myFile: File | null): myFile is File
  {
    return (myFile !== null && !props.isUploading);
  }

  function HandleChooseFiles(files: FileList | null)
  {
    if(files)
      props.setFile(files[0]);
  }

  async function HandleUpload()
  {
    if(CanUpload(props.file))
    {
      try
      {
        await props.UploadFile();
      }
      catch(e)
      {
        console.log((e as Error).message);
      }
    }
  }

  return (
    <>
      <input type="file" className="hidden"
        onChange={(e) => HandleChooseFiles(e.target.files)}
        ref={fileRef}
        data-cy={props.cypressData.fileInput}
      />
      <span className="h-full align-middle">
        <Button data-cy={props.cypressData.chooseFileButton} variant="outlined" onClick={() => fileRef.current?.click()}>
          Choose File
        </Button>
        <span className="mx-2">{props.file?.name ?? "No file selected"}</span>
        <Button data-cy={props.cypressData.submitButton} variant="contained" disabled={!CanUpload(props.file)} onClick={() => HandleUpload()}>
          {/*<UploadFileIcon  sx={{ fontSize:28 }}/>*/}
          Upload
        </Button>
        
        {props.isUploading &&
          <CircularProgress size={30} color={"warning"} className="mt-4 ml-2"/>
        }
      </span>
    </>
  )
}
