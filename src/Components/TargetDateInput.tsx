import { DateInfo } from "../Services/CompanyService"
import { Initiative } from "../Store/CompanySlice"
import { inputStyle } from "../Styles"

interface TargetDateInputProps {
  initiativeTargetDate: DateInfo,
  setInitiativeTargetDate: (value: React.SetStateAction<DateInfo>) => void,
  defaultInitiative?: Initiative
}

export function TargetDateInput(props: TargetDateInputProps){

  return (
    <>
      <div className='my-[15px] outline outline-2 outline-offset-4 outline-[#879794] rounded'>
        <p className='mt-2'>Target Completion</p>
        <div className='flex mb-2 space-x-[5px]'>
          <div>
            <p>Month </p>
            <input defaultValue={props.defaultInitiative?.targetDate.month} id='modalMonth' className={inputStyle + ' w-20 mx-1'} maxLength={2}
            onChange={(e) => {props.setInitiativeTargetDate({...props.initiativeTargetDate, month: e.target.value})}}
            placeholder='MM'/>
          </div>

          <div>
            <p>Day </p>
            <input defaultValue={props.defaultInitiative?.targetDate.day} id='modalDay' className={inputStyle + ' w-20 mx-1'} maxLength={2}
            onChange={(e) => {props.setInitiativeTargetDate({...props.initiativeTargetDate, day: e.target.value})}}
            placeholder='DD'/>
          </div>

          <div>
            <p>Year </p>        
            <input defaultValue={props.defaultInitiative?.targetDate.year} id='modalYear' className={inputStyle + ' w-20 mx-1'} maxLength={4}
            onChange={(e) => {props.setInitiativeTargetDate({...props.initiativeTargetDate, year: e.target.value})}}
            placeholder='YYYY'/>
          </div>
        </div>
      </div>
    </>
  )
}