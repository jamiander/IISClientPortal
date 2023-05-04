import { Fragment, useEffect, useState } from "react";
import { Company, selectAllCompanies, upsertCompanyInfo } from "../Store/CompanySlice"
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { getUserById, selectAllUsers, selectCurrentUser, selectCurrentUserId } from "../Store/UserSlice";
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, yellowButtonStyle } from "../Styles";
import { ValidateNewCompany, ValidationFailedPrefix } from "../Services/Validation";
import { enqueueSnackbar } from "notistack";
import { v4 } from "uuid";

export const CompanyPageIds = {
  addClientButton: "CompanyPageAddClientButton",
  newClientName: "CompanyPageNewClientName",
  saveNewClientButton: "CompanyPageSaveButton",
  cancelNewClientButton: "CompanyPageCancelButton"
}

export function CompanyPage()
{
  const allCompanies = useAppSelector(selectAllCompanies);
  const allUsers = useAppSelector(selectAllUsers);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const dispatch = useAppDispatch();

  const [addingCompany, setAddingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");

  useEffect(() =>
  {
    if(allUsers.find(user => user.id === currentUserId)?.email === "admin@integrityinspired.com")
      dispatch(getUserById({}));
  }, [currentUserId]);

  function HandleAddClient()
  {
    setNewCompanyName("");
    setAddingCompany(true);
  }

  function HandleSaveCompany()
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    
    const newCompany: Company = {
      id: v4(),
      name: newCompanyName,
      initiatives: []
    }
    const validation = ValidateNewCompany(newCompanyName,allCompanies);
    if(validation.success)
    {
      dispatch(upsertCompanyInfo({isTest: isTest, company: newCompany}));
      setAddingCompany(false);
      setNewCompanyName("");
      enqueueSnackbar("New Client Added!", {variant: "success"});
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
  }

  return (
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
      <div className="col-span-4 p-2">
        <div className="flex justify-end">
          <button id={CompanyPageIds.addClientButton} disabled={addingCompany} className={yellowButtonStyle + " mb-4"} onClick={() => HandleAddClient()}>
            Add New Client
          </button>
        </div>
        <Grid container spacing={2}>
        {
          allCompanies.map((company,index) => {
            const usersAtCompany = allUsers.filter(user => user.companyId === company.id);
            return (
              <Fragment key={index}>
                <Grid item md={4}>
                  <Item>
                    <StyledCard>
                      <StyledCardContent>
                        <p className="text-2xl font-semibold">{company.name}</p>
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
                      </StyledCardActions>
                    </StyledCard>
                  </Item>
                </Grid>
              </Fragment>
            )
          })
        }
        {
          addingCompany &&
          <Grid item md={4}>
            <Item>
              <StyledCard>
                <StyledCardContent>
                  <StyledTextField id={CompanyPageIds.newClientName} placeholder="New Client Name" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)}>
                  </StyledTextField>
                </StyledCardContent>
                <StyledCardActions>
                  <div className="flex justify-between w-full">
                    <Button id={CompanyPageIds.saveNewClientButton} onClick={() => HandleSaveCompany()}>
                      Save
                    </Button>
                    <Button id={CompanyPageIds.cancelNewClientButton} onClick={() => setAddingCompany(false)}>
                      Cancel
                    </Button>
                  </div>
                </StyledCardActions>
              </StyledCard>
            </Item>
          </Grid>
        }
        </Grid>
      </div>
    </div>
  )
}
