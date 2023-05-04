import Dialog from "@mui/material/Dialog"
import CloseIcon from '@mui/icons-material/Close';
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, StyledTextarea, cancelButtonStyle, labelStyle, submitButtonStyle, yellowButtonStyle } from "../../Styles";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { User, upsertUserInfo } from "../../Store/UserSlice";
import Button from "@mui/material/Button";
import { Company } from "../../Store/CompanySlice";
import {v4 as UuidV4} from "uuid";
import { AsyncThunkAction, Dispatch, AnyAction } from "@reduxjs/toolkit";
import { UpsertUserInfoRequest } from "../../Services/UserService";
import { useAppDispatch } from "../../Store/Hooks";

export const EditUserDataIds = {
    modal: "editUserModal",
    closeModalButton: "editUserModalCloseModalButton",
    email: "email",
    password: "password",
    initiativeIds: "initiativeIds",
    addButton: "addButton",
    editButton: "editButton",
    saveChangesButton: "saveChangesButton",
    cancelChangesButton: "cancelChangesButton"
}

interface EditUserDataProps {
    title: string
    isOpen: boolean
    company: Company
    users: User[]
    setEditUserDataModalIsOpen: (value: boolean) => void
}

export function EditUserDataModal(props: EditUserDataProps){
    const dispatch = useAppDispatch();
    const [selectedUser, setSelectedUser] = useState<User>();
    const [userToEdit, setUserToEdit] = useState<User>();
    const [isNew, setIsNew] = useState(false);
    const [currentEmail, setCurrentEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentInitiatives, setCurrentInitiatives] = useState("");
    const InEditMode = () => userToEdit !== undefined;

    function EnterEditMode(id: string) { 
        let currentUser = props.users.find(u => u.id === id);
        if(currentUser)
        {
            setCurrentEmail(currentUser.email);
            setCurrentPassword(currentUser.password);
            setCurrentInitiatives(currentUser.initiativeIds.join(", "));
        }
    }

    function LeaveEditMode() {        
        setUserToEdit(undefined);
        setIsNew(false);
    }

    function CancelEdit() {LeaveEditMode()};

    function EditUser(newEmail: string, newPassword: string, newInitiatives: string[]) {
        let userClone: User = JSON.parse(JSON.stringify(selectedUser));
        userClone.email = newEmail;
        userClone.password = newPassword;
        userClone.initiativeIds = newInitiatives;

        let successfulSubmit = SubmitUserData(userClone)
        if(successfulSubmit) setSelectedUser(userClone);
    }

    function SubmitUserData(user: User): boolean {
        dispatch(upsertUserInfo({user}))
        LeaveEditMode();
        return true;
    }

    function AddEmptyUser() {
        let myUuid = UuidV4();
        let newUser: User = {id: myUuid, email: "", password: "", companyId: props.company.id, initiativeIds: []}
        props.users.unshift(newUser);
        setIsNew(true);
        EnterEditMode(myUuid);
    }

    return (
        <Dialog
        id={EditUserDataIds.modal}
        open={props.isOpen}
        onClose={()=>props.setEditUserDataModalIsOpen(false)}
        fullScreen
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
                            <CloseIcon sx={{fontSize: 40}}/>
                        </button>
                        </div>
                     <button disabled={InEditMode()} id={EditUserDataIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyUser()}>Add User</button>
                  </div>
                </div>
            </div>
            <div className="mx-[2%] mb-[2%]">

            <Grid container spacing={6}>
              {
                props.users.map((displayItem, key) => {
                let isEdit = (displayItem.id === (userToEdit?.id ?? -1));
                return(
                  <Grid item md={4} key={key}>
                    <Item>
                      <StyledCard>
                        <StyledCardContent>
                          {isEdit ?
                          <>
                            <label className={labelStyle} htmlFor={EditUserDataIds.email}>User Email</label>
                            <StyledTextarea id={EditUserDataIds.email} value={currentEmail} onChange={e => setCurrentEmail(e.target.value)}/>
                            <label className={labelStyle} htmlFor={EditUserDataIds.password}>User Password</label>
                            <StyledTextarea id={EditUserDataIds.password} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/>
                            <StyledTextField id={EditUserDataIds.initiativeIds} label="Initiatives" disabled value={displayItem.initiativeIds.join(", ")}/>
                          </>
                          : 
                          <>
                             <label className={labelStyle} htmlFor={EditUserDataIds.email}>User Email</label>
                            <StyledTextarea id={EditUserDataIds.email} disabled value={displayItem.email}/>
                             <label className={labelStyle} htmlFor={EditUserDataIds.password}>User Password</label>
                            <StyledTextarea id={EditUserDataIds.password} disabled value={displayItem.password}/>
                            <StyledTextField id={EditUserDataIds.initiativeIds} label="Initiatives" disabled value={displayItem.initiativeIds.join(", ")}/>
                          </>
                          }
                        </StyledCardContent>
                        <StyledCardActions>
                          {isEdit &&
                            <div className="flex w-full justify-between">
                              <Button id={EditUserDataIds.saveChangesButton} className={submitButtonStyle} onClick={() => EditUser(currentEmail, currentPassword, currentInitiatives.split(",").map(s => s.trim()))}>Save</Button>
                              <Button id={EditUserDataIds.cancelChangesButton} className={cancelButtonStyle} onClick={() => CancelEdit()}>Cancel</Button>
                            </div>
                          }
                          {
                            !isEdit && !InEditMode() &&
                            <div className="flex w-full justify-between">
                              <button id={EditUserDataIds.editButton} className={submitButtonStyle} onClick={() => EnterEditMode(displayItem.id)}>Edit</button>
{/*                               <button id={EditUserDataIds.deleteButton} className={cancelButtonStyle} onClick={() => AttemptDelete(displayItem.id)}>Delete</button>
 */}                            </div>
                          }
                        </StyledCardActions>
                      </StyledCard>
                    </Item>
                  </Grid>
                )
              })
            }
            </Grid>
            </div>
        </Dialog>
    );
}

