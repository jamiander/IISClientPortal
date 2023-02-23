import Modal from 'react-modal';
import { inputStyle, modalStyle } from '../Styles';

interface EditInitiativeProps {
  editInitiativeIsOpen: boolean,
  setEditInitiativeIsOpen: (value: boolean) => void
}

export default function EditInitiativeModal(props: EditInitiativeProps) {
  return (
    <Modal
      isOpen={props.editInitiativeIsOpen}
      onRequestClose={() => props.setEditInitiativeIsOpen(false)}
      style={{'content': {...modalStyle.content, 'width' : '25%'}}}
      appElement={document.getElementById('root') as HTMLElement}     
    >

      <p className='text-3xl'>Add Initiative</p>

      <div className='w-full'>

        <p className='my-1'>Company</p>

        <p className='my-1'>Title</p>
        <input id='modalTitle' className={inputStyle + ' w-3/4'}/>
        
        <p className='mt-2'>Target Completion</p>
        <div className='flex mb-2'>
          <div>
            <p>Month </p>
            <input id='modalMonth' className={inputStyle + ' w-20 mx-1'} />
          </div>
          
          <div>
            <p>Day </p>
            <input id='modalDay' className={inputStyle + ' w-20 mx-1'} />
          </div>

          <div>
            <p>Year </p>        
            <input id='modalYear' className={inputStyle + ' w-20 mx-1'} />
          </div>
        </div>

        <p className='my-1'>Total Items</p>
        <input id='modalTotalItems' type={'number'} className={inputStyle + ' w-20'} />

      </div>
      
      <div className='mt-4 h-10'>


      </div>

    </Modal>
  )
}