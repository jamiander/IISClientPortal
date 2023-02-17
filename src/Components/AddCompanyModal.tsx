import Modal from 'react-modal';

interface AddCompanyProps {
  modalStyle: {
    content: {
      top: string,
      left: string,
      right: string,
      bottom: string,
      marginRight: string,
      transform: string,
    }
  },
  companyModalIsOpen: boolean,
  closeCompanyModal: () => void,
  validateCompany: () => boolean,
  setCompanyName: (value:string) => void,
  submitNewCompany: () => void
}

export function AddCompanyModal(props: AddCompanyProps) {
  return (
    <Modal
      isOpen={props.companyModalIsOpen}
      onRequestClose={props.closeCompanyModal}
      style={props.modalStyle}
    >
      <div className="space-x-3">
        <p className="text-3xl my-3">Add Company</p>
        <input onChange={(e)=>props.setCompanyName(e.target.value)} className="outline rounded"></input>
        <button disabled={!props.validateCompany()} className="rounded h-[40px] w-[80px] bg-lime-600" onClick={() => props.submitNewCompany()}>Submit</button>

        <button className="rounded h-[40px] w-[80px] bg-red-600" onClick={props.closeCompanyModal}>Close</button>
      </div>  
    </Modal>
  )
}
