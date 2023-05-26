import { useState } from 'react';
import { DocumentManagementModal } from './DocumentManagementModal';
import { genericButtonStyle } from '../../Styles';
import { Company, Initiative } from '../../Store/CompanySlice';

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
      <button disabled={props.disabled} className={genericButtonStyle} onClick={() => setIsOpen(true)}>
        View
      </button>
      <DocumentManagementModal company={props.company} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}
