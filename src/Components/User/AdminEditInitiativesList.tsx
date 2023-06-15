import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, FormGroup, ThemeProvider } from "@mui/material";
import { Company } from "../../Store/CompanySlice";
import { Fragment, useState } from "react";
import { IntegrityTheme, UserItem, integrityColors } from "../../Styles";
import ExpandMore from '@mui/icons-material/ExpandMore'
import { User } from "../../Store/UserSlice";

interface AdminEditInitiativesListProps {
  company: Company
  initiativeIds: string[]
  editable: boolean
  updateInitiativeIds: (initId: string, checked: boolean) => void
  //updateCompanyId: (companyId: string, checked: boolean) => void
  expanded: boolean
  user: User
}

export function AdminEditInitiativesList(props: AdminEditInitiativesListProps)
{
  const [expanded, setExpanded] = useState(props.expanded);
  const isCompanyChecked = props.company?.initiatives.find(init => props.initiativeIds.find(i => i === init.id) !== undefined);
  if(isCompanyChecked || props.editable)
  {
    return (
      <ThemeProvider theme={IntegrityTheme}>
        <UserItem> 
          <Accordion expanded={expanded}>
            <AccordionSummary className={"hover:bg-[#69D5C3]"} expandIcon={<ExpandMore />} onClick={() => setExpanded(!expanded)}>
              <p className={`text-xl ${isCompanyChecked ? "font-bold" : ""}`}>
                {props.company.name}
              </p>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
              {
                props.company?.initiatives.map((init, index) => {
                  let checkedInitId = props.initiativeIds.find(id => id === init.id);
                  let checkedInit = props.company.initiatives.find(x => x.id === checkedInitId);

                  if(props.editable)
                  {
                    return (
                      <FormControlLabel key={index} control={<Checkbox color="darkBlue" checked={props.initiativeIds.find(id => init.id === id) !== undefined} onChange={(e) => {props.updateInitiativeIds(init.id, e.target.checked)}} />} label={init.title} />
                    );
                  }
                  else
                  {
                    return (
                      <FormControlLabel disabled key={index} control={<Checkbox color="darkBlue" checked={checkedInit !== undefined} />} label={init?.title} />
                    );
                  }
                })
              }
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </UserItem>
      </ThemeProvider>
    )
  }
  else
  {
    return <Fragment></Fragment>
  }
}
