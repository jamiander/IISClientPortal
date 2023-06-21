import { useState } from 'react';
import { DocumentManagementModal } from './DocumentManagementModal';
import { Company, Initiative } from '../../Store/CompanySlice';
import { ActionsMenuItem } from '../ActionsMenuItem';

interface DocumentManagementButtonProps {
  cypressData: string
  company: Company
  initiative?: Initiative
  isAdmin: boolean
}

export function DocumentMenuItem(props: DocumentManagementButtonProps)
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ActionsMenuItem cypressData={props.cypressData} text="Documents" handleClick={() => setIsOpen(true)}/>
      <DocumentManagementModal company={props.company} initiative={props.initiative} isAdmin={props.isAdmin} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </>
  )
}
