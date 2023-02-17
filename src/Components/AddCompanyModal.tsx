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
  openCompanyModal: () => void,
  closeCompanyModal: () => void,
  validateCompany: () => boolean,
  setCompanyName: (value:string) => void,
  submitNewCompany: () => void
}

export default function AddCompanyModal(props: AddCompanyProps) {
  
  return (
    <div className="flex justify-end">
      <button onClick={props.openCompanyModal} className="outline bg-[#21345b] text-white h-[75%] w-[80%] rounded my-1">Add Company</button>
      <Modal
        isOpen={props.companyModalIsOpen}
        onRequestClose={props.closeCompanyModal}
        style={{...props.modalStyle}}
      >
        <div className="space-x-3">
          <p className="text-3xl">Add Company</p>
          <input placeholder='Company Name' onChange={(e)=>props.setCompanyName(e.target.value)} className="outline rounded outline-1 p-2"></input>
          <button disabled={!props.validateCompany()} className="rounded h-[40px] w-[80px] bg-lime-600" onClick={() => props.submitNewCompany()}>Submit</button>

          <button className="rounded h-[40px] w-[80px] bg-red-600" onClick={props.closeCompanyModal}>Close</button>
        </div>  
      </Modal>
    </div>
  )
}
