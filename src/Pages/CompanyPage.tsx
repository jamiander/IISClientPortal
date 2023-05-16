import { Fragment, useEffect, useState } from "react";
import { Company, IntegrityId, selectAllCompanies, upsertCompanyInfo } from "../Store/CompanySlice"
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { Grid } from "@mui/material";
import { User, getUserById, selectAllUsers, selectCurrentUserId } from "../Store/UserSlice";
import { EditUserDataButton } from "../Components/User/EditUserDataButton";
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, cancelButtonStyle, cardHeader, submitButtonStyle, yellowButtonStyle } from "../Styles";
import { ValidateCompany, ValidationFailedPrefix } from "../Services/Validation";
import { enqueueSnackbar } from "notistack";
import { v4 } from "uuid";
import EditIcon from '@mui/icons-material/Edit';

export const CompanyPageIds = {
  addClientButton: "CompanyPageAddClientButton",
  clientNameInput: "CompanyPageClientNameInput",
  saveClientButton: "CompanyPageSaveButton",
  cancelClientButton: "CompanyPageCancelButton",
  editClientNameButton: "CompanyPageEditNameButton",
  name: "CompanyPageUserName",
  email: "CompanyPageUserEmail"
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
  
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);

  enum State {
    edit,
    add,
    start
  }

  const [pageState, setPageState] = useState(State.start);

  useEffect(() => {
    let newSortedUsers: User[] = JSON.parse(JSON.stringify(allUsers));
    newSortedUsers.sort((a: User, b: User) => a.email.toUpperCase() > b.email.toUpperCase() ? 1 : -1);
    setSortedUsers(newSortedUsers);

  }, [allUsers])

  useEffect(() =>
  {
    if(allUsers.find((user: User) => user.id === currentUserId)?.isAdmin)
      dispatch(getUserById({}));
  }, [currentUserId]);

  useEffect(() => {
    let sortedCompanies: Company[] = JSON.parse(JSON.stringify(allCompanies));
    sortedCompanies.sort((a: Company, b: Company) => a.name > b.name ? 1 : -1);

    setDisplayCompanies(sortedCompanies.filter((company: Company) => company.id !== IntegrityId));
  },[allCompanies])

  function BeginEdit(editableCompany: Company, newCompany: boolean)
  {
    setPageState(newCompany ? State.add : State.edit);
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
    BeginEdit(newCompany,true);
  }

  function HandleEditCompanyButton(companyId: string)
  {
    let matchingCompany = displayCompanies.find(company => company.id === companyId);
    if(matchingCompany)
    {
      BeginEdit(matchingCompany,false);
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

    const validation = ValidateCompany(companyClone,allCompanies);
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
            const usersAtCompany = sortedUsers.filter(user => user.companyId === company.id);
            const isEdit = (pageState === State.edit || pageState === State.add) && company.id === companyToEdit?.id;
            return (
              <Fragment key={index}>
                {!isEdit ?
                <Grid item md={4} id={"companyPageCard"+company.id}>
                  <Item>
                    <StyledCard>
                      <StyledCardContent>
                        <div className="flex justify-center">
                        <h2 className={cardHeader}>{company.name}</h2>
                          <button className="mb-6" id={CompanyPageIds.editClientNameButton} onClick={() => HandleEditCompanyButton(company.id)}><EditIcon sx={{fontSize: '18px', marginLeft: '15px'}}/></button>
                        </div>
                            {
                              usersAtCompany.map((user: User,jndex: number) => {
                                return(
                                  <Fragment key={jndex}>
                                    <StyledTextField disabled label="Name and Email" className="bg-white" value={(user.name ? user.name : "Unknown") + "  :  " + user.email}>
                                    </StyledTextField>
                                  </Fragment>    
                                  )
                              })
                            }
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
                          <button id={CompanyPageIds.saveClientButton} className={submitButtonStyle} onClick={() => HandleSaveCompanyButton()}>
                            Save
                          </button>
                          <button id={CompanyPageIds.cancelClientButton} className={cancelButtonStyle} onClick={() => HandleCancelEditCompanyButton()}>
                            Cancel
                          </button>
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
