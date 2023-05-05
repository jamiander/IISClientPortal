import { Fragment, useEffect, useState } from "react";
import { Company, selectAllCompanies, upsertCompanyInfo } from "../Store/CompanySlice"
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { getUserById, selectAllUsers, selectCurrentUser, selectCurrentUserId } from "../Store/UserSlice";
import { EditUserDataButton } from "../Components/User/EditUserDataButton";
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, yellowButtonStyle } from "../Styles";
import { ValidateNewCompany, ValidationFailedPrefix } from "../Services/Validation";
import { enqueueSnackbar } from "notistack";
import { v4 } from "uuid";
import EditIcon from '@mui/icons-material/Edit';

export const CompanyPageIds = {
  addClientButton: "CompanyPageAddClientButton",
  clientNameInput: "CompanyPageClientNameInput",
  saveClientButton: "CompanyPageSaveButton",
  cancelClientButton: "CompanyPageCancelButton",
  editClientNameButton: "CompanyPageEditNameButton"
}

export function CompanyPage()
{
  const allCompanies = useAppSelector(selectAllCompanies);
  const allUsers = useAppSelector(selectAllUsers);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const dispatch = useAppDispatch();

  const [newCompanyName, setNewCompanyName] = useState("");
  const [displayCompanies, setDisplayCompanies] = useState<Company[]>([]);
  const [companyToEdit, setCompanyToEdit] = useState<Company>();

  enum State {
    edit,
    add,
    start
  }

  const [pageState, setPageState] = useState(State.start);

  useEffect(() =>
  {
    if(allUsers.find(user => user.id === currentUserId)?.isAdmin)
      dispatch(getUserById({}));
  }, [currentUserId]);

  useEffect(() => {
    setDisplayCompanies(allCompanies);
  },[allCompanies])

  function BeginEdit(editableCompany: Company, newState: State)
  {
    setPageState(newState);
    setNewCompanyName(editableCompany.name);
    setCompanyToEdit(editableCompany);
  }

  function HandleAddClientButton()
  {
    let companyClones: Company[] = JSON.parse(JSON.stringify(displayCompanies));
    const newCompany: Company = {
      id: v4(),
      name: "",
      initiatives: []
    }
    companyClones.unshift(newCompany);
    setDisplayCompanies(companyClones);
    BeginEdit(newCompany,State.add);
  }

  function HandleEditCompanyButton(companyId: string)
  {
    let matchingCompany = displayCompanies.find(company => company.id === companyId);
    if(matchingCompany)
    {
      BeginEdit(matchingCompany,State.edit);
    }
  }

  function HandleCancelEditCompanyButton()
  {
    if(pageState === State.add)
    {
      let companyClones: Company[] = JSON.parse(JSON.stringify(displayCompanies));
      companyClones.splice(0,1);
      setDisplayCompanies(companyClones);
    }
    setPageState(State.start);
    setCompanyToEdit(undefined);
  }

  function HandleSaveCompanyButton()
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    
    let companyClone: Company = JSON.parse(JSON.stringify(companyToEdit));
    companyClone.name = newCompanyName;

    const validation = ValidateNewCompany(companyClone.name,allCompanies);
    if(validation.success && companyToEdit)
    {
      dispatch(upsertCompanyInfo({isTest: isTest, company: companyClone}));
      setPageState(State.start);
      setCompanyToEdit(undefined);
      enqueueSnackbar("New Client Added!", {variant: "success"});
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
  }

  return (
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
      <div className="col-span-4 p-2">
        <div className="flex justify-end">
          <button id={CompanyPageIds.addClientButton} disabled={pageState !== State.start} className={yellowButtonStyle + " mb-4"} onClick={() => HandleAddClientButton()}>
            Add New Client
          </button>
        </div>
        <Grid container spacing={2}>
        {
          displayCompanies.map((company,index) => {
            const usersAtCompany = allUsers.filter(user => user.companyId === company.id);
            return (
              <Fragment key={index}>
                {company.id !== companyToEdit?.id ?
                <Grid item md={4} id={"companyPageCard"+company.id}>
                  <Item>
                    <StyledCard>
                      <StyledCardContent>
                        <div className="flex justify-center">
                          <p className="text-2xl font-semibold">{company.name}</p>
                          <button id={CompanyPageIds.editClientNameButton} onClick={() => HandleEditCompanyButton(company.id)}><EditIcon sx={{fontSize: 18}}/></button>
                        </div>
                        <Grid container justifyContent="space-evenly">
                        {
                          usersAtCompany.map((user,jndex) => {
                            return(
                              <Grid item md="auto" key={jndex}>
                                <div className="p-2">
                                  <p>{user.email}</p>
                                </div>
                              </Grid>
                            )
                          })
                        }
                        </Grid>
                      </StyledCardContent>
                      <StyledCardActions>
                        {pageState === State.start && <EditUserDataButton company={company} users={usersAtCompany}></EditUserDataButton>}
                      </StyledCardActions>
                    </StyledCard>
                  </Item>
                </Grid>
              :
                <Grid item md={4}>
                  <Item>
                    <StyledCard>
                      <StyledCardContent>
                        <StyledTextField id={CompanyPageIds.clientNameInput} placeholder="New Client Name" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)}>
                        </StyledTextField>
                      </StyledCardContent>
                      <StyledCardActions>
                        <div className="flex justify-between w-full">
                          <Button id={CompanyPageIds.saveClientButton} onClick={() => HandleSaveCompanyButton()}>
                            Save
                          </Button>
                          <Button id={CompanyPageIds.cancelClientButton} onClick={() => HandleCancelEditCompanyButton()}>
                            Cancel
                          </Button>
                        </div>
                      </StyledCardActions>
                    </StyledCard>
                  </Item>
                </Grid>
              }
              </Fragment>
            )
          })
        }
        </Grid>
      </div>
    </div>
  )
}
