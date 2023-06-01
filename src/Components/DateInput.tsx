import { DateInfo } from "../Services/CompanyService"
import { inputStyle } from "../Styles"

interface DateInputProps {
  cypressData: string,
  date: DateInfo | undefined,
  setDate: (value: React.SetStateAction<DateInfo | undefined>) => void,
  disabled?: boolean
}

function AddLeadingZero(num: number){
  return ((num < 10) ? "0" : "") + num.toString();
}

export function MakeDateString(dateInfo: DateInfo | undefined) : string
{
  if(dateInfo === undefined)
    return "";
  return dateInfo.year + "-" + AddLeadingZero(dateInfo.month) + "-" + AddLeadingZero(dateInfo.day);
}

export function MakeDate(dateInfo: DateInfo) : Date
{
  return new Date(MakeDateString(dateInfo) + "T00:00:00")
}

export function MakeDateInfo(dateString: string) : DateInfo
{
  let dateSplit = dateString.split("-");
  let dateInfo: DateInfo = {year: parseInt(dateSplit[0]), month: parseInt(dateSplit[1]), day: parseInt(dateSplit[2])};
  return dateInfo;
}

export function DateToDateInfo(date: Date) : DateInfo
{
  let dateInfo: DateInfo = {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()};
  return dateInfo;
}

export function EqualDateInfos(date1: DateInfo, date2: DateInfo)
{
  return date1.day === date2.day && date1.month === date2.month && date1.year === date2.year;
}

export function CompareDateInfos(date1: DateInfo, date2: DateInfo)
{
  return MakeDate(date1).getTime() - MakeDate(date2).getTime();
}

export function DateInput(props: DateInputProps)
{
  return (
    <>
      <div className='flex space-x-2'>
        <input data-cy={props.cypressData} disabled={props.disabled} type="date" value={MakeDateString(props.date)} className={inputStyle}
          onChange={(e) => { props.setDate(MakeDateInfo(e.target.value) ?? props.date) }}/>
      </div>
    </>
  )
}