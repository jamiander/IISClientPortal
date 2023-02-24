import Modal from 'react-modal';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from '../Styles';
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
  submitNewUser: () => void
}

export default function AddUserModal(props: AddUserProps) {

    return (
      <div>

        <button onClick={props.openUserModal} className="outline bg-[#21345b] text-white h-full w-28 rounded-md">Add Client</button>

        <Modal
            isOpen={props.userModalIsOpen}
            onRequestClose={props.closeUserModal}
            style={{'content': {...modalStyle.content, 'width': '25%'}}}
            appElement={document.getElementById('root') as HTMLElement}
        >
          
          <div className="w-full">
            <p className="text-3xl">Add Client</p>
            
            {/* <div className='outline outline-2 w-[120%] my-3 outline-[#2ed7c3] -translate-x-10' /> */}

            <p className='my-1'>Company Name:</p>
            <input id='modalCompany' list="companies" type="text" className={inputStyle} onChange={(e) => props.setCompanyName(e.target.value)}/>
            {/*<datalist id="companies">
                {props.companyList.map((company,index) => {
                  return (
                    <option key={index} value={company.name}>{company.name}</option>
                  )
                })}
              </datalist>*/}
          
            {/* <p className='my-1'>Name:</p>
            <input id="modalUsername" onChange={(e)=>props.setName(e.target.value)} className="outline rounded outline-1 p-2"/> */}

            <p className='my-1'>Email:</p>            
            <input id="modalEmail" onChange={(e)=>props.setEmail(e.target.value)} className={inputStyle}/>

            <p className='my-1'>Password:</p>
            <input id="modalPassword" onChange={(e)=>props.setPassword(e.target.value)} className={inputStyle}/>
          </div>

          <div className='mt-2 h-10'>

            <button className={submitButtonStyle} onClick={() => props.submitNewUser()}>Submit</button>
            <button className={cancelButtonStyle} onClick={props.closeUserModal}>Close</button> 

          </div>
        </Modal>
      </div>
    )
}