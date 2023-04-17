
export interface RadioInstance {
  id: string,
  label: string,
  value: string
}

interface RadioSetProps {
  options: RadioInstance[]
  setter: (value: React.SetStateAction<string>) => void
  name: string
}

export function RadioSet(props: RadioSetProps)
{
  return (
    <div className="w-fit flex justify-center mt-2 py-1 px-5 outline outline-1 outline-[#2ed7c3] rounded text-white">
      {
        props.options.map((radio) => {
          return (
            <label className="mr-5 hover:text-[#879794]" onClick={()=>props.setter(radio.value)}>
              <input type='radio' id={radio.id} value={radio.value} name={props.name} className="mr-1"/>
              {radio.label}
            </label>
          )
        })
      }
    </div>
  );
}
