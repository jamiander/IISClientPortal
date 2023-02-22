import Modal from 'react-modal';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from '../Styles';

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

        <p className='text-3xl'>Add Initiative</p>

        <div className='w-full'>

          <p className='my-1'>Title:</p>
          <input className={inputStyle}/>
          
          <p className='my-1'>Target Date:</p>
          <input className={inputStyle}/>

          <p className='my-1'>Total Items:</p>
          <input className={inputStyle}/>

        </div>
        
        <div className='mt-2 h-10'>

          <button className={submitButtonStyle} >Submit</button>
          <button className={cancelButtonStyle} onClick={() => props.setInitiativeIsOpen(false)}>Close</button> 

        </div>

      </Modal>
    </div>
  )
}