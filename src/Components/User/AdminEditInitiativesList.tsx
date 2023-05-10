import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel } from "@mui/material";
import { Company } from "../../Store/CompanySlice";
import { Fragment } from "react";

interface AdminEditInitiativesListProps {
  company: Company
  initiativeIds: string[]
  editable: boolean
  updateInitiativeIds: (initId: string, checked: boolean) => void
}

export function AdminEditInitiativesList(props: AdminEditInitiativesListProps)
{
  const isCompanyChecked = props.company.initiatives.find(init => props.initiativeIds.find(i => i === init.id) !== undefined);
  if(isCompanyChecked || props.editable)
  {
    return (
      <Accordion>
        <AccordionSummary>
          <p className={isCompanyChecked ? "font-bold" : ""}>
            {props.company.name}
          </p>
        </AccordionSummary>
        <AccordionDetails>
        {
          props.company.initiatives.map((init, index) => {
            let checkedInitId = props.initiativeIds.find(id => id === init.id);
            let checkedInit = props.company.initiatives.find(x => x.id === checkedInitId);

            if(props.editable)
            {
              return (
                <FormControlLabel key={index} control={<Checkbox checked={props.initiativeIds.find(id => init.id === id) !== undefined} onChange={(e) => props.updateInitiativeIds(init.id, e.target.checked)} />} label={init.title} />
              );
            }
            else
            {
              return (
                <FormControlLabel key={index} control={<Checkbox checked={checkedInit !== undefined} />} label={init?.title} />
              );
            }
          })
        }
        </AccordionDetails>
      </Accordion>
    )
  }
  else
  {
    return <Fragment></Fragment>
  }
}
