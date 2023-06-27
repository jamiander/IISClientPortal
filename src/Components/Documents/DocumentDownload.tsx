import DownloadIcon from '@mui/icons-material/Download';
import { DocumentInfo, downloadDocument } from '../../Store/DocumentSlice';
import { useAppDispatch } from '../../Store/Hooks';
import { IconButton } from '@mui/material';

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
      <IconButton onClick={() => HandleDownload()}>
        <DownloadIcon sx={{ fontSize: 28 }}/>
      </IconButton>
    </>
  )
}