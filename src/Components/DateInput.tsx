import { DateInfo } from "../Services/CompanyService"
import { inputStyle } from "../Styles"

interface DateInputProps {
  id: string,
  date: DateInfo,
  setDate: (value: React.SetStateAction<DateInfo>) => void,
  //inputIds: {month: string, day: string, year: string}
}

export function DateInput(props: DateInputProps)
{
  function AddLeadingZero(num: number){
    return ((num < 10) ? "0" : "") + num.toString();
  }

  function MakeDateString(dateInfo: DateInfo)
  {
    return dateInfo.year + "-" + AddLeadingZero(dateInfo.month) + "-" + AddLeadingZero(dateInfo.day);
  }

  function MakeDateInfo(dateString: string)
  {
    let dateSplit = dateString.split("-");
    let dateInfo: DateInfo = {year: parseInt(dateSplit[0]), month: parseInt(dateSplit[1]), day: parseInt(dateSplit[2])};
    return dateInfo;
  }

  return (
    <>
      <div className='flex space-x-2'>
        <input id={props.id} type="date" defaultValue={MakeDateString(props.date)} onChange={(e) => { props.setDate(MakeDateInfo(e.target.value) ?? props.date) }}/>
        {/*<div className='w-[20%]'>
          <p>Month </p>
          <input defaultValue={props.date.month} id={props.inputIds.month} className={inputStyle} maxLength={2}
          onChange={(e) => {props.setDate({...props.date, month: parseInt(e.target.value)})}}
          placeholder='MM'/>
        </div>

        <div className='w-[20%]'>
          <p>Day </p>
          <input defaultValue={props.date.day} id={props.inputIds.day} className={inputStyle} maxLength={2}
          onChange={(e) => {props.setDate({...props.date, day: parseInt(e.target.value)})}}
          placeholder='DD'/>
        </div>

        <div className='w-[30%]'>
          <p>Year </p>        
          <input defaultValue={props.date.year} id={props.inputIds.year} className={inputStyle} maxLength={4}
          onChange={(e) => {props.setDate({...props.date, year: parseInt(e.target.value)})}}
          placeholder='YYYY'/>
        </div>
        */}
      </div>
    </>
  )
}