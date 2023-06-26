import { useState } from "react";
import { ActionsMenuItem } from "../ActionsMenuItem";
import { Company, Initiative } from "../../Store/CompanySlice";
import { ThroughputData } from "../../Services/CompanyService";
import UploadThroughputModal from "./UploadThroughputModal";

interface UploadThroughputMenuItemProps {
  cypressData: string
  company: Company
  initiative: Initiative
  SubmitUpdateThroughput: (companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean) => Promise<boolean>
  CloseMenu: () => void
}

export function UploadThroughputMenuItem(props: UploadThroughputMenuItemProps)
{
  const [isOpen, setIsOpen] = useState(false);

  function HandleClose()
  {
    setIsOpen(false);
    props.CloseMenu();
  }

  return (
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="Upload Throughput" handleClick={() => setIsOpen(true)}/>
      <UploadThroughputModal {...props} isOpen={isOpen} HandleClose={HandleClose} Submit={props.SubmitUpdateThroughput}/>
    </>
  )
}
