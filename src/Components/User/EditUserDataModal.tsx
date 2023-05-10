import Dialog from "@mui/material/Dialog"
import CloseIcon from '@mui/icons-material/Close';
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, StyledTextarea, cancelButtonStyle, labelStyle, submitButtonStyle, yellowButtonStyle } from "../../Styles";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { User, deleteUserInfo, upsertUserInfo } from "../../Store/UserSlice";
import { Company } from "../../Store/CompanySlice";
import {v4 as UuidV4} from "uuid";
import { useAppDispatch } from "../../Store/Hooks";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { ValidateUser, ValidationFailedPrefix } from "../../Services/Validation";
import { DeleteDecisionAlert } from "../Initiative/DeleteDecisionAlert";
import { useEditUser } from "../../Services/useEditUser";

export const EditUserDataIds = {
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

interface EditUserDataProps {
    title: string
    isOpen: boolean
    company: Company
    users: User[]
    setEditUserDataModalIsOpen: (value: boolean) => void
}

export default function EditUserDataModal(props: EditUserDataProps){
  
  const {
    SetupEditUser,
    EnterEditMode,
    InEditMode,
    LeaveEditMode,
    AddEmptyUser,
    SaveEdit,
    CancelEdit,
    usersList,
    userToEdit,
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
    searchedKeyword,
    setSearchedKeyword
  } = useEditUser();
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    SetupEditUser(props.users)
  },[props.isOpen])

  /*function AttemptDelete(userId: string)
  {
    /* if(modalState === State.start)
    { */
      /*setIsDeleteOpen(true);
      setUserToEdit(usersList.find(u => u.id === userId));
      /* setModalState(State.delete); */
    /* }
    else
      enqueueSnackbar("Cannot delete with unsaved changes.", {variant: "error"}); */
  /*}

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
  }*/

  return (
    <>
      <Dialog
        id={EditUserDataIds.modal}
        open={props.isOpen}
        onClose={() => props.setEditUserDataModalIsOpen(false)}
        fullWidth
        maxWidth={false}
      >
        <div className="flex col-span-4 bg-[#2ed7c3] rounded-md py-6 px-5">
          <div className="w-full flex justify-between">
            <div className="space-y-2 w-1/2">
              <p className="text-5xl font-bold w-full">{props.company.name}</p>
              <p className="text-3xl w-full">Users</p>
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex justify-end">
                <button id={EditUserDataIds.closeModalButton} className="rounded-md transition ease-in-out hover:bg-[#29c2b0] w-fit" onClick={() => props.setEditUserDataModalIsOpen(false)}>
                  <CloseIcon sx={{ fontSize: 40 }} />
                </button>
              </div>
              <button disabled={InEditMode()} id={EditUserDataIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyUser(props.company.id)}>Add User</button>
            </div>
          </div>
        </div>
        <div className="mx-[2%] mb-[2%]">
          {usersList.length !== 0 &&
            <div className="mt-2 mb-4">
              <StyledTextField className="w-1/2" id={EditUserDataIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name or email" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)} />
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
                            <StyledTextField id={EditUserDataIds.name} label="Name" value={currentName} onChange={e => setCurrentName(e.target.value)} />
                            <StyledTextField id={EditUserDataIds.email} label="Email" value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} />
                            <StyledTextField id={EditUserDataIds.password} label="Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            <StyledTextField id={EditUserDataIds.phone} label="Phone Number" value={currentPhone} onChange={e => setCurrentPhone(e.target.value)} />
                            <FormGroup>
                              {props.company.initiatives.map((initiative, index) => {
                                return (
                                  <FormControlLabel key={index} control={<Checkbox checked={currentInitiativeIds.find(id => initiative.id === id) !== undefined} onChange={(e) => setCurrentInitiativeIds(initiative.id,e.target.checked)} />} label={initiative.title} />
                                );
                              })}
                            </FormGroup>
                          </>
                        :
                          <>
                            <StyledTextField id={EditUserDataIds.name} label="Name" disabled value={displayItem.name ? displayItem.name : ""} />
                            <StyledTextField id={EditUserDataIds.email} label="Email" disabled value={displayItem.email} />
                            <StyledTextField id={EditUserDataIds.password} label="Password" disabled value={displayItem.password} />
                            <StyledTextField id={EditUserDataIds.phone} label="Phone Number" disabled value={displayItem.phoneNumber ? displayItem.phoneNumber : ""} />
                            <FormGroup>
                              {props.company.initiatives.map((init, index) => {
                                let checkedInitId = (displayItem.initiativeIds.find(id => id === init.id));
                                let checkedInit = props.company.initiatives.find(x => x.id === checkedInitId);

                                return (
                                  <FormControlLabel key={index} control={<Checkbox checked={checkedInit !== undefined} />} label={init?.title} />
                                );
                              })}
                            </FormGroup>
                          </>
                        }
                      </StyledCardContent>
                      <StyledCardActions>
                        {isEdit &&
                          <div className="flex w-full justify-between">
                            <button id={EditUserDataIds.saveChangesButton} className={submitButtonStyle} onClick={() => SaveEdit()}>Save</button>
                            <button id={EditUserDataIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => CancelEdit()}>Cancel</button>
                          </div>
                        }
                        {!isEdit && !InEditMode() &&
                          <div className="flex w-full justify-between">
                            <button id={EditUserDataIds.editButton} className={submitButtonStyle} onClick={() => EnterEditMode(displayItem.id, usersList, false)}>Edit</button>
                            {/*<button id={EditUserDataIds.deleteButton} className={cancelButtonStyle} onClick={() => AttemptDelete(displayItem.id)}>Delete</button>
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
      {/*
      <DeleteDecisionAlert isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} DeleteDecision={DeleteUser} CancelDelete={CancelDelete} decisionId={userToEdit?.id} />
          */}
    </>
  );
}

