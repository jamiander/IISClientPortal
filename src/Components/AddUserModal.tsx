import Modal from 'react-modal';
import { modalStyle } from '../Pages/AdminPage';
import { Company } from '../Store/CompanySlice';

interface AddUserProps {
  userModalIsOpen: boolean,
  openUserModal: () => void,
  closeUserModal: () => void,
  setCompany: (value: string) => void,
  companyList: Company[],
  setName: (value: string) => void,
  setEmail: (value: string) => void,
  setPassword: (value: string) => void,
  validateUser: () => boolean,
  submitNewUser: () => void
}

export default function AddUserModal(props: AddUserProps) {

    return (
      <div className="flex justify-end">

        <button onClick={props.openUserModal} className="outline bg-[#21345b] text-white h-[90%] w-[80%] rounded">Add User</button>

        <Modal
            isOpen={props.userModalIsOpen}
            onRequestClose={props.closeUserModal}
            style={modalStyle}
        >
          <div className="space-x-3">
            <p className="text-3xl">Add User</p>
            
            <p>Company:</p>
            <select className="outline rounded" onChange={(e)=>props.setCompany(e.target.value)}>
              <option value={-1}></option>
                {props.companyList.map((company,index) => {
                  return (
                    <option key={index} value={company.id}>{company.name}</option>
                  )
                })}
            </select>
          
            <p>Name:</p>
            <input onChange={(e)=>props.setName(e.target.value)} className="outline rounded"/>

            <p>Email:</p>            
            <input onChange={(e)=>props.setEmail(e.target.value)} className="outline rounded"/>

            <p>Password:</p>
            <input onChange={(e)=>props.setPassword(e.target.value)} className="outline rounded"/>

            <button disabled={!props.validateUser()} className="rounded h-[40px] w-[80px] bg-lime-600" onClick={() => props.submitNewUser()}>Submit</button>
            <button className="rounded h-[40px] w-[80px] bg-red-600" onClick={props.closeUserModal}>Close</button> 

          </div>
        </Modal>
      </div>
    )
}