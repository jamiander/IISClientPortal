import { useState } from 'react';
import { DocumentManagementModal } from './DocumentManagementModal';
import { genericButtonStyle } from '../../Styles';
import { Company } from '../../Store/CompanySlice';

interface DocumentManagementButtonProps {
  company: Company
}

export function DocumentManagementButton(props: DocumentManagementButtonProps)
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button className={genericButtonStyle} onClick={() => setIsOpen(true)}>
        View
      </button>
      <DocumentManagementModal company={props.company} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}
