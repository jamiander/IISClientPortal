import { useState } from "react";
import { useAppDispatch } from "../Store/Hooks";
import { User, upsertUserInfo } from "../Store/UserSlice";
import { ValidateUser, ValidationFailedPrefix } from "./Validation";
import { enqueueSnackbar } from "notistack";
import {v4 as UuidV4} from "uuid";
import { MakeClone } from "./Cloning";
import { IntegrityId } from "../Store/CompanySlice";

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
  AddEmptyUser: (companyId: string, isIntegrityUser: boolean) => void
  SaveEdit: () => void
  CancelEdit: () => void
  usersList: User[]
  userToEdit: User | undefined
  SubmitUserData: (user: User) => boolean
  currentCompanyId: string
  setCurrentCompanyId: (value: string) => void
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
  currentIsAdmin: boolean
  setCurrentIsAdmin: (value: boolean) => void
  currentIsActive: boolean
  setCurrentIsActive: (value: boolean) => void
  searchedKeyword: string
  setSearchedKeyword: (value: string) => void
}

export function useEditUser() : EditUser
{
  const [state, setState] = useState(stateEnum.start);
  const dispatch = useAppDispatch();

  const [userToEdit, setUserToEdit] = useState<User>();
  const [currentCompanyId, setCurrentCompanyId] = useState<string>("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentInitiativeIds, setterCurrentInitiatives] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState("");
  const [currentPhone, setCurrentPhone] = useState("");
  const [currentIsAdmin, setCurrentIsAdmin] = useState(false);
  const [currentIsActive, setCurrentIsActive] = useState(true);
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
    if(!InEditMode())
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
        setCurrentIsAdmin(currentUser.isAdmin ? currentUser.isAdmin : false);
        setCurrentIsActive(currentUser.isActive ? currentUser.isActive : false);
        setCurrentCompanyId(currentUser.companyId);
      }
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
      let usersClone = MakeClone(usersList);
      usersClone = usersClone.filter(user => user.id !== userToEdit.id);

      setUsersList(usersClone);
    }
    LeaveEditMode();
  }

  function SaveEdit()
  {
    let usersClone = MakeClone(usersList);
    let newUser = usersClone.find(u => u.id === userToEdit?.id);
    if(newUser)
    {
      newUser.companyId = currentCompanyId;
      newUser.email = currentEmail;
      newUser.password = currentPassword;
      newUser.initiativeIds = currentInitiativeIds;
      newUser.name = currentName;
      newUser.phoneNumber = currentPhone;
      newUser.isAdmin = currentIsAdmin;
      newUser.isActive = currentIsActive;

      let successfulSubmit = SubmitUserData(newUser);
      if(successfulSubmit)
      {
        LeaveEditMode();
        setUsersList(usersClone);
      }
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
      dispatch(upsertUserInfo({isTest: isTest, users: [user]}));
      return true;
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
    
    return false;
  }

  function AddEmptyUser(companyId: string, isIntegrityUser: boolean)
  {
    if(companyId === IntegrityId && isIntegrityUser === false) companyId = "";
    if(!InEditMode())
    {
      let usersClone = MakeClone(usersList);
      let myUuid = UuidV4();
      let newUser: User = {id: myUuid, email: "", password: "", companyId: companyId, initiativeIds: [], name: "", phoneNumber: "", isAdmin: false, isActive: true}
      usersClone.unshift(newUser);
      setUsersList(usersClone);
      setSearchedKeyword("");
      EnterEditMode(myUuid,usersClone,true);
      setCurrentCompanyId(companyId);
    }
  }

  function setCurrentInitiativeIds(initId: string, checked: boolean)
  {
    let initiativesClone = MakeClone(currentInitiativeIds);
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
    SubmitUserData,
    currentCompanyId,
    setCurrentCompanyId,
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
    currentIsActive,
    setCurrentIsActive,
    searchedKeyword,
    setSearchedKeyword
  }
}

