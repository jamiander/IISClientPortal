import { StyledTextField, TableHeaderStyle, UserTextField, defaultRowStyle, yellowButtonStyle } from "../Styles";
import { useEffect, useRef, useState } from "react";
import { User, getUserById, selectAllUsers, selectCurrentUser } from "../Store/UserSlice";
import { Company, IntegrityId, selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Checkbox, FormControl, IconButton, Input, InputLabel, MenuItem, Select} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEditUser } from "../Services/useEditUser";
import { EditUserInitiativesButton } from "../Components/User/EditUserInitiativesButton";
import { RadioSet } from "../Components/RadioSet";
import { UserFilter } from "../Services/Filters";

export const UsersPageIds = {
  company: "usersPageCompany",
  email: "usersPageEmail",
  password: "usersPagePassword",
  initiativeIds: "usersPageInitiativeIds",
  name: "usersPageName",
  phone: "usersPagePhone",
  isAdmin: "usersPageIsAdmin",
  isActive: "usersPageIsActive",
  addButton: "usersPageAddButton",
  editButton: "usersPageEditButton",
  saveChangesButton: "usersPageSaveChangesButton",
  cancelChangesButton: "usersPageCancelChangesButton",
  deleteButton: "usersPageDeleteButton",
  keywordFilter: "usersPageKeywordFilter",
  table: "usersPageTable",
  selectCompany: "usersPageSelectCompany",
  radioIds: {
    active: "userPageRadioActive",
    inactive: "userPageRadioInactive",
    all: "userPageRadioAll"
  }
}

