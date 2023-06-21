import { useState } from "react";
import { ActionsMenuItem } from "../ActionsMenuItem";
import EditThroughputModal from "./EditThroughputModal";
import { Company, Initiative } from "../../Store/CompanySlice";
import { User } from "../../Store/UserSlice";
import { ThroughputData } from "../../Services/CompanyService";

interface EditThroughputMenuItemProps {
  cypressData: string
  allCompanies: Company[]
  company: Company
  initiative: Initiative
  currentUser: User
  SubmitUpdateThroughput: (companyId: string, initiativeId: string, dataList: ThroughputData[], emptyDataCheck: boolean) => Promise<boolean>
}

export function EditThroughputMenuItem(props: EditThroughputMenuItemProps)
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="View Throughput" handleClick={() => setIsOpen(true)}/>
      <EditThroughputModal allCompanies={props.allCompanies} company={props.company} initiative={props.initiative} editIsOpen={isOpen} setEditIsOpen={setIsOpen} Submit={props.SubmitUpdateThroughput} isAdmin={props.currentUser.isAdmin}/>
    </>
  )
}
