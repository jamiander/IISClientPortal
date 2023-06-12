import { useState } from 'react';
import { DocumentManagementModal } from './DocumentManagementModal';
import { IntegrityTheme, genericButtonStyle } from '../../Styles';
import { Company, Initiative } from '../../Store/CompanySlice';
import { Button, ThemeProvider } from '@mui/material';

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
      <ThemeProvider theme={IntegrityTheme}>
        <Button variant="outlined" color="darkBlue" data-cy={props.cypressData} disabled={props.disabled} onClick={() => setIsOpen(true)}>
          Documents
        </Button>
      </ThemeProvider>
      <DocumentManagementModal company={props.company} initiative={props.initiative} isAdmin={props.isAdmin} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}
