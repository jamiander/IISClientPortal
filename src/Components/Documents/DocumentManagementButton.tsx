import { useState } from 'react';
import { DocumentManagementModal } from './DocumentManagementModal';
import { genericButtonStyle } from '../../Styles';
import { Company, Initiative } from '../../Store/CompanySlice';
import { Button } from '@mui/material';

interface DocumentManagementButtonProps {
  cypressData: string
  company: Company
  initiative?: Initiative
  disabled?: boolean
  isAdmin: boolean
}

export function DocumentManagementButton(props: DocumentManagementButtonProps)
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button data-cy={props.cypressData} disabled={props.disabled} className={genericButtonStyle} onClick={() => setIsOpen(true)}>
        Documents
      </Button>
      <DocumentManagementModal company={props.company} initiative={props.initiative} isAdmin={props.isAdmin} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}
