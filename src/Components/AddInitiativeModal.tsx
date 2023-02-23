import { useState } from 'react';
import Modal from 'react-modal';
import { Company, Initiative } from '../Store/CompanySlice';
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from '../Styles';
import { DateInfo } from "../Services/CompanyService";

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
                  <option value={company.id} key={index}>{company.name}</option>
                )
              })
            }
          </select>

          <p className='my-1'>Title</p>
          <input id='modalTitle' className={inputStyle + ' w-3/4'} onChange={(e) => {setInitiativeTitle(e.target.value)}}/>
          
          <div className='my-2 p-2 outline outline-1 outline-[#879794] rounded'>
            <p className=''>Target Completion</p>
            <div className='flex'>
              <div className='w-24 mx-2'>
                <p>Month </p>
                <input id='modalMonth' className={inputStyle} maxLength={2} placeholder='MM'
                  onChange={(e) => {setInitiativeTargetDate({...initiativeTargetDate, month: e.target.value})}}
                />
              </div>

              <div className='w-24 mx-2'>
                <p>Day </p>
                <input id='modalDay' className={inputStyle} maxLength={2} placeholder='DD'
                  onChange={(e) => {setInitiativeTargetDate({...initiativeTargetDate, day: e.target.value})}}
                />
              </div>

              <div className='w-24 mx-2'>
                <p>Year </p>        
                <input id='modalYear' className={inputStyle} maxLength={4} placeholder='YYYY'
                  onChange={(e) => {setInitiativeTargetDate({...initiativeTargetDate, year: e.target.value})}}
                />
              </div>
            </div>
          </div>


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