import { Button, ThemeProvider, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IntegrityTheme } from "../Styles";

interface AddButtonProps {
  cypressData: string
  HandleClick: () => void
  disabled?: boolean
}

export function AddButton(props: AddButtonProps)
{
  return (
    <ThemeProvider theme={IntegrityTheme}>
      <Button data-cy={props.cypressData} style={{outlineColor: 'blue'}} variant="contained" disabled={props.disabled} onClick={() => props.HandleClick()} size="large">
        <AddIcon sx={{fontSize:"large", marginRight: 0.25}}/>
        <Typography variant="button" sx={{marginLeft: 0.25}}>Add</Typography>
      </Button>
    </ThemeProvider>
  )
}