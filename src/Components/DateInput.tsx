import { DateInfo } from "../Services/CompanyService"
import { Initiative } from "../Store/CompanySlice"
import { inputStyle } from "../Styles"

interface DateInputProps {
  date: DateInfo,
  setDate: (value: React.SetStateAction<DateInfo>) => void,
  defaultDate?: DateInfo
  inputIds: {month: string, day: string, year: string}
}

export function DateInput(props: DateInputProps){

  return (
    <>
      <div className='flex space-x-2'>
        <div className='w-[20%]'>
          <p>Month </p>
          <input defaultValue={props.defaultDate?.month} id={props.inputIds.month} className={inputStyle} maxLength={2}
          onChange={(e) => {props.setDate({...props.date, month: parseInt(e.target.value)})}}
          placeholder='MM'/>
        </div>

        <div className='w-[20%]'>
          <p>Day </p>
          <input defaultValue={props.defaultDate?.day} id={props.inputIds.day} className={inputStyle} maxLength={2}
          onChange={(e) => {props.setDate({...props.date, day: parseInt(e.target.value)})}}
          placeholder='DD'/>
        </div>

        <div className='w-[30%]'>
          <p>Year </p>        
          <input defaultValue={props.defaultDate?.year} id={props.inputIds.year} className={inputStyle} maxLength={4}
          onChange={(e) => {props.setDate({...props.date, year: parseInt(e.target.value)})}}
          placeholder='YYYY'/>
        </div>
      </div>
    </>
  )
}