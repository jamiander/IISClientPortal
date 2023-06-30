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
      <Button data-cy={props.cypressData} variant="contained" disabled={props.disabled} onClick={() => props.HandleClick()}
        style={{outlineColor: 'blue'}} size="small" startIcon={<AddIcon sx={{fontSize:"inherit"}}/>}  
      >
        <Typography variant="button">Add</Typography>
      </Button>
    </ThemeProvider>
  )
}