import { Grid, Typography } from "@mui/material";

export default function Footer(){
  return(
    <div className="mx-[1%] h-auto mt-2 py-3">
      <Grid container justifyContent="space-between">
        <Typography>© 2023 by Integrity Inspired Solutions</Typography>
        <Typography>7820 Metcalf Overland Park, KS 66204</Typography>
        <Typography>913-375-0611</Typography>
        <Typography>info@integrityinspired.com</Typography>
      </Grid>
    </div>
  )
}