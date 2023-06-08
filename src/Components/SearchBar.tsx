import { InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { UserTextField } from "../Styles";

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
    <>
      <UserTextField data-cy={props.cypressData} disabled={props.disabled} placeholder={props.placeholder} value={props.value} onChange={(e) => props.setValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{fontSize: "calc(20px + 0.390625vw)", color: "#21345b"}}/>
            </InputAdornment>
          ),
        }} />
    </>
  )
}
