import Modal from 'react-modal';
import { modalStyle } from '../Pages/AdminPage';
import { Company } from '../Store/CompanySlice';

interface AddUserProps {
  userModalIsOpen: boolean,
  openUserModal: () => void,
  closeUserModal: () => void,
  setCompanyName: (value: string) => void,
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
            
            <div className='outline outline-2 w-[120%] my-3 outline-[#2ed7c3] -translate-x-10' />

            <p className='my-1'>Company:</p>
            <input id='modalCompany' list="companies" type="text" className="outline rounded outline-1 p-2" onChange={(e) => props.setCompanyName(e.target.value)}/>
            {/*<datalist id="companies">
                {props.companyList.map((company,index) => {
                  return (
                    <option key={index} value={company.name}>{company.name}</option>
                  )
                })}
              </datalist>*/}
          
            <p className='my-1'>Name:</p>
            <input id="modalUsername" onChange={(e)=>props.setName(e.target.value)} className="outline rounded outline-1 p-2"/>

            <p className='my-1'>Email:</p>            
            <input id="modalEmail" onChange={(e)=>props.setEmail(e.target.value)} className="outline rounded outline-1 p-2"/>

            <p className='my-1'>Password:</p>
            <input id="modalPassword" onChange={(e)=>props.setPassword(e.target.value)} className="outline rounded outline-1 p-2"/>

            <button disabled={!props.validateUser()} className="rounded h-[40px] w-[80px] bg-lime-600" onClick={() => props.submitNewUser()}>Submit</button>
            <button className="rounded h-[40px] w-[80px] bg-red-600" onClick={props.closeUserModal}>Close</button> 

          </div>
        </Modal>
      </div>
    )
}