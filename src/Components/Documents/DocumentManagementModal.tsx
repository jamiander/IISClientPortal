import CloseIcon from '@mui/icons-material/Close';
import { Dialog, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { Company, Initiative } from '../../Store/CompanySlice';
import { DocumentUpload } from './DocumentUpload';



interface DocumentManagementModalProps {
  company: Company
  initiative?: Initiative
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export function DocumentManagementModal(props: DocumentManagementModalProps)
{
  return (
    <Dialog 
      open={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      maxWidth={false}
    >
      <div className="flex col-span-4 bg-[#69D5C3] rounded-md py-6 px-5">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl font-bold w-full">{props.company.name}</p>
            <p className="text-3xl w-full">{props.initiative?.title}</p>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex justify-end">
              <button className="rounded-md transition ease-in-out hover:bg-[#29c2b0] w-fit" onClick={() => props.setIsOpen(false)}><CloseIcon sx={{fontSize: 40}}/></button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <div className="flex justify-center">
          <DocumentUpload/>
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
                </TableRow>
              </TableHead>
              <TableBody>
               
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Dialog>
  )
}
