import Modal from 'react-modal';
import { modalStyle } from '../Styles';

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
                style={modalStyle}
                appElement={document.getElementById('root') as HTMLElement}     
            >

            </Modal>
        </div>
    )
}