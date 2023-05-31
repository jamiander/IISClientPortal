import { Company, Initiative, selectAllCompanies } from "../../Store/CompanySlice"
import { cancelButtonStyle, inputStyle, modalStyle, selectStyle, submitButtonStyle } from "../../Styles"
import Modal from 'react-modal';
import { useEffect, useState } from "react";
import { DateInput } from "../DateInput";
import { DateInfo } from "../../Services/CompanyService";
import { useAppSelector } from "../../Store/Hooks";
import {v4 as uuidv4 } from "uuid";

interface InitiativeModalProps {
	initiative?: Initiative
	initiativeIsOpen: boolean
	setInitiativeIsOpen: (value: boolean) => void
	Submit: (initiative: Initiative, companyId: string) => void
	company?: Company
}

export const InitiativeModalIds = {
	modal: "initModal",
	company: "initModalCompany",
  startDate: "initModalStartDate",
	targetDate: "initModalTargetDate",
	totalItems: "initModalTotalItems",
  submitButton: "initModalSubmitButton",
  closeButton: "initModalCloseButton"
}

export function UpdateInitiativeListModal(props: InitiativeModalProps){
  const today = new Date();
  const todayInfo: DateInfo = {month: today.getMonth() + 1, day: today.getDate(), year: today.getFullYear()};
  const companyList = useAppSelector(selectAllCompanies);
  const [initiativeCompanyId, setInitiativeCompanyId] = useState(props.company?.id ?? "-1");
  const [initiativeTitle, setInitiativeTitle] = useState(props.initiative?.title ?? "");
  const [initiativeTargetDate, setInitiativeTargetDate] = useState<DateInfo>();
  const [initiativeStartDate, setInitiativeStartDate] = useState<DateInfo>();
  const [initiativeTotalItems, setInitiativeTotalItems] = useState(props.initiative?.totalItems ?? NaN);

  useEffect(() => {
    setInitiativeTitle(props.initiative?.title ?? "");
    setInitiativeStartDate(props.initiative?.startDate ?? todayInfo)
    setInitiativeTargetDate(props.initiative?.targetDate ?? todayInfo);
    setInitiativeTotalItems(props.initiative?.totalItems ?? NaN);
	  setInitiativeCompanyId(props.company?.id ?? "-1");
  }, [props.initiative,props.company,props.initiativeIsOpen]);

	return (
		<Modal
			data-cy={InitiativeModalIds.modal}
			isOpen={props.initiativeIsOpen}
			onRequestClose={() => props.setInitiativeIsOpen(false)}
			style={{'content': {...modalStyle.content, 'width' : '25%'}}}
			appElement={document.getElementById('root') as HTMLElement}
		>
			<div className='w-full'>
				<div className='my-1'>Company{props.company ? ": " + props.company.name :
          <div>
            <select data-cy={InitiativeModalIds.company} onChange={(e) => setInitiativeCompanyId(e.target.value)} 
            className={selectStyle}
            >
              <option>Select Company</option>
              {
                companyList?.map((company, index) => {
                  return (
                    <option value={company.id} key={index}>{company.name}</option>
                  )
                })
              }
            </select>
          </div>
        }</div>
				<p className='my-1'>Title</p>
				<input defaultValue={props.initiative?.title} className={inputStyle + ' w-3/4'} placeholder='Initiative Title'
          onChange={(e) => {setInitiativeTitle(e.target.value)}}/>
        <div className='my-2'>
            <p className=''>Start Date</p>
            <DateInput cypressData={InitiativeModalIds.startDate} date={initiativeStartDate} setDate={setInitiativeStartDate}/>
          </div>
        <div className="flex">
          <div className='my-2'>
            <p className=''>Target Completion</p>
            <DateInput cypressData={InitiativeModalIds.targetDate} date={initiativeTargetDate} setDate={setInitiativeTargetDate}/>
          </div>
          <div className='w-24 my-2 ml-2'>
            <p>Total Items</p>
            <input defaultValue={props.initiative?.totalItems} data-cy={InitiativeModalIds.totalItems} type={'number'} placeholder='###'
              className={inputStyle + " w-full"} 
              onChange={(e) => {setInitiativeTotalItems(parseInt(e.target.value))}}/>
          </div>
        </div>
      </div>
      
      <div>
        <div className="p-2 flex justify-between">
          <button data-cy={InitiativeModalIds.submitButton} className={submitButtonStyle} 
            onClick={() => {
              const invalidDate: DateInfo = { day: -1, month: -1, year: -1}
              const initiative : Initiative = {
                id: props.initiative?.id ?? uuidv4(),
                title: initiativeTitle,
                targetDate: initiativeTargetDate ?? invalidDate,  //should fail when it gets to validation
                startDate: initiativeStartDate ?? invalidDate,
                totalItems: initiativeTotalItems,
                itemsCompletedOnDate: props.initiative?.itemsCompletedOnDate ?? [],
                decisions: props.initiative?.decisions ?? []
              }
              props.Submit(initiative,initiativeCompanyId);
            }}> Submit
          </button>
          <button data-cy={InitiativeModalIds.closeButton} className={cancelButtonStyle} onClick={() => props.setInitiativeIsOpen(false)}>Close</button> 
        </div>
      </div>
		</Modal>
	)
}
