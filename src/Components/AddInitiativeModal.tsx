import { SetStateAction, useState } from 'react';
import Modal from 'react-modal';
import { Company, Initiative } from '../Store/CompanySlice';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from '../Styles';
import { DateInfo } from "../Services/CompanyService";
import { TargetDateInput } from './TargetDateInput';

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
          <select id='modalCompany' onChange={(e) => setInitiativeCompanyId(parseInt(e.target.value))} 
            className='outline outline-1 rounded p-2'
          >
            <option>Select Company</option>
            {
              props.companyList.map((company, index) => {
                return (
                  <option value={company.id} className='my-5' key={index}>{company.name}</option>
                )
              })
            }
          </select>

          <p className='my-1'>Title</p>
          <input id='modalTitle' className={inputStyle + ' w-3/4'} onChange={(e) => {setInitiativeTitle(e.target.value)}}/>
          
          <TargetDateInput initiativeTargetDate={initiativeTargetDate} setInitiativeTargetDate={setInitiativeTargetDate}/>
          {/*<div className='my-[15px] outline outline-2 outline-offset-4 outline-[#879794] rounded'>
            <p className='mt-2'>Target Completion</p>
            <div className='flex mb-2 space-x-[5px]'>
              <div>
                <p>Month </p>
                <input id='modalMonth' className={inputStyle + ' w-20 mx-1'} maxLength={2}
              onChange={(e) => {setInitiativeTargetDate({...initiativeTargetDate, month: e.target.value})}}
              placeholder='MM'/>
              </div>

              <div>
                <p>Day </p>
                <input id='modalDay' className={inputStyle + ' w-20 mx-1'} maxLength={2}
               onChange={(e) => {setInitiativeTargetDate({...initiativeTargetDate, day: e.target.value})}}
               placeholder='DD'/>
              </div>

              <div>
                <p>Year </p>        
                <input id='modalYear' className={inputStyle + ' w-20 mx-1'} maxLength={4}
              onChange={(e) => {setInitiativeTargetDate({...initiativeTargetDate, year: e.target.value})}}
              placeholder='YYYY'/>
              </div>
            </div>
          </div>*/}

          <p className='my-1'>Total Items</p>
          <input id='modalTotalItems' type={'number'} className={inputStyle + ' w-[150px]'} onChange={(e) => {setInitiativeTotalItems(parseInt(e.target.value))}}/>

        </div>
        
        <div className='mt-4 h-10'>

          <button className={submitButtonStyle} onClick={() => {
            let initiative : Initiative = {
              id: -1,
              title: initiativeTitle,
              targetDate: initiativeTargetDate,
              totalItems: initiativeTotalItems,
              itemsCompletedOnDate: []
            }
            props.Submit(initiative,initiativeCompanyId)
          }}>Submit</button>
          <button className={cancelButtonStyle} onClick={() => props.setInitiativeIsOpen(false)}>Close</button> 

        </div>

      </Modal>
    </div>
  )
}