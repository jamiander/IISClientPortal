import { useEffect, useState } from 'react';
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
          onChange={(e) => setInitiativeTitle(e.target.value)}
        />
        
        <div className='my-2 p-2 outline outline-1 outline-[#879794] rounded'>
          <span className=''>Target Completion</span>
          <div className='flex'>
            <div className='w-24 mx-2'>
              <p>Month </p>
              <input defaultValue={props.initiative.targetDate.month} id='modalMonth' className={inputStyle} maxLength={2} placeholder='MM'
                onChange={(e) => setInitiativeTargetDate({...initiativeTargetDate, month: e.target.value})}
              />
            </div>
            
            <div className='w-24 mx-2'>
              <p>Day </p>
              <input defaultValue={props.initiative.targetDate.day} id='modalDay' className={inputStyle} maxLength={2} placeholder='DD'
                onChange={(e) => setInitiativeTargetDate({...initiativeTargetDate, day: e.target.value})}
              />
            </div>

            <div className='w-24 mx-2'>
              <p>Year </p>        
              <input defaultValue={props.initiative.targetDate.year} id='modalYear' className={inputStyle} maxLength={4} placeholder='YYYY'
                onChange={(e) => setInitiativeTargetDate({...initiativeTargetDate, year: e.target.value})}
              />
            </div>
          </div>
        </div>
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