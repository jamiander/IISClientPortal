
export interface RadioInstance {
  id: string,
  label: string,
  value: string
  default?: boolean
}

interface RadioSetProps {
  options: RadioInstance[]
  setter: (value: React.SetStateAction<string>) => void
  name: string
  dark?: boolean
  onClick?: Function
}

export function RadioSet(props: RadioSetProps)
{
  function HandleClick(value: string)
  {
    props.setter(value);
    if(props.onClick)
    {
      props.onClick();
    }
  }

  return (
    <div className={"w-fit flex justify-center mt-5 h-[45px] py-1 outline outline-1 rounded " + (props.dark ? "outline-black text-black" : "outline-white text-white")}>
      {
        props.options.map((radio,index) => {
          return (
            <label key={index} className="mr-5 hover:text-[#879794]" onClick={()=>HandleClick(radio.value)}>
              <input type='radio' id={radio.id} value={radio.value} name={props.name} defaultChecked={radio.default} className="mr-1"/>
              {radio.label}
            </label>
          )
        })
      }
    </div>
  );
}
