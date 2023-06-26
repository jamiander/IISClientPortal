import { useState } from 'react';
import { DocumentManagementModal } from './DocumentManagementModal';
import { Company, Initiative } from '../../Store/CompanySlice';
import { ActionsMenuItem } from '../ActionsMenuItem';
import { User } from '../../Store/UserSlice';

interface DocumentManagementButtonProps {
  cypressData: string
  company: Company
  initiative?: Initiative
  currentUser: User
}

export function DocumentMenuItem(props: DocumentManagementButtonProps)
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="Documents" handleClick={() => setIsOpen(true)}/>
      <DocumentManagementModal company={props.company} initiative={props.initiative} isAdmin={props.currentUser.isAdmin} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </>
  )
}
