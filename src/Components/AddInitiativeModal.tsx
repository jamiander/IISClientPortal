import Modal from 'react-modal';
import { inputStyle, modalStyle } from '../Styles';

interface AddInitiativeProps {
  addInitiativeIsOpen: boolean,
  setInitiativeIsOpen: (value: boolean) => void
}

export default function AddInitiativeModal(props: AddInitiativeProps) {

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
        <div className='space-x-3'>
          <p className='text-3xl'>Add Initiative</p>

          <div className='w-full'>
            <p>Title:</p>
            <input className={inputStyle}/>
            
            <p>Target Date:</p>
            <input className={inputStyle}/>
            
            <p>Total Items:</p>
            <input className={inputStyle}/>
          </div>
        </div>
      </Modal>
    </div>
  )
}