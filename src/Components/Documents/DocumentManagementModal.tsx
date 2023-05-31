import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Company, Initiative } from '../../Store/CompanySlice';
import { DocumentUpload } from './DocumentUpload';
import { TableHeaderStyle, defaultRowStyle } from '../../Styles';
import { useEffect, useState } from 'react';
import { DocumentInfo, getDocumentUrls } from '../../Store/DocumentSlice';
import { useAppDispatch } from '../../Store/Hooks';
import { DocumentDownload } from './DocumentDownload';

export const DocumentManagementModalIds = {
  modal: "documentManagementModal",
  closeButton: "documentManagementModalCloseButton"
}

interface DocumentManagementModalProps {
  company: Company
  initiative?: Initiative
  isAdmin: boolean
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export function DocumentManagementModal(props: DocumentManagementModalProps)
{
  const dispatch = useAppDispatch();
  const [docInfos, setDocInfos] = useState<DocumentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    if(props.isOpen)
      GetData();
    else
      setDocInfos([]);

  },[props.isOpen]);

  async function GetData()
  {
    try{
      const response = await dispatch(getDocumentUrls({companyId: props.company.id, initiativeId: props.initiative?.id}));
      if(response.payload)
      {
        const docs = response.payload as DocumentInfo[];
        setDocInfos(docs);
        setIsLoading(false);
      }
    }
    catch(e)
    {
      console.log((e as Error).message);
    } 
  }


  return (
    <Dialog
      data-cy={DocumentManagementModalIds.modal}
      open={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      maxWidth={false}
    >
      <div className="flex flex-col col-span-4 ">
        <div className="bg-[#69D5C3] rounded-md py-6 px-5 w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl font-bold w-full">{props.company.name}</p>
            <p className="text-3xl w-full">{props.initiative?.title}</p>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex justify-end">
              <button data-cy={DocumentManagementModalIds.closeButton} className="rounded-md transition ease-in-out hover:bg-[#29c2b0] w-fit" onClick={() => props.setIsOpen(false)}><CloseIcon sx={{fontSize: 40}}/></button>
            </div>
          </div>
        </div>

        {props.isAdmin &&
          <DocumentUpload company={props.company} initiative={props.initiative} GetData={GetData}/>
        }
        {isLoading && docInfos.length === 0 &&
          <div className="flex justify-center w-full h-full my-2">
            <CircularProgress size={20} color={"warning"}/>
          </div>
        }
        {!isLoading && docInfos.length === 0 &&
          <p className="m-2">There are no files to display</p>
        }
        {docInfos.length !== 0 &&
          <TableContainer component={Paper}>
            <Table className="table-auto w-full outline outline-3 bg-gray-100">
              <TableHead className="outline outline-1">
                <TableRow sx={{
                  borderBottom: "2px solid black",
                    "& th": {
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    fontFamily: "Arial, Helvetica"
                  }
                }}>
                  <TableHeaderStyle>
                    File Name
                  </TableHeaderStyle>
                  {!props.initiative &&
                  <TableHeaderStyle>
                    Initiative
                  </TableHeaderStyle>
                  }
                </TableRow>
              </TableHead>
              <TableBody>
              {
                docInfos.map((doc, index) => {
                  return (
                    <TableRow className={defaultRowStyle} sx={{
                      borderBottom: "1px solid black",
                      "& td": {
                        fontSize: "1.1rem",
                        fontFamily: "Arial, Helvetica",
                        color: "#21345b"
                      }
                    }}
                      key={index}
                    >
                      <TableCell>
                        <div className="flex justify-between">
                          <p>{doc.fileName}</p>
                          <DocumentDownload docInfo={doc}/>
                        </div>
                      </TableCell>
                      {!props.initiative &&
                      <TableCell>
                        {
                          doc.initiativeId ? (props.company.initiatives.find(i => i.id === doc.initiativeId)?.title ?? "N/A") : "N/A"
                        }
                      </TableCell>
                      }
                    </TableRow>
                  )
                })
              }
              </TableBody>
            </Table>
          </TableContainer>
        }
      </div>
    </Dialog>
  )
}
