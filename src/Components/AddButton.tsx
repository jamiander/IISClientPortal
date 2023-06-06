import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AddButtonProps {
  cypressData: string
  HandleClick: () => void
  disabled?: boolean
}

export function AddButton(props: AddButtonProps)
{

  return (
    <Button data-cy={props.cypressData} variant="contained" disabled={props.disabled} onClick={() => props.HandleClick()} size="large">
      <AddIcon sx={{fontSize:"large", marginRight: 0.25}}/>
      <Typography variant="button" sx={{marginLeft: 0.25}}>New</Typography>
    </Button>
  )
}