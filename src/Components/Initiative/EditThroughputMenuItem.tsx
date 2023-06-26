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
  SetIsTableLocked: (value: boolean) => void
  CloseMenu: () => void
}

export function EditThroughputMenuItem(props: EditThroughputMenuItemProps)
{
  const [isOpen, setIsOpen] = useState(false);

  function HandleClick()
  {
    props.SetIsTableLocked(true);
    setIsOpen(true);
  }

  function HandleClose()
  {
    props.SetIsTableLocked(false);
    setIsOpen(false);
    props.CloseMenu();
  }

  return (
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="View Throughput" handleClick={() => HandleClick()}/>
      <EditThroughputModal {...props} isOpen={isOpen} HandleClose={HandleClose} isAdmin={props.currentUser.isAdmin}/>
    </>
  )
}
