import { useState } from "react";
import { useAppDispatch } from "../Store/Hooks";
import { User, upsertUserInfo } from "../Store/UserSlice";
import { ValidateUser, ValidationFailedPrefix } from "./Validation";
import { enqueueSnackbar } from "notistack";
import {v4 as UuidV4} from "uuid";

enum stateEnum {
  start,
  add,
  edit
}

type EditUser = {
  SetupEditUser: (users: User[]) => void
  EnterEditMode: (id: string, users: User[], isNew: boolean) => void
  InEditMode: () => boolean
  LeaveEditMode: () => void
  AddEmptyUser: (companyId: string) => void
  SaveEdit: () => void
  CancelEdit: () => void
  usersList: User[]
  userToEdit: User | undefined
  currentEmail: string
  setCurrentEmail: (value: string) => void
  currentPassword: string
  setCurrentPassword: (value: string) => void
  currentInitiativeIds: string[]
  setCurrentInitiativeIds: (initId: string, checked: boolean) => void
  currentName: string
  setCurrentName: (value: string) => void
  currentPhone: string
  setCurrentPhone: (value: string) => void
  searchedKeyword: string
  setSearchedKeyword: (value: string) => void
}

export function useEditUser() : EditUser
{
  const [state, setState] = useState(stateEnum.start);
  const dispatch = useAppDispatch();

  const [userToEdit, setUserToEdit] = useState<User>();
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentInitiativeIds, setterCurrentInitiatives] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState("");
  const [currentPhone, setCurrentPhone] = useState("");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [searchedKeyword, setSearchedKeyword] = useState("");
  
  function SetupEditUser(users: User[])
  {
    setUsersList(users);
    LeaveEditMode();
  }

  const InEditMode = () => state === stateEnum.edit || state === stateEnum.add;

  function EnterEditMode(id: string, users: User[], isNew: boolean)
  { 
    let currentUser = users.find(u => u.id === id);
    if(currentUser)
    {
      setState(isNew ? stateEnum.add : stateEnum.edit);
      setUserToEdit(currentUser);
      setCurrentEmail(currentUser.email);
      setCurrentPassword(currentUser.password);
      setterCurrentInitiatives(currentUser.initiativeIds);
      setCurrentName(currentUser.name ? currentUser.name : "");
      setCurrentPhone(currentUser.phoneNumber ? currentUser.phoneNumber : "");
    }
  }

  function LeaveEditMode()
  {
    setState(stateEnum.start);      
    setUserToEdit(undefined);
  }

  function CancelEdit()
  {
    if(state === stateEnum.add && userToEdit)
    {
      let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
      usersClone = usersClone.filter(user => user.id !== userToEdit.id);

      setUsersList(usersClone);
    }
    LeaveEditMode()
  }

  function SaveEdit()
  {
    let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
    let newUser = usersClone.find(u => u.id === userToEdit?.id);
    if(newUser) {
      newUser.email = currentEmail;
      newUser.password = currentPassword;
      newUser.initiativeIds = currentInitiativeIds;
      newUser.name = currentName;
      newUser.phoneNumber = currentPhone;

      let successfulSubmit = SubmitUserData(newUser);
      if(successfulSubmit)
        setUsersList(usersClone);
    }
  }

  function SubmitUserData(user: User): boolean
  {
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

  function AddEmptyUser(companyId: string)
  {
    let usersClone: User[] = JSON.parse(JSON.stringify(usersList));
    let myUuid = UuidV4();
    let newUser: User = {id: myUuid, email: "", password: "", companyId: companyId, initiativeIds: [], name: "", phoneNumber: "", isAdmin: false}
    usersClone.unshift(newUser);
    setUsersList(usersClone);
    setSearchedKeyword("");
    EnterEditMode(myUuid,usersClone,true);
  }

  function setCurrentInitiativeIds(initId: string, checked: boolean)
  {
    let initiativesClone: string[] = JSON.parse(JSON.stringify(currentInitiativeIds));
    let matchingIdIndex = initiativesClone.findIndex(id => id === initId);
    if(matchingIdIndex > -1)
    {
      if(!checked)
        initiativesClone.splice(matchingIdIndex,1);
    }
    else
    {
      if(checked)
        initiativesClone.push(initId);
    }
    setterCurrentInitiatives(initiativesClone);
  }

  return {
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
  }
}