export default function UsersPage(){
  const allCompanies = useAppSelector(selectAllCompanies);
  const allUsers = useAppSelector(selectAllUsers);
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [radioValue,setRadioValue] = useState("active");
  const [displayCompanies, setDisplayCompanies] = useState<Company[]>([]);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const {
    SetupEditUser,
    EnterEditMode,
    InEditMode,
    AddEmptyUser,
    SaveEdit,
    CancelEdit,
    userToEdit,
    usersList,
    SubmitUserData,
    currentCompanyId,
    setCurrentCompanyId,
    currentEmail,
    setCurrentEmail,
    currentPassword,
    setCurrentPassword,
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
  } = useEditUser();

  useEffect(() => 
  {
    SetupEditUser(allUsers);
  }, [allUsers])

  useEffect(() =>
  {
    let sortedCompanies: Company[] = JSON.parse(JSON.stringify(allCompanies));
    sortedCompanies.sort((a: Company, b: Company) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    setDisplayCompanies(sortedCompanies.filter((company: { id: string; }) => company.id !== IntegrityId));
  },[allCompanies]); 
  
  let currentUserCompanyId = currentUser?.companyId ?? "";

  useEffect(() =>
  {
    if(currentUser?.isAdmin)
    {
      if(currentUser.companyId === IntegrityId)
        dispatch(getUserById({}));
      else
        dispatch(getUserById({ companyId: currentUser.companyId }))
    }
  }, []);

  useEffect(() => 
  {
    const filteredUsers = UserFilter(allUsers, radioValue);
    setCurrentCompanyId(currentUserCompanyId);
    setCompanyUsers(filteredUsers);
    SetupEditUser(filteredUsers);
    
  }, [allUsers, radioValue])

  const myRef = useRef<HTMLElement>(null);

  return (
      <><div className="flex col-span-4 bg-[#69D5C3] py-6 px-5">
      <div className="w-full flex justify-between">
        <div className="space-y-2 w-1/2">
          <p className="text-5xl text-[#21345b] font-bold w-full">User Management</p>
        </div>
      </div>
    </div>
    <div className="mx-[2%] mb-[2%]">
        <div className="flex flex-col justify-between mt-5">
          <div className="space-x-2 flex flex-wrap">
            {companyUsers.length !== 0 &&
              currentUserCompanyId !== IntegrityId &&
              <><div className="flex flex-col justify-between mt-5">
                <button disabled={InEditMode()} id={UsersPageIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyUser(currentUserCompanyId)}>Add User</button>
              </div></>}
              {companyUsers.length !== 0 &&
                currentUserCompanyId === IntegrityId &&
                <><div className="flex flex-col justify-between mt-5">
                  <button disabled={InEditMode()} id={UsersPageIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyUser("")}>Add User</button>
                </div></>}
              <RadioSet dark={true} setter={setRadioValue} name="clientPage" options={[
                { id: UsersPageIds.radioIds.all, label: "Show All", value: "all" },
                { id: UsersPageIds.radioIds.active, label: "Only Active", value: "active", default: true },
                { id: UsersPageIds.radioIds.inactive, label: "Only Inactive", value: "inactive" }
              ]} />
              <div className="flex flex-col justify-between mt-5">
                <IconButton onClick={() => setSearchBarOpen(!searchBarOpen)}>
                  <SearchIcon />
                </IconButton>
              </div>
              {searchBarOpen === true &&
                <UserTextField id={UsersPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name or email" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)} />
              }
              </div>
            </div>
            <div className="col-span-1 py-[2%]">
              <TableContainer elevation={10} component={Paper}>
                <Table className="table-auto w-full outline outline-3 bg-gray-100">
                  <colgroup>
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '6%' }} />
                    <col style={{ width: '7%' }} />
                  </colgroup>
                  <TableHead className="outline outline-1">
                    <TableRow sx={{
                      borderBottom: "2px solid black",
                      "& th": {
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        fontFamily: "Arial, Helvetica"
                      }
                    }}>
                      <TableHeaderStyle>Company</TableHeaderStyle>
                      <TableHeaderStyle>Name</TableHeaderStyle>
                      <TableHeaderStyle>Email</TableHeaderStyle>
                      <TableHeaderStyle>Password</TableHeaderStyle>
                      <TableHeaderStyle>Phone</TableHeaderStyle>
                      <TableHeaderStyle>Admin Status</TableHeaderStyle>
                      <TableHeaderStyle>Active Status</TableHeaderStyle>
                      <TableHeaderStyle>Assigned Initiatives</TableHeaderStyle>
                      <TableHeaderStyle>Edit User</TableHeaderStyle>
                    </TableRow>
                  </TableHead>
                  <TableBody id={UsersPageIds.table}>
                    {displayCompanies.map((displayCompany, key) => {
                      let newUser = usersList.find(u => u.companyId === "");
                      let companyUserList = usersList.filter(cu => cu.companyId === displayCompany.id)!.filter(u => u.email.toUpperCase().includes(searchedKeyword.toUpperCase()) || u.name?.toUpperCase().includes(searchedKeyword.toUpperCase()));
                      if (key === 0 && newUser != undefined)
                        companyUserList.unshift(newUser);
                      return (
                        companyUserList.map((companyUser, key) => {
                          let isEdit = InEditMode() && companyUser?.id === userToEdit?.id;
                          return (
                            <TableRow className={defaultRowStyle} key={key} sx={{
                              borderBottom: "1px solid black",
                              "& td": {
                                fontSize: "1.1rem",
                                fontFamily: "Arial, Helvetica",
                                color: "#21345b"
                              }
                            }}>
                              {isEdit ?
                                <>
                                  <TableCell id={UsersPageIds.company}>
                                    {currentUserCompanyId === IntegrityId ?
                                      <FormControl fullWidth>
                                        <InputLabel id="company-select-label">Select Company</InputLabel>
                                        <Select id={UsersPageIds.selectCompany} labelId="company-select-label" label="Select company" value={currentCompanyId} onChange={(e) => setCurrentCompanyId(e.target.value)}>
                                          {displayCompanies.map((company, index) => {
                                            return (
                                              <MenuItem key={index} value={company.id}>
                                                {company.name}
                                              </MenuItem>
                                            );
                                          })}
                                        </Select>
                                      </FormControl>
                                      :
                                      <TableCell id={UsersPageIds.company}>{displayCompany.name}</TableCell>}
                                  </TableCell>
                                  <TableCell id={UsersPageIds.name}> <Input value={currentName} onChange={e => setCurrentName(e.target.value)} /></TableCell>
                                  <TableCell><Input id={UsersPageIds.email} value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} /></TableCell>
                                  <TableCell id={UsersPageIds.password}><Input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></TableCell>
                                  <TableCell id={UsersPageIds.phone}><Input value={currentPhone} onChange={e => setCurrentPhone(e.target.value)} /></TableCell>
                                  <TableCell id={UsersPageIds.isAdmin}><Checkbox checked={currentIsAdmin} onChange={e => setCurrentIsAdmin(e.target.checked)} />Admin</TableCell>
                                  <TableCell id={UsersPageIds.isActive}><Checkbox checked={currentIsActive} onChange={e => setCurrentIsActive(e.target.checked)} />Active</TableCell>
                                  <TableCell id={UsersPageIds.initiativeIds}></TableCell>
                                  <TableCell ref={myRef}>
                                    <IconButton id={UsersPageIds.saveChangesButton} onClick={() => SaveEdit()}>
                                      <DoneIcon />
                                    </IconButton>
                                    <IconButton id={UsersPageIds.cancelChangesButton} onClick={() => CancelEdit()}>
                                      <CancelIcon />
                                    </IconButton>
                                  </TableCell>
                                </>
                                :
                                <>
                                  <TableCell id={UsersPageIds.company}>{displayCompany.name}</TableCell>
                                  <TableCell id={UsersPageIds.name}>{companyUser?.name}</TableCell>
                                  <TableCell id={UsersPageIds.email}>{companyUser?.email}</TableCell>
                                  <TableCell id={UsersPageIds.password}>{companyUser?.password}</TableCell>
                                  <TableCell id={UsersPageIds.phone}>{companyUser?.phoneNumber}</TableCell>
                                  <TableCell id={UsersPageIds.isAdmin}>{companyUser?.isAdmin ? "Admin" : "User"}</TableCell>
                                  <TableCell id={UsersPageIds.isActive}>{companyUser?.isActive ? "Active" : "Inactive"}</TableCell>
                                  <TableCell id={UsersPageIds.initiativeIds}><EditUserInitiativesButton user={companyUser} allCompanies={[displayCompany]} SubmitUserData={SubmitUserData} expanded={true} /></TableCell>
                                  <TableCell>
                                    <IconButton id={UsersPageIds.editButton} disabled={InEditMode()} onClick={() => EnterEditMode(companyUser?.id, companyUsers, false)}>
                                      <EditIcon />
                                    </IconButton>
                                  </TableCell>
                                </>}
                            </TableRow>
                          );
                        })
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
    </>
  )
}
