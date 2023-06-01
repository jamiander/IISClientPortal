import { DateInfo } from "../Services/CompanyService";
import { MakeDateInfo, MakeDateString } from "../Services/DateHelpers";
import { inputStyle } from "../Styles";

interface DateInputProps {
  cypressData: string,
  date: DateInfo | undefined,
  setDate: (value: React.SetStateAction<DateInfo | undefined>) => void,
  disabled?: boolean
}

export function DateInput(props: DateInputProps)
{
  return (
    <>
      <div className='flex space-x-2'>
        <input type="date" data-cy={props.cypressData} disabled={props.disabled} value={MakeDateString(props.date)} className={inputStyle}
          onChange={(e) => { props.setDate(MakeDateInfo(e.target.value) ?? props.date) }}/>
      </div>
    </>
  )
}