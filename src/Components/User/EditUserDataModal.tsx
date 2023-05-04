import Dialog from "@mui/material/Dialog"
import CloseIcon from '@mui/icons-material/Close';
import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledTextField, StyledTextarea, cancelButtonStyle, labelStyle, submitButtonStyle, yellowButtonStyle } from "../../Styles";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { User, upsertUserInfo } from "../../Store/UserSlice";
import Button from "@mui/material/Button";
import { Company } from "../../Store/CompanySlice";
import {v4 as UuidV4} from "uuid";
import { useAppDispatch } from "../../Store/Hooks";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

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

export default function EditUserDataModal(props: EditUserDataProps){
    const dispatch = useAppDispatch();
    const [usersList, setUsersList] = useState<User[]>(props.users);
    const [userToEdit, setUserToEdit] = useState<User>();
    const [isNew, setIsNew] = useState(false);
    const [currentEmail, setCurrentEmail] =useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentInitiatives, setCurrentInitiatives] = useState<string[]>([]);
    const InEditMode = () => userToEdit !== undefined;

    useEffect(() => {
        setUsersList(props.users)
        LeaveEditMode();
    },[props.isOpen])

    function EnterEditMode(id: string) { 
        let currentUser = usersList.find(u => u.id === id);
        if(currentUser)
        {
            setUserToEdit(currentUser);
            setCurrentEmail(currentUser.email);
            setCurrentPassword(currentUser.password);
            setCurrentInitiatives(currentUser.initiativeIds);
        }
    }

    function LeaveEditMode() {        
        setUserToEdit(undefined);
        setIsNew(false);
    }

    function CancelEdit() {LeaveEditMode()};

    function EditUser(id: string, newEmail: string, newPassword: string, newInitiatives: string[]) {
        let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
        let newUser = usersClone.find(u => u.id === id);
        if(newUser) {
            newUser.email = newEmail;
            newUser.password = newPassword;
            newUser.initiativeIds = newInitiatives;

            let successfulSubmit = SubmitUserData(newUser);
            if(successfulSubmit) setUsersList(usersClone);
        }
    }

    function SubmitUserData(user: User): boolean {
        let isTest = false;
        dispatch(upsertUserInfo({isTest: isTest, user: user}))
        LeaveEditMode();
        return true;
    }

    function AddEmptyUser() {
        let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
        let myUuid = UuidV4();
        let newUser: User = {id: myUuid, email: "", password: "", companyId: props.company.id, initiativeIds: []}
        usersClone.unshift(newUser);
        setUsersList(usersClone);
        setIsNew(true);
        EnterEditMode(myUuid);
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
                usersList.map((displayItem, key) => {
                let isEdit = (displayItem.id === (userToEdit?.id ?? -1));
                return(
                  <Grid item md={4} key={key}>
                    <Item>
                      <StyledCard>
                        <StyledCardContent>
                          {isEdit ?
                          <>
                            <label className={labelStyle} htmlFor={EditUserDataIds.email}>User Email</label>
                            <StyledTextField id={EditUserDataIds.email} value={currentEmail} onChange={e => setCurrentEmail(e.target.value)}/>
                            <label className={labelStyle} htmlFor={EditUserDataIds.password}>User Password</label>
                            <StyledTextField id={EditUserDataIds.password} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/>
                            <FormGroup>
                            {
                              props.company.initiatives.map((initiative,index) => {
                                return (
                                  <FormControlLabel key={index} control={<Checkbox checked={currentInitiatives.find(id => initiative.id === id) !== undefined} onChange={(e) => UpdateCurrentInitiatives(e.target.checked,initiative.id)}/>} label={initiative.title} />
                                )
                              })
                            }
                            </FormGroup>
                          </>
                          : 
                          <>
                            <label className={labelStyle} htmlFor={EditUserDataIds.email}>User Email</label>
                            <StyledTextField id={EditUserDataIds.email} disabled value={displayItem.email}/>
                            <label className={labelStyle} htmlFor={EditUserDataIds.password}>User Password</label>
                            <StyledTextField id={EditUserDataIds.password} disabled value={displayItem.password}/>
                            <StyledTextField id={EditUserDataIds.initiativeIds} label="Initiatives" disabled value={displayItem.initiativeIds.map((id) => { return props.company.initiatives.find(init => init.id === id)?.title ?? "N/A"}).join(", ")}/>
                          </>
                          }
                        </StyledCardContent>
                        <StyledCardActions>
                          {isEdit &&
                            <div className="flex w-full justify-between">
                              <Button id={EditUserDataIds.saveChangesButton} className={submitButtonStyle} onClick={() => EditUser(displayItem.id, currentEmail, currentPassword, currentInitiatives)}>Save</Button>
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

