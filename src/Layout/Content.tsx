import { Outlet } from "react-router-dom";
import { ToastDetails } from "../Components/Toast";

interface ContentProps {
  ShowToast: (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void
}

export default function Content(props: ContentProps){
  return(
    <Outlet />
  )
}