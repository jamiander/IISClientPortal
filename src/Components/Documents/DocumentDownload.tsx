import DownloadIcon from '@mui/icons-material/Download';
import { yellowButtonStyle } from '../../Styles';
import { DocumentInfo, downloadDocument } from '../../Store/DocumentSlice';
import { useAppDispatch } from '../../Store/Hooks';

interface DocumentDownloadProps {
  docInfo: DocumentInfo
}

export function DocumentDownload(props: DocumentDownloadProps)
{
  const dispatch = useAppDispatch();

  async function HandleDownload()
  {
    if(props.docInfo)
    {
      const result = await dispatch(downloadDocument({documentInfo: props.docInfo}));
    }
  }

  return (
    <>
      <button className={yellowButtonStyle} onClick={() => HandleDownload()}>Download {props.docInfo?.name}</button>
      <DownloadIcon sx={{ fontSize: 26 }}/>
    </>
  )
}