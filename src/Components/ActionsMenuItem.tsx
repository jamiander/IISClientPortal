import { MenuItem, Typography } from "@mui/material";

interface ActionsMenuItemProps {
  cypressData: string
  handleClick: () => void
  text: string
}

export function ActionsMenuItem(props: ActionsMenuItemProps)
{
  return (
    <MenuItem data-cy={props.cypressData} onClick={() => props.handleClick()}>
      <Typography variant="button" style={{color: "darkBlue"}}>
        {props.text}
      </Typography>
    </MenuItem>
  )
}