import { InputAdornment, TextField, ThemeProvider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { IntegrityTheme, UserTextField } from "../Styles";

interface SearchBarProps {
  cypressData: string
  disabled?: boolean
  value: string
  setValue: (value: string) => void
  placeholder: string
}

export function SearchBar(props: SearchBarProps)
{
  return (
    <ThemeProvider theme={IntegrityTheme}>
      <UserTextField data-cy={props.cypressData} sx={{border: '1px solid blue', borderRadius: 1}} disabled={props.disabled} placeholder={props.placeholder} value={props.value} onChange={(e) => props.setValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{fontSize: "calc(20px + 0.390625vw)", color: "#21345b"}}/>
            </InputAdornment>
          ),
        }} />
    </ThemeProvider>
  )
}
