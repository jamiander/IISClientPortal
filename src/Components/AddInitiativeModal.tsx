import { useState } from 'react';
import Modal from 'react-modal';
import { Company, Initiative } from '../Store/CompanySlice';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from '../Styles';
import { DateInfo } from "../Services/CompanyService";

interface AddInitiativeProps {
  addInitiativeIsOpen: boolean,
  setInitiativeIsOpen: (value: boolean) => void,
  Submit: (title: string, targetDate: DateInfo, totalItems: number, companyId: number) => void
  companyList: Company[]
}

export default function AddInitiativeModal(props: AddInitiativeProps) {
  const [initiativeCompanyId, setInitiativeCompanyId] = useState(Number);
  const [initiativeTitle, setInitiativeTitle] = useState(String);
  const [initiativeTargetDate, setInitiativeTargetDate] = useState<DateInfo>({ month: "", day: "", year: "" });
  const [initiativeTotalItems, setInitiativeTotalItems] = useState(Number);

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

          <p className='my-1'>Company</p>
          <select onChange={(e) => setInitiativeCompanyId(parseInt(e.target.value))} 
            className='outline outline-1 rounded p-2'
          >
            <option>Select Company</option>
            {
              props.companyList.map((company, index) => {
                return (
                  <option className='my-5' key={index}>{company.name}</option>
                )
              })
            }
          </select>

          <p className='my-1'>Title</p>
          <input className={inputStyle + ' w-3/4'} onChange={(e) => {setInitiativeTitle(e.target.value)}} id='modalTitle'/>
          
          <p className='mt-2'>Target Completion</p>
          <div className='flex mb-2'>
            <div>
              <p>Month </p>
              <input className={inputStyle + ' w-20 mx-1'} onChange={(e) => {setInitiativeTargetDate({...initiativeTargetDate, month: e.target.value})}}/>
            </div>
            
            <div>
              <p>Day </p>
              <input className={inputStyle + ' w-20 mx-1'} onChange={(e) => {setInitiativeTargetDate({...initiativeTargetDate, day: e.target.value})}}/>
            </div>

            <div>
              <p>Year </p>        
              <input className={inputStyle + ' w-20 mx-1'} onChange={(e) => {setInitiativeTargetDate({...initiativeTargetDate, year: e.target.value})}}/>
            </div>
          </div>

          <p className='my-1'>Total Items</p>
          <input type={'number'} className={inputStyle + ' w-20'} id='modalTotalItems' onChange={(e) => {setInitiativeTotalItems(parseInt(e.target.value))}}/>

        </div>
        
        <div className='mt-4 h-10'>

          <button className={submitButtonStyle} onClick={() => props.Submit(initiativeTitle,initiativeTargetDate,initiativeTotalItems,initiativeCompanyId)}>Submit</button>
          <button className={cancelButtonStyle} onClick={() => props.setInitiativeIsOpen(false)}>Close</button> 

        </div>

      </Modal>
    </div>
  )
}