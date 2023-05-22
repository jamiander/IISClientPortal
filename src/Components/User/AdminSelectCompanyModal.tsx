import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { cancelButtonStyle, submitButtonStyle } from "../../Styles";
import { Company } from "../../Store/CompanySlice";

export const AdminSelectCompanyModalIds = {
  modal: "adminSelectCompanyModal",
  confirmButton: "adminSelectCompanyConfirmButton",
  cancelButton: "adminSelectCompanyCancelButton",
  select: "adminSelectCompanySelect"
}

interface AdminSelectCompanyModalProps {
  isOpen: boolean,
  setIsOpen: (value: boolean) => void,
  Confirm: () => void,
  Cancel: () => void,
  companyId: string | undefined,
  setCompanyId: (value: string) => void
  companies: Company[]
}

export function AdminSelectCompanyModal(props: AdminSelectCompanyModalProps)
{
  function HandleSelectCompany(id: string)
  {
    const matchingCompany = props.companies.find(c => c.id);
    if(matchingCompany)
    {
      props.setCompanyId(id);
    }
  }

  return (
    <Dialog
    open={props.isOpen}
    onClose={()=>props.setIsOpen(false)}
    maxWidth={false}
    id={AdminSelectCompanyModalIds.modal}
    >
      <DialogTitle>
        Select a Company
      </DialogTitle>
      <DialogContent>
        <div className="m-2">
          <FormControl fullWidth>
            <InputLabel id="company-select-label">Company</InputLabel>
            <Select id={AdminSelectCompanyModalIds.select} labelId="company-select-label" label="Company" value={props.companyId} onChange={(e) => HandleSelectCompany(e.target.value)}>
              {
                props.companies.map((company,index) => {
                  return (
                    <MenuItem key={index} value={company.id}>
                      {company.name}
                    </MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <div className="flex justify-between">
          <button id={AdminSelectCompanyModalIds.confirmButton} className={submitButtonStyle} onClick={() => props.Confirm()}>Confirm</button>
          <button id={AdminSelectCompanyModalIds.cancelButton} className={cancelButtonStyle} onClick={() => props.Cancel()}>Cancel</button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

