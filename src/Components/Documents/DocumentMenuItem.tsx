import { useState } from 'react';
import { DocumentManagementModal } from './DocumentManagementModal';
import { Company, Initiative } from '../../Store/CompanySlice';
import { ActionsMenuItem } from '../ActionsMenuItem';
import { User } from '../../Store/UserSlice';

interface DocumentMenuItemProps {
  cypressData: string
  company: Company
  initiative?: Initiative
  currentUser: User
  CloseMenu: () => void
}

export function DocumentMenuItem(props: DocumentMenuItemProps)
{
  const [isOpen, setIsOpen] = useState(false);

  function HandleClose()
  {
    setIsOpen(false);
    props.CloseMenu();
  }

  return (
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="Documents" handleClick={() => setIsOpen(true)}/>
      <DocumentManagementModal {...props} isOpen={isOpen} HandleClose={HandleClose}/>
    </>
  )
}
