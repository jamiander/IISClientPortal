import { DatePicker } from "@mui/x-date-pickers";
import { DateInfo } from "../Services/CompanyService";
import { MakeDate, MakeDateInfo, MakeDateString } from "../Services/DateHelpers";
import { inputStyle } from "../Styles";
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from "react";

interface DateInputProps {
  cypressData: string,
  date: DateInfo | undefined,
  setDate: (value: React.SetStateAction<DateInfo | undefined>) => void,
  disabled?: boolean
  label?: string
}

export function DateInput(props: DateInputProps)
{
  const [myDate, setMyDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if(props.date)
    {
      const newDate = MakeDate(props.date);
      setMyDate(dayjs(newDate));
    }
    else
      setMyDate(null);
  },[props.date])

  function HandleDateChange(newDayjs: Dayjs | null)
  {
    if(newDayjs)
    {
      const dateString = newDayjs.format("YYYY-MM-DD");
      props.setDate(MakeDateInfo(dateString));
    }
    else
      props.setDate(undefined);
  }

  return (
    <>
      <div className='flex space-x-2 my-5' data-cy={props.cypressData}>
        <DatePicker label={props.label ?? ""} disabled={props.disabled} value={myDate} onChange={(newDayjs) => HandleDateChange(newDayjs)} />
          {/*<input type="date" data-cy={props.cypressData} disabled={props.disabled} value={MakeDateString(props.date)} className={inputStyle}
            onChange={(e) => { props.setDate(MakeDateInfo(e.target.value) ?? props.date) }}/>*/}
      </div>
    </>
  )
}