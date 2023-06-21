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
}

export function UploadThroughputMenuItem(props: UploadThroughputMenuItemProps)
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="Upload Throughput" handleClick={() => setIsOpen(true)}/>
      <UploadThroughputModal company={props.company} initiative={props.initiative} uploadIsOpen={isOpen} setUploadIsOpen={setIsOpen} Submit={props.SubmitUpdateThroughput}/>
    </>
  )
}
