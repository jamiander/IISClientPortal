import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledFormGroup, StyledTextField, cancelButtonStyle, cardHeader, submitButtonStyle, yellowButtonStyle } from "../Styles";
import { Fragment, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { User, getUserById, selectAllUsers, selectCurrentUserId, upsertUserInfo } from "../Store/UserSlice";
import { Company, IntegrityId, selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { AdminEditInitiativesList } from "../Components/User/AdminEditInitiativesList";
import { useEditUser } from "../Services/useEditUser";
import { DocumentUpload } from "../Components/DocumentUpload";
import { EditUserInitiativesButton } from "../Components/User/EditUserInitiativesButton";
import { ValidateUser, ValidationFailedPrefix } from "../Services/Validation";
import { enqueueSnackbar } from "notistack";

const IntegrityPageIds = {
  modal: "adminEditUserModal",
  closeModalButton: "adminEditUserModalCloseModalButton",
  email: "adminEditUserEmail",
  password: "adminEditUserPassword",
  initiativeIds: "adminEditUserInitiativeIds",
  name: "adminEditUserName",
  phone: "adminEditUserPhone",
  isAdmin: "adminEditIsAdmin",
  addButton: "adminEditUserAddButton",
  editButton: "adminEditUserEditButton",
  saveChangesButton: "adminEditUserSaveChangesButton",
  cancelChangesButton: "adminEditUserCancelChangesButton",
  deleteButton: "adminEditUserDeleteButton",
  keywordFilter: "adminEditUserKeywordFilter",
  grid: "adminEditUserGrid"
}

export default function IntegrityPage(){
  const allCompanies = useAppSelector(selectAllCompanies);
  const allUsers = useAppSelector(selectAllUsers);
  const [sortedCompanies, setSortedCompanies] = useState<Company[]>([]);
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [integrityUsers, setIntegrityUsers] = useState<User[]>([]);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const dispatch = useAppDispatch();

  const {
    SetupEditUser,
    EnterEditMode,
    InEditMode,
    AddEmptyUser,
    SaveEdit,
    CancelEdit,
    usersList,
    userToEdit,
    SubmitUserData,
    currentEmail,
    setCurrentEmail,
    currentPassword,
    setCurrentPassword,
    currentInitiativeIds,
    setCurrentInitiativeIds,
    currentName,
    setCurrentName,
    currentPhone,
    setCurrentPhone,
    currentIsAdmin,
    setCurrentIsAdmin,
    searchedKeyword,
    setSearchedKeyword
  } = useEditUser();


  useEffect(() =>
  {
    if(allUsers.find(user => user.id === currentUserId)?.isAdmin)
      dispatch(getUserById({}));
  }, [currentUserId]);

  useEffect(() => 
  {
    const newIntegrityUsers = allUsers.filter(user => user.companyId === IntegrityId);
    setIntegrityUsers(newIntegrityUsers);
    SetupEditUser(newIntegrityUsers);
  }, [allUsers])

  useEffect(() => {
    let newSortedUsers: User[] = JSON.parse(JSON.stringify(usersList));
    newSortedUsers.sort((a: User, b: User) => a.email.toUpperCase() > b.email.toUpperCase() ? 1 : -1);
    setSortedUsers(newSortedUsers);
  }, [usersList]);

  useEffect(() => {
    let newSortedCompanies: Company[] = JSON.parse(JSON.stringify(allCompanies));
    newSortedCompanies.sort((a: Company, b: Company) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    setSortedCompanies(newSortedCompanies);
  }, [allCompanies]);


  const showFileUpload = false;

  return (
    <>
      {
      showFileUpload &&
      <DocumentUpload/>
      }
        <div className="flex col-span-4 bg-[#2ed7c3] rounded-md py-6 px-5">
          <div className="w-full flex justify-between">
            <div className="space-y-2 w-1/2">
              <p className="text-5xl font-bold w-full">Integrity Inspired Solutions</p>
              <p className="text-3xl w-full">Users</p>
            </div>
            <div className="flex flex-col justify-between">
              <button disabled={InEditMode()} id={IntegrityPageIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyUser(IntegrityId)}>Add User</button>
            </div>
          </div>
        </div>
        <div className="mx-[2%] mb-[2%]">
          {sortedUsers.length !== 0 &&
            <div className="mt-2 mb-4">
              <StyledTextField className="w-1/2" id={IntegrityPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name or email" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)} />
            </div>
          }
          <Grid container spacing={2} id={IntegrityPageIds.grid}>
            {sortedUsers.filter(u => u.email.toUpperCase().includes(searchedKeyword.toUpperCase()) || u.name?.toUpperCase().includes(searchedKeyword.toUpperCase())).map((displayItem: User, key: number) => {
              let isEdit = InEditMode() && displayItem.id === userToEdit?.id;
              return (
                <Grid item md={4} key={key}>
                  <Item>
                    <StyledCard>
                      <StyledCardContent>
                        {isEdit ?
                          <>
                            <StyledTextField id={IntegrityPageIds.name} label="Name" value={currentName} onChange={e => setCurrentName(e.target.value)} />
                            <StyledTextField id={IntegrityPageIds.email} label="Email" value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} />
                            <StyledTextField id={IntegrityPageIds.password} label="Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            <StyledTextField id={IntegrityPageIds.phone} label="Phone Number" value={currentPhone} onChange={e => setCurrentPhone(e.target.value)} />
                            <StyledFormGroup >
                              <FormControlLabel control={<Checkbox id={IntegrityPageIds.isAdmin} checked={currentIsAdmin} onChange={(e) => setCurrentIsAdmin(e.target.checked)}/>} label="Admin" />
                            </StyledFormGroup>
                            <FormGroup className="mt-8">
                            <h2 className={cardHeader}>Associated<br/>Companies and Initiatives</h2>
                              {sortedCompanies.map((company: Company,index: number) => {
                                return (
                                  <Fragment key={index}>
                                    <AdminEditInitiativesList company={company} initiativeIds={currentInitiativeIds} editable={true} updateInitiativeIds={setCurrentInitiativeIds} expanded={false} updateCompanyId={function (companyId: string): void {
                                      throw new Error("Function not implemented.");
                                    } }/>
                                  </Fragment>
                                )
                              })
                              }
                            </FormGroup>
                          </>
                        :
                          <>
                            <StyledTextField id={IntegrityPageIds.name} label="Name" disabled value={displayItem.name ? displayItem.name : ""} />
                            <StyledTextField id={IntegrityPageIds.email} label="Email" disabled value={displayItem.email} />
                            <StyledTextField id={IntegrityPageIds.password} label="Password" disabled value={displayItem.password} />
                            <StyledTextField id={IntegrityPageIds.phone} label="Phone Number" disabled value={displayItem.phoneNumber ? displayItem.phoneNumber : ""} />
                            <StyledFormGroup>
                              <FormControlLabel disabled control={<Checkbox id={IntegrityPageIds.isAdmin} checked={displayItem.isAdmin}/>} label="Admin" />
                            </StyledFormGroup>
                            <FormGroup className="mt-8">
                            <h2 className={cardHeader}>Associated<br/>Companies and Initiatives</h2>
                              {sortedCompanies.map((company: Company,index: number) => {
                                return (
                                  <Fragment key={index}>
                                    <AdminEditInitiativesList company={company} initiativeIds={displayItem.initiativeIds} editable={false} updateInitiativeIds={setCurrentInitiativeIds} expanded={false} updateCompanyId={function (companyId: string): void {
                                      throw new Error("Function not implemented.");
                                    } } />
                                  </Fragment>
                                )
                              })
                            }
                            </FormGroup>
                          </>
                        }
                      </StyledCardContent>
                      <StyledCardActions>
                        {isEdit &&
                          <div className="flex w-full justify-between">
                            <button id={IntegrityPageIds.saveChangesButton} className={submitButtonStyle} onClick={() => SaveEdit()}>Save</button>
                            <button id={IntegrityPageIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => CancelEdit()}>Cancel</button>
                          </div>
                        }
                        {!isEdit && !InEditMode() &&
                          <div className="flex w-full justify-between">
                            <button id={IntegrityPageIds.editButton} className={submitButtonStyle} onClick={() => EnterEditMode(displayItem.id, integrityUsers, false)}>Edit</button>
                          </div>
                        }
                        <EditUserInitiativesButton allCompanies={sortedCompanies} user={displayItem} SubmitUserData={SubmitUserData} expanded={false}/>
                      </StyledCardActions>
                    </StyledCard>
                  </Item>
                </Grid>
              );
            })}
          </Grid>
        </div>
    </>
  );
}