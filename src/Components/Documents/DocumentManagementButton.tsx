import { useState } from 'react';
import { DocumentManagementModal } from './DocumentManagementModal';
import { genericButtonStyle } from '../../Styles';
import { Company, Initiative } from '../../Store/CompanySlice';
import { Button } from '@mui/material';

interface DocumentManagementButtonProps {
  company: Company
  initiative?: Initiative
  disabled?: boolean
}

export function DocumentManagementButton(props: DocumentManagementButtonProps)
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button disabled={props.disabled} className={genericButtonStyle} onClick={() => setIsOpen(true)}>
        Documents
      </Button>
      <DocumentManagementModal company={props.company} initiative={props.initiative} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}
