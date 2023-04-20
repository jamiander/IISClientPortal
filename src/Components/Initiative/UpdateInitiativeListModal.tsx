import { Company, Initiative, selectAllCompanies } from "../../Store/CompanySlice"
import { cancelButtonStyle, inputStyle, modalStyle, selectStyle, submitButtonStyle } from "../../Styles"
import Modal from 'react-modal';
import { useEffect, useState } from "react";
import { DateInput } from "../DateInput";
import { DateInfo } from "../../Services/CompanyService";
import { useAppSelector } from "../../Store/Hooks";

interface InitiativeModalProps {
	title: string
	initiative?: Initiative
	initiativeIsOpen: boolean
	setInitiativeIsOpen: (value: boolean) => void
	Submit: (initiative: Initiative, companyId: number) => void
	company?: Company
}

export const InitiativeModalIds = {
	modal: "initModal",
	company: "initModalCompany",
	title: "initModalTitle",
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
  const [initiativeCompanyId, setInitiativeCompanyId] = useState(props.company?.id ?? -1);
  const [initiativeTitle, setInitiativeTitle] = useState(props.initiative?.title ?? "");
  const [initiativeTargetDate, setInitiativeTargetDate] = useState<DateInfo>(props.initiative?.targetDate ?? todayInfo);
  const [initiativeStartDate, setInitiativeStartDate] = useState<DateInfo>(props.initiative?.startDate ?? todayInfo);
  const [initiativeTotalItems, setInitiativeTotalItems] = useState(props.initiative?.totalItems ?? 0);

  useEffect(() => {
    setInitiativeTitle(props.initiative?.title ?? "");
    setInitiativeStartDate(props.initiative?.startDate ?? todayInfo)
    setInitiativeTargetDate(props.initiative?.targetDate ?? todayInfo);
    setInitiativeTotalItems(props.initiative?.totalItems ?? 0);
	  setInitiativeCompanyId(props.company?.id ?? -1);
  }, [props.initiative,props.company,props.initiativeIsOpen])

	return (
		<Modal
			id={InitiativeModalIds.modal}
			isOpen={props.initiativeIsOpen}
			onRequestClose={() => props.setInitiativeIsOpen(false)}
			style={{'content': {...modalStyle.content, 'width' : '25%'}}}
			appElement={document.getElementById('root') as HTMLElement}
		>
			<p className='text-3xl'>{props.title}</p>
			<div className='w-full'>
				<p className='my-1'>Company{props.company ? ": " + props.company.name :
          <div>
            <select id={InitiativeModalIds.company} onChange={(e) => setInitiativeCompanyId(parseInt(e.target.value))} 
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
        }</p>
				<p className='my-1'>Title</p>
				<input defaultValue={props.initiative?.title} id={InitiativeModalIds.title} className={inputStyle + ' w-3/4'} placeholder='Initiative Title'
          onChange={(e) => {setInitiativeTitle(e.target.value)}}/>
        <div className='my-2'>
            <p className=''>Start Date</p>
            <DateInput id={InitiativeModalIds.startDate} date={initiativeStartDate} setDate={setInitiativeStartDate}/>
          </div>
        <div className="flex">
          <div className='my-2'>
            <p className=''>Target Completion</p>
            <DateInput id={InitiativeModalIds.targetDate} date={initiativeTargetDate} setDate={setInitiativeTargetDate}/>
          </div>
          <div className='w-24 my-2 ml-2'>
            <p>Total Items</p>
            <input defaultValue={props.initiative?.totalItems} id={InitiativeModalIds.totalItems} type={'number'} placeholder='###'
              className={inputStyle + " w-full"} 
              onChange={(e) => {setInitiativeTotalItems(parseInt(e.target.value))}}/>
          </div>
        </div>
      </div>
      
      <div>
        <div className="p-2 flex justify-between">
          <button id={InitiativeModalIds.submitButton} className={submitButtonStyle} 
            onClick={() => {
              let initiative : Initiative = {
                id: props.initiative?.id ?? -1,
                title: initiativeTitle,
                targetDate: initiativeTargetDate,
                startDate: initiativeStartDate,
                totalItems: initiativeTotalItems,
                itemsCompletedOnDate: props.initiative?.itemsCompletedOnDate ?? []
              }
              props.Submit(initiative,initiativeCompanyId)
            }}> Submit
          </button>
          <button id={InitiativeModalIds.closeButton} className={cancelButtonStyle} onClick={() => props.setInitiativeIsOpen(false)}>Close</button> 
        </div>
      </div>
		</Modal>
	)
}
