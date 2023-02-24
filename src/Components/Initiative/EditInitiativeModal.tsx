import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Company, Initiative } from '../../Store/CompanySlice';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from '../../Styles';
import { DateInput} from './../DateInput';

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

  useEffect(() => {
    setInitiativeTitle(props.initiative.title);
    setInitiativeTargetDate(props.initiative.targetDate);
    setInitiativeTotalItems(props.initiative.totalItems);
  }, [props.initiative,props.company])

  return (
    <Modal
      isOpen={props.editInitiativeIsOpen}
      onRequestClose={() => props.setEditInitiativeIsOpen(false)}
      style={{'content': {...modalStyle.content, 'width' : '25%'}}}
      appElement={document.getElementById('root') as HTMLElement}     
    >

      <p className='text-3xl'>Edit Initiative</p>

      <div className='w-full'>

        <p className='my-1'>Company: {props.company.name}</p>

        <p className='my-1'>Title</p>
        <input defaultValue={props.initiative.title} id='modalTitle' className={inputStyle + ' w-3/4'}
          onChange={(e) => setInitiativeTitle(e.target.value)}/>
        <DateInput heading='Target Completion' initiativeTargetDate={initiativeTargetDate} setInitiativeTargetDate={setInitiativeTargetDate} defaultInitiative={props.initiative}/>
      </div>
      
      <div className='mt-2 justify-between flex'>
        <div className='w-24'>
          <p>Total Items</p>
          <input defaultValue={props.initiative.totalItems} id='modalTotalItems' type={'number'} className={inputStyle} 
            onChange={(e) => setInitiativeTotalItems(parseInt(e.target.value))}/>
        </div>
        <div className='h-10'>
          <button className={submitButtonStyle + ' mt-6'} 
            onClick={() => {
              let initiative: Initiative = {
                id: props.initiative.id,
                title: initiativeTitle,
                targetDate: initiativeTargetDate,
                totalItems: initiativeTotalItems,
                itemsCompletedOnDate: props.initiative.itemsCompletedOnDate
              }
              props.submitUpdateInitiative(initiative, props.company.id);
            }}> Submit
          </button>
          <button className={cancelButtonStyle} onClick={() => props.setEditInitiativeIsOpen(false)}>Cancel</button>
        </div>
      </div>

    </Modal>
  )
}