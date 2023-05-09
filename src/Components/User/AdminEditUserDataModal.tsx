import Dialog from "@mui/material/Dialog"
import CloseIcon from '@mui/icons-material/Close';
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, StyledTextarea, cancelButtonStyle, labelStyle, submitButtonStyle, yellowButtonStyle } from "../../Styles";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { User, deleteUserInfo, upsertUserInfo } from "../../Store/UserSlice";
import Button from "@mui/material/Button";
import { Company, IntegrityId } from "../../Store/CompanySlice";
import {v4 as UuidV4} from "uuid";
import { useAppDispatch } from "../../Store/Hooks";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { ValidateUser, ValidationFailedPrefix } from "../../Services/Validation";
import { DeleteDecisionAlert } from "../Initiative/DeleteDecisionAlert";

export const AdminEditUserDataIds = {
  modal: "editUserModal",
  closeModalButton: "editUserModalCloseModalButton",
  email: "editUserEmail",
  password: "editUserPassword",
  initiativeIds: "editUserInitiativeIds",
  name: "editUserName",
  phone: "editUserPhone",
  addButton: "editUserAddButton",
  editButton: "editUserEditButton",
  saveChangesButton: "editUserSaveChangesButton",
  cancelChangesButton: "editUserCancelChangesButton",
  deleteButton: "editUserDeleteButton",
  keywordFilter: "userDataKeywordFilter"
}

interface AdminEditUserDataProps {
  isOpen: boolean
  companies: Company[]
  users: User[]
  setIsOpen: (value: boolean) => void
}

export default function AdminEditUserDataModal(props: AdminEditUserDataProps){
  const dispatch = useAppDispatch();
  const [usersList, setUsersList] = useState<User[]>(props.users);
  const [userToEdit, setUserToEdit] = useState<User>();
  const [isNew, setIsNew] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentInitiatives, setCurrentInitiatives] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState<string>();
  const [currentPhone, setCurrentPhone] = useState<string>();
  const InEditMode = () => userToEdit !== undefined;
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    setUsersList(props.users)
    LeaveEditMode();
  },[props.isOpen])

  function EnterEditMode(id: string, users: User[]) { 
    let currentUser = users.find(u => u.id === id);
    if(currentUser)
    {
      setUserToEdit(currentUser);
      setCurrentEmail(currentUser.email);
      setCurrentPassword(currentUser.password);
      setCurrentInitiatives(currentUser.initiativeIds);
      setCurrentName(currentUser.name);
      setCurrentPhone(currentUser.phoneNumber);
    }
  }

  function LeaveEditMode() {        
    setUserToEdit(undefined);
    setIsNew(false);
  }

  function CancelEdit() {
    if(isNew && userToEdit)
    {
      let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
      usersClone = usersClone.filter(user => user.id !== userToEdit.id);

      setUsersList(usersClone);
    }
    LeaveEditMode()
  };

  function EditUser(id: string, newEmail: string, newPassword: string, newInitiatives: string[], newName: string | undefined, newPhone: string | undefined) {
    let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
    let newUser = usersClone.find(u => u.id === id);
    if(newUser) {
      newUser.email = newEmail;
      newUser.password = newPassword;
      newUser.initiativeIds = newInitiatives;
      newUser.name = newName;
      newUser.phoneNumber = newPhone;
      let successfulSubmit = SubmitUserData(newUser);
      if(successfulSubmit) setUsersList(usersClone);
    }
  }

  function SubmitUserData(user: User): boolean {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    let validation = ValidateUser(user,usersList);
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

  function AddEmptyUser() {
    let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
    let myUuid = UuidV4();
    let newUser: User = {id: myUuid, email: "", password: "", companyId: IntegrityId, initiativeIds: [], isAdmin: false}
    usersClone.unshift(newUser);
    setUsersList(usersClone);
    setSearchedKeyword("");
    setIsNew(true);
    EnterEditMode(myUuid,usersClone);
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

  function DeleteUser(userId: string)
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    dispatch(deleteUserInfo({isTest: isTest, userId}));
    setUserToEdit(userToEdit);
    setIsDeleteOpen(false);
    LeaveEditMode();
  }
 
  function CancelDelete()
  {
    setIsDeleteOpen(false);
    LeaveEditMode();
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
              <button disabled={InEditMode()} id={AdminEditUserDataIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyUser()}>Add User</button>
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
              let isEdit = (displayItem.id === (userToEdit?.id ?? -1));
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
                              {/*props.company.initiatives.map((initiative, index) => {
                                return (
                                  <FormControlLabel key={index} control={<Checkbox checked={currentInitiatives.find(id => initiative.id === id) !== undefined} onChange={(e) => UpdateCurrentInitiatives(e.target.checked, initiative.id)} />} label={initiative.title} />
                                );
                              })*/}
                            </FormGroup>
                          </>
                        :
                          <>
                            <label className={labelStyle} htmlFor={AdminEditUserDataIds.email}></label>
                            <StyledTextField id={AdminEditUserDataIds.email} label="Email" disabled value={displayItem.email} />
                            <label className={labelStyle} htmlFor={AdminEditUserDataIds.password}></label>
                            <StyledTextField id={AdminEditUserDataIds.password} label="Password" disabled value={displayItem.password} />
                            <StyledTextField id={AdminEditUserDataIds.name} label="Name" disabled value={displayItem.name} />
                            <StyledTextField id={AdminEditUserDataIds.phone} label="Phone Number" disabled value={displayItem.phoneNumber} />
                            <FormGroup>
                              {/*props.company.initiatives.map((init, index) => {
                                let checkedInitId = (displayItem.initiativeIds.find(id => id === init.id));
                                let checkedInit = props.company.initiatives.find(x => x.id === checkedInitId);

                                return (
                                  <FormControlLabel key={index} control={<Checkbox checked={checkedInit !== undefined} />} label={init?.title} />
                                );
                              })*/}
                            </FormGroup>
                          </>
                        }
                      </StyledCardContent>
                      <StyledCardActions>
                        {isEdit &&
                          <div className="flex w-full justify-between">
                            <button id={AdminEditUserDataIds.saveChangesButton} className={submitButtonStyle} onClick={() => EditUser(displayItem.id, currentEmail, currentPassword, currentInitiatives, currentName, currentPhone)}>Save</button>
                            <button id={AdminEditUserDataIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => CancelEdit()}>Cancel</button>
                          </div>
                        }
                        {!isEdit && !InEditMode() &&
                          <div className="flex w-full justify-between">
                            <button id={AdminEditUserDataIds.editButton} className={submitButtonStyle} onClick={() => EnterEditMode(displayItem.id, usersList)}>Edit</button>
                            {/*<button id={AdminEditUserDataIds.deleteButton} className={cancelButtonStyle} onClick={() => AttemptDelete(displayItem.id)}>Delete</button>
                          */}</div>
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
      <DeleteDecisionAlert isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} DeleteDecision={DeleteUser} CancelDelete={CancelDelete} decisionId={userToEdit?.id} />
    </>
  );
}
