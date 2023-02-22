import Modal from 'react-modal';
import { modalStyle } from '../Styles';

interface AddInitiativeProps {
  addInitiativeIsOpen: boolean,
  setInitiativeIsOpen: (value: boolean) => void
}

export default function AddInitiativeModal(props: AddInitiativeProps) {
  const inputStyle = "outline rounded outline-1 p-2 w-full";

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
            <input />
            
            <p>Target Date:</p>
            <p>Total Items:</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}