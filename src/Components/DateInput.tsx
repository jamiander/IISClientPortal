import { DateInfo } from "../Services/CompanyService"
import { Initiative } from "../Store/CompanySlice"
import { inputStyle } from "../Styles"

interface DateInputProps {
  heading: string,
  date: DateInfo,
  setDate: (value: React.SetStateAction<DateInfo>) => void,
  defaultDate?: DateInfo
  inputIds: {month: string, day: string, year: string}
}

export function DateInput(props: DateInputProps){

  return (
    <>
      <div className='my-2 p-2 outline outline-1 outline-[#879794] rounded'>
        <p className=''>{props.heading}</p>
        <div className='flex'>
          <div className='w-24 mx-2'>
            <p>Month </p>
            <input defaultValue={props.defaultDate?.month} id={props.inputIds.month} className={inputStyle + ' w-20 mx-1'} maxLength={2}
            onChange={(e) => {props.setDate({...props.date, month: parseInt(e.target.value)})}}
            placeholder='MM'/>
          </div>

          <div>
            <p>Day </p>
            <input defaultValue={props.defaultDate?.day} id={props.inputIds.day} className={inputStyle + ' w-20 mx-1'} maxLength={2}
            onChange={(e) => {props.setDate({...props.date, day: parseInt(e.target.value)})}}
            placeholder='DD'/>
          </div>

          <div>
            <p>Year </p>        
            <input defaultValue={props.defaultDate?.year} id={props.inputIds.year} className={inputStyle + ' w-20 mx-1'} maxLength={4}
            onChange={(e) => {props.setDate({...props.date, year: parseInt(e.target.value)})}}
            placeholder='YYYY'/>
          </div>
        </div>
      </div>
    </>
  )
}