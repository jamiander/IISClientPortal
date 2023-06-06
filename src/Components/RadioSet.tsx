import Grid from "@mui/material/Grid"

export interface RadioInstance {
  cypressData: string,
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
    <Grid item xs={6}
    sx={{ display: "flex",
    justifyContent: "center",
    fontSize: "calc(14px + 0.390625vw)",
    }}>
      {
        props.options.map((radio,index) => {
          return (
            <label key={index} className="mr-8 ml-2 hover:text-[#879794]" onClick={()=>HandleClick(radio.value)}>
              <input className="mr-2" type='radio' data-cy={radio.cypressData} value={radio.value} name={props.name} defaultChecked={radio.default}/>
              {radio.label}
            </label>
          )
        })
      }
    </Grid>
  );
}
