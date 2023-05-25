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
      <DownloadIcon className="hover:text-gray-400" onClick={() => HandleDownload()} sx={{ fontSize: 28 }}/>
    </>
  )
}