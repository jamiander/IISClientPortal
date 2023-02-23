import { useState } from 'react';
import Modal from 'react-modal';
import { Company, Initiative } from '../Store/CompanySlice';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from '../Styles';

interface EditInitiativeProps {
  editInitiativeIsOpen: boolean,
  setEditInitiativeIsOpen: (value: boolean) => void,
  initiative: Initiative,
  company: Company,
  submitUpdateInitiative: (initiative: Initiative, companyId: number) => void
}

export default function EditInitiativeModal(props: EditInitiativeProps) {
  const [initiativeTitle, setInitiativeTitle] = useState(props.initiative.title);
  const [initiativeTargetDate, setInitiativeTargetDate] = useState(props.initiative.targetDate);
  const [initiativeTotalItems, setInitiativeTotalItems] = useState(props.initiative.totalItems);

  return (
    <Modal
      isOpen={props.editInitiativeIsOpen}
      onRequestClose={() => props.setEditInitiativeIsOpen(false)}
      style={{'content': {...modalStyle.content, 'width' : '25%', 'height' : '47%'}}}
      appElement={document.getElementById('root') as HTMLElement}     
    >

      <p className='text-3xl'>Edit Initiative</p>

      <div className='w-full'>

        <p className='my-1'>Company: {props.company.name}</p>

        <p className='my-1'>Title</p>
        <input defaultValue={props.initiative.title} id='modalTitle' className={inputStyle + ' w-3/4'}/>
        
        <div className='my-2 p-2 outline outline-1 outline-gray-500 rounded'>
          <span className=''>Target Completion</span>
          <div className='flex'>
            <div className='w-24 mx-2'>
              <p>Month </p>
              <input defaultValue={props.initiative.targetDate.month} id='modalMonth' className={inputStyle} />
            </div>
            
            <div className='w-24 mx-2'>
              <p>Day </p>
              <input defaultValue={props.initiative.targetDate.day} id='modalDay' className={inputStyle} />
            </div>

            <div className='w-24 mx-2'>
              <p>Year </p>        
              <input defaultValue={props.initiative.targetDate.year} id='modalYear' className={inputStyle} />
            </div>
          </div>
        </div>
      </div>
      
      <div className='mt-2 h-10 justify-between flex'>
        <div>
          <p>Total Items</p>
          <input defaultValue={props.initiative.totalItems} id='modalTotalItems' type={'number'} className={inputStyle + ' w-24'} />
        </div>
        <div>
          <button className={submitButtonStyle + ' mt-6'} onClick={() => {
            let initiative: Initiative = {
              id: props.initiative.id,
              title: initiativeTitle,
              targetDate: initiativeTargetDate,
              totalItems: initiativeTotalItems,
              itemsCompletedOnDate: props.initiative.itemsCompletedOnDate
            }
            props.submitUpdateInitiative(initiative, props.company.id);
          }}>Submit</button>
          <button className={cancelButtonStyle} onClick={() => props.setEditInitiativeIsOpen(false)}>Cancel</button>
        </div>
      </div>

    </Modal>
  )
}