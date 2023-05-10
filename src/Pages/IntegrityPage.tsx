import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, cancelButtonStyle, labelStyle, submitButtonStyle, yellowButtonStyle } from "../Styles";
import { Fragment, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { User, getUserById, selectAllUsers, selectCurrentUserId, upsertUserInfo } from "../Store/UserSlice";
import { IntegrityId, selectAllCompanies } from "../Store/CompanySlice";
import {v4 as UuidV4} from "uuid";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { ValidateAdminUser, ValidationFailedPrefix } from "../Services/Validation";
import { AdminEditInitiativesList } from "../Components/User/AdminEditInitiativesList";

export const IntegrityPageIds = {
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
  keywordFilter: "adminEditUserKeywordFilter"
}

export default function IntegrityPage(){
  const allCompanies = useAppSelector(selectAllCompanies);
  const allUsers = useAppSelector(selectAllUsers);
  const [integrityUsers, setIntegrityUsers] = useState<User[]>([]);
  const currentUserId = useAppSelector(selectCurrentUserId);
  
  enum State {
    edit,
    add,
    start
  }

  const [modalState, setModalState] = useState(State.start);

  const dispatch = useAppDispatch();
  const [userToEdit, setUserToEdit] = useState<User>();
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentInitiatives, setCurrentInitiatives] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState("");
  const [currentPhone, setCurrentPhone] = useState("");
  const [currentIsAdmin, setCurrentIsAdmin] = useState(false);
  const InEditMode = () => modalState === State.edit || modalState === State.add;
  const [searchedKeyword, setSearchedKeyword] = useState("");

  useEffect(() =>
  {
    if(allUsers.find(user => user.id === currentUserId)?.isAdmin)
      dispatch(getUserById({}));
  }, [currentUserId]);

  useEffect(() => 
  {
    setIntegrityUsers(allUsers.filter(user => user.companyId === IntegrityId));
  }, [allUsers])

  function EnterEditMode(id: string, users: User[], isNew: boolean) { 
    let currentUser = users.find(u => u.id === id);
    if(currentUser)
    {
      setModalState(isNew ? State.add : State.edit);
      setUserToEdit(currentUser);
      setCurrentEmail(currentUser.email);
      setCurrentPassword(currentUser.password);
      setCurrentInitiatives(currentUser.initiativeIds);
      setCurrentName(currentUser.name ? currentUser.name : "");
      setCurrentPhone(currentUser.phoneNumber ? currentUser.phoneNumber : "");
      setCurrentIsAdmin(currentUser.isAdmin);
    }
  }

  function LeaveEditMode() {
    setModalState(State.start);    
    setUserToEdit(undefined);
  }

  function HandleCancelEdit() {
    if(modalState === State.add && userToEdit)
    {
      let usersClone: User[] = JSON.parse(JSON.stringify(integrityUsers));
      usersClone = usersClone.filter(user => user.id !== userToEdit.id);
      setIntegrityUsers(usersClone);
    }
    LeaveEditMode()
  }

  function HandleEditUser(id: string, newEmail: string, newPassword: string, newInitiatives: string[], newName: string, newPhone: string, isAdmin: boolean) {
    let usersClone: User[] = JSON.parse(JSON.stringify(integrityUsers));
    let newUser = usersClone.find(u => u.id === id);
    if(newUser) {
      newUser.email = newEmail;
      newUser.password = newPassword;
      newUser.initiativeIds = newInitiatives;
      newUser.name = newName;
      newUser.phoneNumber = newPhone;
      newUser.isAdmin = isAdmin;
      let successfulSubmit = SubmitUserData(newUser);
      if(successfulSubmit) setIntegrityUsers(usersClone);
    }
  }

  function SubmitUserData(user: User): boolean {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    let validation = ValidateAdminUser(user,integrityUsers);
    if(validation.success)
    {
      dispatch(upsertUserInfo({isTest: isTest, users: [user]}))
      LeaveEditMode();
      return true;
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
    
    return false;
  }

  function HandleAddEmptyUser() {
    let usersClone: User[] = JSON.parse(JSON.stringify(integrityUsers));
    let myUuid = UuidV4();
    let newUser: User = {id: myUuid, email: "", password: "", companyId: IntegrityId, initiativeIds: [], name: "", phoneNumber: "", isAdmin: false}
    usersClone.unshift(newUser);
    setIntegrityUsers(usersClone);
    setSearchedKeyword("");
    EnterEditMode(myUuid,usersClone,true);
  }

  function UpdateCurrentInitiatives(checked: boolean, id: string) {
    let initiativesClone: string[] = JSON.parse(JSON.stringify(currentInitiatives));
    let matchingIdIndex = initiativesClone.findIndex(initId => initId === id);
    if(matchingIdIndex > -1)
    {
      if(!checked)
        initiativesClone.splice(matchingIdIndex,1);
    }
    else
    {
      if(checked)
        initiativesClone.push(id);
    }
    setCurrentInitiatives(initiativesClone);
  }

  return (
    <>
      
        <div className="flex col-span-4 bg-[#2ed7c3] rounded-md py-6 px-5">
          <div className="w-full flex justify-between">
            <div className="space-y-2 w-1/2">
              <p className="text-5xl font-bold w-full">Integrity Inspired Solutions</p>
              <p className="text-3xl w-full">Users</p>
            </div>
            <div className="flex flex-col justify-between">
              <button disabled={InEditMode()} id={IntegrityPageIds.addButton} className={yellowButtonStyle} onClick={() => HandleAddEmptyUser()}>Add User</button>
            </div>
          </div>
        </div>
        <div className="mx-[2%] mb-[2%]">
          {integrityUsers.length !== 0 &&
            <div className="mt-2 mb-4">
              <StyledTextField className="w-1/2" id={IntegrityPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name or email" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)} />
            </div>
          }
          <Grid container spacing={6}>
            {integrityUsers.filter(u => u.email.toUpperCase().includes(searchedKeyword.toUpperCase()) || u.name?.toUpperCase().includes(searchedKeyword.toUpperCase())).map((displayItem, key) => {
              let isEdit = InEditMode() && displayItem.id === userToEdit?.id;
              return (
                <Grid item md={4} key={key}>
                  <Item>
                    <StyledCard>
                      <StyledCardContent>
                        {isEdit ?
                          <>
                            <label className={labelStyle} htmlFor={IntegrityPageIds.email}></label>
                            <StyledTextField id={IntegrityPageIds.email} label="Email" value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} />
                            <label className={labelStyle} htmlFor={IntegrityPageIds.password}></label>
                            <StyledTextField id={IntegrityPageIds.password} label="Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            <StyledTextField id={IntegrityPageIds.name} label="Name" value={currentName} onChange={e => setCurrentName(e.target.value)} />
                            <StyledTextField id={IntegrityPageIds.phone} label="Phone Number" value={currentPhone} onChange={e => setCurrentPhone(e.target.value)} />
                            <FormGroup>
                              Initiatives
                              {allCompanies.map((company,index) => {
                                return (
                                  <Fragment key={index}>
                                    <AdminEditInitiativesList company={company} initiativeIds={currentInitiatives} editable={true} updateInitiativeIds={UpdateCurrentInitiatives}/>
                                  </Fragment>
                                )
                              })
                              }
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel control={<Checkbox id={IntegrityPageIds.isAdmin} checked={currentIsAdmin} onChange={(e) => setCurrentIsAdmin(e.target.checked)}/>} label="Admin" />
                            </FormGroup>
                          </>
                        :
                          <>
                            <label className={labelStyle} htmlFor={IntegrityPageIds.email}></label>
                            <StyledTextField id={IntegrityPageIds.email} label="Email" disabled value={displayItem.email} />
                            <label className={labelStyle} htmlFor={IntegrityPageIds.password}></label>
                            <StyledTextField id={IntegrityPageIds.password} label="Password" disabled value={displayItem.password} />
                            <StyledTextField id={IntegrityPageIds.name} label="Name" disabled value={displayItem.name ? displayItem.name : ""} />
                            <StyledTextField id={IntegrityPageIds.phone} label="Phone Number" disabled value={displayItem.phoneNumber ? displayItem.phoneNumber : ""} />
                            <FormGroup>
                              Initiatives
                              {allCompanies.map((company,index) => {
                                return (
                                  <Fragment key={index}>
                                    <AdminEditInitiativesList company={company} initiativeIds={displayItem.initiativeIds} editable={false} updateInitiativeIds={UpdateCurrentInitiatives} />
                                  </Fragment>
                                )
                              })
                            }
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel control={<Checkbox id={IntegrityPageIds.isAdmin} checked={displayItem.isAdmin}/>} label="Admin" />
                            </FormGroup>
                          </>
                        }
                      </StyledCardContent>
                      <StyledCardActions>
                        {isEdit &&
                          <div className="flex w-full justify-between">
                            <button id={IntegrityPageIds.saveChangesButton} className={submitButtonStyle} onClick={() => HandleEditUser(displayItem.id, currentEmail, currentPassword, currentInitiatives, currentName, currentPhone, currentIsAdmin)}>Save</button>
                            <button id={IntegrityPageIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => HandleCancelEdit()}>Cancel</button>
                          </div>
                        }
                        {!isEdit && !InEditMode() &&
                          <div className="flex w-full justify-between">
                            <button id={IntegrityPageIds.editButton} className={submitButtonStyle} onClick={() => EnterEditMode(displayItem.id, integrityUsers, false)}>Edit</button>
                          </div>
                        }
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