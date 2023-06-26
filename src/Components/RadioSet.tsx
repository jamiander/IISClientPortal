import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"
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
  disabled?: boolean
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
    fontSize: "calc(10px + 0.390625vw)",
    }}>
      <FormControl>
        <RadioGroup
          defaultValue={props.options.find(r => r.default)?.value}
          name={props.name}
          row
        >
          {
            props.options.map((radio,index) => {
              return (
                <FormControlLabel key={index} value={radio.value} control={<Radio data-cy={radio.cypressData}/>} label={radio.label} 
                  onClick={() => {
                    if(!props.disabled)
                      HandleClick(radio.value);
                  }}
                  disabled={props.disabled}
                />
              )
            })
          }
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}
