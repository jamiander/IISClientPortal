import { useState } from "react";
import { genericButtonStyle } from "../../Styles";
import { EditUserDataModal } from "./EditUserDataModal";
import { User } from "../../Store/UserSlice";
import { Company } from "../../Store/CompanySlice";

interface EditUserDataProps {
  company: Company
}

export function EditUserDataButton(props: EditUserDataProps){
  const [selectedCompany, setSelectedCompany] = useState<Company>(props.company);
  const [EditUserDataIsOpen, setEditUserDataIsOpen] = useState(false);

  function handleEditUserData(company: Company)
  {
    setEditUserDataIsOpen(true);
    setSelectedCompany(company);
  }

  const users: User[] = []; 

    return (
        <div className={'py-1 flex self-end'}>
          <button id={"editUserDataButton"+props.company.id} className={genericButtonStyle + " h-8 w-full mx-2"}
              onClick={() => handleEditUserData(props.company)}
          >
              Edit User Information
          </button>
          <EditUserDataModal title='Edit User Data' users= {users} isOpen={EditUserDataIsOpen} setEditUserDataModalIsOpen={setEditUserDataIsOpen} company={selectedCompany}/>
        </div>
      );
}