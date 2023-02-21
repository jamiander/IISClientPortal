import { Outlet } from "react-router-dom";

interface ContentProps {
  ShowToast: (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void
}

export default function Content(props: ContentProps){
  return(
    <Outlet context={props.ShowToast} />
  )
}