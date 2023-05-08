import { useState } from "react";
import { submitButtonStyle } from "../../Styles";
import EditUserDataModal from "./EditUserDataModal";
import { User } from "../../Store/UserSlice";
import { Company } from "../../Store/CompanySlice";

interface EditUserDataProps {
  company: Company
  users: User[]
}

export function EditUserDataButton(props: EditUserDataProps){
  const [selectedCompany, setSelectedCompany] = useState<Company>(props.company);
  const [EditUserDataIsOpen, setEditUserDataIsOpen] = useState(false);

  function handleEditUserData(company: Company)
  {
    setEditUserDataIsOpen(true);
    setSelectedCompany(company);
  }

    return (
        <div className={'py-1 flex self-end'}>
          <button id={"editUserDataButton"+props.company.id} className={submitButtonStyle}
              onClick={() => handleEditUserData(props.company)}
          >
              Edit
          </button>
          <EditUserDataModal title='Edit User Data' users={props.users} isOpen={EditUserDataIsOpen} setEditUserDataModalIsOpen={setEditUserDataIsOpen} company={selectedCompany}/>
        </div>
      );
}