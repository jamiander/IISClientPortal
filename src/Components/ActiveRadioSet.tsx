import { useActiveCounter } from "../Services/useActiveCounter";
import { RadioSet } from "./RadioSet";

interface ActiveRadioSetProps<T> {
  cypressData: {
    all: string,
    active: string,
    inactive: string
  }
  name: string
  setRadioValue: (value: React.SetStateAction<string>) => void
  listItems: T[]
  filterFunc: (list: T[], activeStatus: string) => T[]
  disabled?: boolean
}

export function ActiveRadioSet<T>(props: ActiveRadioSetProps<T>)
{
  const {allCount, activeCount, inactiveCount} = useActiveCounter(props.listItems,props.filterFunc);

  return( 
    <RadioSet dark={true} setter={props.setRadioValue} name={props.name} disabled={props.disabled} options={[
      { cypressData: props.cypressData.all, label: `Show All (${allCount})`, value: "all" },
      { cypressData: props.cypressData.active, label: `Active (${activeCount})`, value: "active", default: true },
      { cypressData: props.cypressData.inactive, label: `Inactive (${inactiveCount})`, value: "inactive" }
      ]} />
  )
}
