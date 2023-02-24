import { SetStateAction, useState } from 'react';
import Modal from 'react-modal';
import { Company, Initiative } from '../Store/CompanySlice';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from '../Styles';
import { DateInfo } from "../Services/CompanyService";
import { DateInput } from './DateInput';

interface AddInitiativeProps {
  addInitiativeIsOpen: boolean,
  setInitiativeIsOpen: (value: boolean) => void,
  Submit: (initiative: Initiative, companyId: number) => void
  companyList: Company[]
}

export default function AddInitiativeModal(props: AddInitiativeProps) {
  const [initiativeCompanyId, setInitiativeCompanyId] = useState(Number);
  const [initiativeTitle, setInitiativeTitle] = useState(String);
  const [initiativeTargetDate, setInitiativeTargetDate] = useState<DateInfo>({ month: "", day: "", year: "" });
  const [initiativeTotalItems, setInitiativeTotalItems] = useState(Number);

  return (
    <div className="flex justify-end">
      <button onClick={() => props.setInitiativeIsOpen(true)} className="outline bg-[#21345b] text-white h-full w-32 rounded-md">
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
          <select id='modalCompany' onChange={(e) => setInitiativeCompanyId(parseInt(e.target.value))} 
            className='outline outline-1 rounded p-2'
          >
            <option>Select Company</option>
            {
              props.companyList.map((company, index) => {
                return (
                  <option value={company.id} key={index}>{company.name}</option>
                )
              })
            }
          </select>

          <p className='my-1'>Title</p>
          <input id='modalTitle' className={inputStyle + ' w-3/4'} onChange={(e) => {setInitiativeTitle(e.target.value)}}/>
          
          <DateInput heading={'Target Completion'} initiativeTargetDate={initiativeTargetDate} setInitiativeTargetDate={setInitiativeTargetDate}/>
        </div>
    
        <div className='mt-2 justify-between flex'>
          <div className='w-24'>
            <p>Total Items</p>
            <input id='modalTotalItems' type={'number'} className={inputStyle} onChange={(e) => {setInitiativeTotalItems(parseInt(e.target.value))}}/>
          </div>
  
          <div className='h-10'>
            <button className={submitButtonStyle + ' mt-6'} 
              onClick={() => {
                let initiative : Initiative = {
                  id: -1,
                  title: initiativeTitle,
                  targetDate: initiativeTargetDate,
                  totalItems: initiativeTotalItems,
                  itemsCompletedOnDate: []
                }
                props.Submit(initiative,initiativeCompanyId)
              }}> Submit
            </button>
            <button className={cancelButtonStyle} onClick={() => props.setInitiativeIsOpen(false)}>Close</button> 
          
          </div>
        </div>

      </Modal>
    </div>
  )
}