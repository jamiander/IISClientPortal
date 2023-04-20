import { DateInfo } from "../Services/CompanyService"
import { inputStyle } from "../Styles"

interface DateInputProps {
  id: string,
  date: DateInfo,
  setDate: (value: React.SetStateAction<DateInfo>) => void,
  //inputIds: {month: string, day: string, year: string}
}

function AddLeadingZero(num: number){
  return ((num < 10) ? "0" : "") + num.toString();
}

export function MakeDateString(dateInfo: DateInfo)
{
  return dateInfo.year + "-" + AddLeadingZero(dateInfo.month) + "-" + AddLeadingZero(dateInfo.day);
}

export function MakeDate(dateInfo: DateInfo)
{
  return new Date(MakeDateString(dateInfo) + "T00:00:00")
}

export function MakeDateInfo(dateString: string)
{
  let dateSplit = dateString.split("-");
  let dateInfo: DateInfo = {year: parseInt(dateSplit[0]), month: parseInt(dateSplit[1]), day: parseInt(dateSplit[2])};
  return dateInfo;
}

export function EqualDateInfos(date1: DateInfo, date2: DateInfo)
{
  return date1.day === date2.day && date1.month === date2.month && date1.year === date2.year;
}

export function CompareDateInfos(date1: DateInfo, date2: DateInfo)
{
  return new Date(MakeDateString(date1)).getTime() - new Date(MakeDateString(date2)).getTime();
}

export function DateInput(props: DateInputProps)
{
  return (
    <>
      <div className='flex space-x-2'>
        <input id={props.id} type="date" value={MakeDateString(props.date)} className={inputStyle}
          onChange={(e) => { props.setDate(MakeDateInfo(e.target.value) ?? props.date) }}/>
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