import { useState } from 'react';
import Modal from 'react-modal';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from '../Styles';

interface AddInitiativeProps {
  addInitiativeIsOpen: boolean,
  setInitiativeIsOpen: (value: boolean) => void,
  Submit: (title: string, targetDate: string, totalItems: number, companyId: number) => void
}

export default function AddInitiativeModal(props: AddInitiativeProps) {
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [companyId, setCompanyId] = useState(-1);

  return (
    <div className="flex justify-end">
      <button onClick={() => props.setInitiativeIsOpen(true)} className="outline bg-[#21345b] text-white h-[100%] w-[80%] rounded-md">
        Add Initiative
      </button>

      <Modal
        isOpen={props.addInitiativeIsOpen}
        onRequestClose={() => props.setInitiativeIsOpen(false)}
        style={{'content': {...modalStyle.content, 'width' : '25%'}}}
        appElement={document.getElementById('root') as HTMLElement}     
      >

        <p className='text-3xl'>Add Initiative</p>

        <div className='w-full'>

          <p className='my-1'>Title:</p>
          <input className={inputStyle} onChange={(e) => setTitle(e.target.value)} id='modalTitle'/>
          
          <p className='my-1'>Target Date:</p>
          <input className={inputStyle} onChange={(e) => setTargetDate(e.target.value)} id='modalTargetDate'/>

          <p className='my-1'>Total Items:</p>
          <input className={inputStyle} onChange={(e) => setTotalItems(parseInt(e.target.value))} id='modalTotalItems'/>

        </div>
        
        <div className='mt-2 h-10'>

          <button className={submitButtonStyle} onClick={() => props.Submit(title,targetDate,totalItems,companyId)}>Submit</button>
          <button className={cancelButtonStyle} onClick={() => props.setInitiativeIsOpen(false)}>Close</button> 

        </div>

      </Modal>
    </div>
  )
}