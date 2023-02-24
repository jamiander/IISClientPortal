import { Company, Initiative } from "../Store/CompanySlice"
import { cancelButtonStyle, inputStyle, modalStyle, submitButtonStyle } from "../Styles"
import Modal from 'react-modal';
import { useState } from "react";
import { DateInput } from "./DateInput";
import { DateInfo } from "../Services/CompanyService";

interface InitiativeModalProps {
	title: string
	initiative?: Initiative
	initiativeIsOpen: boolean
	setInitiativeIsOpen: (value: boolean) => void
	Submit: (initiative: Initiative, companyId: number) => void
	company?: Company
	companyList?: Company[]
}

export default function InitiativeModal(props: InitiativeModalProps){
	const [initiativeCompanyId, setInitiativeCompanyId] = useState(Number);
  const [initiativeTitle, setInitiativeTitle] = useState(String);
  const [initiativeTargetDate, setInitiativeTargetDate] = useState<DateInfo>({month: "", day: "", year: ""});
  const [initiativeTotalItems, setInitiativeTotalItems] = useState(Number);

	return (
		<Modal
			isOpen={props.initiativeIsOpen}
			onRequestClose={() => props.setInitiativeIsOpen(false)}
			style={{'content': {...modalStyle.content, 'width' : '25%'}}}
			appElement={document.getElementById('root') as HTMLElement}     
		>

			<p className='text-3xl'>{props.title}</p>

			<div className='w-full'>
				<p className='my-1'>Company{props.company ? ": " + props.company.name : 
					<select id='modalCompany' onChange={(e) => setInitiativeCompanyId(parseInt(e.target.value))} 
					className='outline outline-1 rounded p-2'
					>
						<option>Select Company</option>
						{
							props.companyList?.map((company, index) => {
								return (
									<option value={company.id} key={index}>{company.name}</option>
								)
							})
						}
					</select>}
				</p>

				<p className='my-1'>Title</p>
				<input defaultValue={props.initiative?.title} id='modalTitle' className={inputStyle + ' w-3/4'}
          onChange={(e) => {setInitiativeTitle(e.target.value)}}/>
				
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
                  id: props.initiative?.id ?? -1,
                  title: initiativeTitle,
                  targetDate: initiativeTargetDate,
                  totalItems: initiativeTotalItems,
                  itemsCompletedOnDate: props.initiative?.itemsCompletedOnDate ?? []
                }
                props.Submit(initiative,initiativeCompanyId)
              }}> Submit
            </button>
            <button className={cancelButtonStyle} onClick={() => props.setInitiativeIsOpen(false)}>Close</button> 
          
          </div>
        </div>
		</Modal>

	)
}
