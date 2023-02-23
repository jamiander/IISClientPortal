import Modal from 'react-modal';
import { Initiative } from '../Store/CompanySlice';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from '../Styles';

interface EditInitiativeProps {
  editInitiativeIsOpen: boolean,
  setEditInitiativeIsOpen: (value: boolean) => void,
  initiative: Initiative,
  companyName: string
}

export default function EditInitiativeModal(props: EditInitiativeProps) {
  return (
    <Modal
      isOpen={props.editInitiativeIsOpen}
      onRequestClose={() => props.setEditInitiativeIsOpen(false)}
      style={{'content': {...modalStyle.content, 'width' : '25%', 'height' : '47%'}}}
      appElement={document.getElementById('root') as HTMLElement}     
    >

      <p className='text-3xl'>Edit Initiative</p>

      <div className='w-full'>

        <p className='my-1'>Company: {props.companyName}</p>

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
          <button className={submitButtonStyle + ' mt-6'}>Submit</button>
          <button className={cancelButtonStyle} onClick={() => props.setEditInitiativeIsOpen(false)}>Cancel</button>
        </div>
      </div>

    </Modal>
  )
}