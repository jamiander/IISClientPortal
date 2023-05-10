import Dialog from "@mui/material/Dialog"
import CloseIcon from '@mui/icons-material/Close';
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, StyledTextarea, cancelButtonStyle, labelStyle, submitButtonStyle, yellowButtonStyle } from "../../Styles";
import { Fragment, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { User, deleteUserInfo, upsertUserInfo } from "../../Store/UserSlice";
import Button from "@mui/material/Button";
import { Company, IntegrityId } from "../../Store/CompanySlice";
import {v4 as UuidV4} from "uuid";
import { useAppDispatch } from "../../Store/Hooks";
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { ValidateAdminUser, ValidateUser, ValidationFailedPrefix } from "../../Services/Validation";
import { DeleteDecisionAlert } from "../Initiative/DeleteDecisionAlert";
import { AdminEditInitiativesList } from "./AdminEditInitiativesList";

export const AdminEditUserDataIds = {
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

interface AdminEditUserDataProps {
  isOpen: boolean
  companies: Company[]
  users: User[]
  setIsOpen: (value: boolean) => void
}

export default function AdminEditUserDataModal(props: AdminEditUserDataProps){
  enum State {
    edit,
    add,
    start
  }

  const [modalState, setModalState] = useState(State.start);

  const dispatch = useAppDispatch();
  const [usersList, setUsersList] = useState<User[]>(props.users);
  const [userToEdit, setUserToEdit] = useState<User>();
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentInitiatives, setCurrentInitiatives] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState("");
  const [currentPhone, setCurrentPhone] = useState("");
  const [currentIsAdmin, setCurrentIsAdmin] = useState(false);
  const InEditMode = () => modalState === State.edit || modalState === State.add;
  const [searchedKeyword, setSearchedKeyword] = useState("");

  useEffect(() => {
    setUsersList(props.users);
    LeaveEditMode();
  },[props.isOpen])

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
      let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
      usersClone = usersClone.filter(user => user.id !== userToEdit.id);

      setUsersList(usersClone);
    }
    LeaveEditMode()
  }

  function HandleEditUser(id: string, newEmail: string, newPassword: string, newInitiatives: string[], newName: string, newPhone: string, isAdmin: boolean) {
    let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
    let newUser = usersClone.find(u => u.id === id);
    if(newUser) {
      newUser.email = newEmail;
      newUser.password = newPassword;
      newUser.initiativeIds = newInitiatives;
      newUser.name = newName;
      newUser.phoneNumber = newPhone;
      newUser.isAdmin = isAdmin;
      let successfulSubmit = SubmitUserData(newUser);
      if(successfulSubmit) setUsersList(usersClone);
    }
  }

  function SubmitUserData(user: User): boolean {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    let validation = ValidateAdminUser(user,usersList);
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
    let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
    let myUuid = UuidV4();
    let newUser: User = {id: myUuid, email: "", password: "", companyId: IntegrityId, initiativeIds: [], name: "", phoneNumber: "", isAdmin: false}
    usersClone.unshift(newUser);
    setUsersList(usersClone);
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
      <Dialog
        id={AdminEditUserDataIds.modal}
        open={props.isOpen}
        onClose={() => props.setIsOpen(false)}
        fullWidth
        maxWidth={false}
      >
        <div className="flex col-span-4 bg-[#2ed7c3] rounded-md py-6 px-5">
          <div className="w-full flex justify-between">
            <div className="space-y-2 w-1/2">
              <p className="text-5xl font-bold w-full">Integrity Inspired Solutions</p>
              <p className="text-3xl w-full">Users</p>
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex justify-end">
                <button id={AdminEditUserDataIds.closeModalButton} className="rounded-md transition ease-in-out hover:bg-[#29c2b0] w-fit" onClick={() => props.setIsOpen(false)}>
                  <CloseIcon sx={{ fontSize: 40 }} />
                </button>
              </div>
              <button disabled={InEditMode()} id={AdminEditUserDataIds.addButton} className={yellowButtonStyle} onClick={() => HandleAddEmptyUser()}>Add User</button>
            </div>
          </div>
        </div>
        <div className="mx-[2%] mb-[2%]">
          {usersList.length !== 0 &&
            <div className="mt-2 mb-4">
              <StyledTextField className="w-1/2" id={AdminEditUserDataIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name or email" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)} />
            </div>
          }
          <Grid container spacing={6}>
            {usersList.filter(u => u.email.toUpperCase().includes(searchedKeyword.toUpperCase()) || u.name?.toUpperCase().includes(searchedKeyword.toUpperCase())).map((displayItem, key) => {
              let isEdit = InEditMode() && displayItem.id === userToEdit?.id;
              return (
                <Grid item md={4} key={key}>
                  <Item>
                    <StyledCard>
                      <StyledCardContent>
                        {isEdit ?
                          <>
                            <label className={labelStyle} htmlFor={AdminEditUserDataIds.email}></label>
                            <StyledTextField id={AdminEditUserDataIds.email} label="Email" value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} />
                            <label className={labelStyle} htmlFor={AdminEditUserDataIds.password}></label>
                            <StyledTextField id={AdminEditUserDataIds.password} label="Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            <StyledTextField id={AdminEditUserDataIds.name} label="Name" value={currentName} onChange={e => setCurrentName(e.target.value)} />
                            <StyledTextField id={AdminEditUserDataIds.phone} label="Phone Number" value={currentPhone} onChange={e => setCurrentPhone(e.target.value)} />
                            <FormGroup>
                              Initiatives
                              {props.companies.map((company,index) => {
                                return (
                                  <Fragment key={index}>
                                    <AdminEditInitiativesList company={company} initiativeIds={currentInitiatives} editable={true} updateInitiativeIds={UpdateCurrentInitiatives}/>
                                  </Fragment>
                                )
                              })
                              }
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel control={<Checkbox checked={currentIsAdmin} onChange={(e) => setCurrentIsAdmin(e.target.checked)}/>} label="Admin" />
                            </FormGroup>
                          </>
                        :
                          <>
                            <label className={labelStyle} htmlFor={AdminEditUserDataIds.email}></label>
                            <StyledTextField id={AdminEditUserDataIds.email} label="Email" disabled value={displayItem.email} />
                            <label className={labelStyle} htmlFor={AdminEditUserDataIds.password}></label>
                            <StyledTextField id={AdminEditUserDataIds.password} label="Password" disabled value={displayItem.password} />
                            <StyledTextField id={AdminEditUserDataIds.name} label="Name" disabled value={displayItem.name ? displayItem.name : ""} />
                            <StyledTextField id={AdminEditUserDataIds.phone} label="Phone Number" disabled value={displayItem.phoneNumber ? displayItem.phoneNumber : ""} />
                            <FormGroup>
                              Initiatives
                              {props.companies.map((company,index) => {
                                return (
                                  <Fragment key={index}>
                                    <AdminEditInitiativesList company={company} initiativeIds={displayItem.initiativeIds} editable={false} updateInitiativeIds={UpdateCurrentInitiatives} />
                                  </Fragment>
                                )
                              })
                            }
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel control={<Checkbox checked={displayItem.isAdmin}/>} label="Admin" />
                            </FormGroup>
                          </>
                        }
                      </StyledCardContent>
                      <StyledCardActions>
                        {isEdit &&
                          <div className="flex w-full justify-between">
                            <button id={AdminEditUserDataIds.saveChangesButton} className={submitButtonStyle} onClick={() => HandleEditUser(displayItem.id, currentEmail, currentPassword, currentInitiatives, currentName, currentPhone, currentIsAdmin)}>Save</button>
                            <button id={AdminEditUserDataIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => HandleCancelEdit()}>Cancel</button>
                          </div>
                        }
                        {!isEdit && !InEditMode() &&
                          <div className="flex w-full justify-between">
                            <button id={AdminEditUserDataIds.editButton} className={submitButtonStyle} onClick={() => EnterEditMode(displayItem.id, usersList, false)}>Edit</button>
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
      </Dialog>
    </>
  );
}

