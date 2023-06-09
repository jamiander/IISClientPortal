import { IntegrityTheme, TableHeaderStyle, UserTextField, defaultRowStyle, tableButtonFontSize, tableCellFontSize, tableHeaderFontSize } from "../Styles";
import { useEffect, useState } from "react";
import { User, getUserById, selectAllUsers, selectCurrentUser } from "../Store/UserSlice";
import { Company, IntegrityId, selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Checkbox, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, ThemeProvider} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
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
import { AddButton } from "../Components/AddButton";
import { MakeClone } from "../Services/Cloning";
import { SearchBar } from "../Components/SearchBar";
import { Paginator } from "../Components/Paginator";

export const UsersPageIds = {
  company: "usersPageCompany",
  initiativeIds: "usersPageInitiativeIds",
  email: "usersPageEmail",
  password: "usersPagePassword",
  name: "usersPageName",
  phone: "usersPagePhone",
  isAdmin: "usersPageIsAdmin",
  isActive: "usersPageIsActive",
  editEmail: "usersPageEditEmail",
  editPassword: "usersPageEditPassword",
  editName: "usersPageEditName",
  editPhone: "usersPageEditPhone",
  editIsAdmin: "usersPageEditIsAdmin",
  editIsActive: "usersPageEditIsActive",
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
    let sortedCompanies = MakeClone(allCompanies);
    sortedCompanies.sort((a: Company, b: Company) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    setDisplayCompanies(sortedCompanies.filter(company => company.id !== IntegrityId));
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

  return (
    <ThemeProvider theme={IntegrityTheme}>
      <div className="mx-[2%] mb-2">
        <div className="flex flex-row justify-content:space-between">
          <Grid container sx={{ display: 'flex',
              placeItems: 'center',
              flexDirection: 'row',
              p: 1,
              mt: 2,
              mb: 1,
              ml: 2,
              mr: 2,
              borderRadius: 1, }}> 
              <Grid item xs={3} sx={{ display: 'flex',
              justifyContent: 'flex-start',
              }}>
                <SearchBar cypressData={UsersPageIds.keywordFilter} disabled={InEditMode()} value={searchedKeyword} setValue={setSearchedKeyword} placeholder={"Keyword in Name or Email"}/>
              </Grid>
              <RadioSet dark={true} setter={setRadioValue} name="userPage" options={[
              { cypressData: UsersPageIds.radioIds.all, label: "Show All", value: "all" },
              { cypressData: UsersPageIds.radioIds.active, label: "Active", value: "active", default: true },
              { cypressData: UsersPageIds.radioIds.inactive, label: "Inactive", value: "inactive" }
            ]} />
            <Grid item xs={3} sx={{ display: 'flex',
              justifyContent: 'flex-end'
              }}> 
              <AddButton cypressData={UsersPageIds.addButton} HandleClick={() => AddEmptyUser(currentUserCompanyId, false)} disabled={InEditMode()}/>            
            </Grid>  
          </Grid>         
        </div>
        <div className="col-span-1 py-2">
          <TableContainer elevation={12} component={Paper}>
            <Table className="table-auto w-full outline outline-3 bg-gray-100">
              <colgroup>
                <col style={{ width: '13vw' }} />
                <col style={{ width: '15vw' }} />
                <col style={{ width: '15vw' }} />
                <col style={{ width: '10vw' }} />
                <col style={{ width: '8vw' }} />
                <col style={{ width: '10vw' }} />
                <col style={{ width: '6vw' }} />
                <col style={{ width: '10vw' }} />
              </colgroup>
              <TableHead className="outline outline-1">
                <TableRow sx={{
                  borderBottom: "2px solid black",
                  "& th": {
                    fontSize: tableHeaderFontSize,
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
                  <TableHeaderStyle>Initiatives</TableHeaderStyle>
                  <TableHeaderStyle>Edit User</TableHeaderStyle>
                </TableRow>
              </TableHead>
              <TableBody data-cy={UsersPageIds.table}>
                {displayCompanies.map((displayCompany, key) => {
                  let newUser = usersList.find(u => u.companyId === "");
                  let companyUserList = usersList.filter(cu => cu.companyId === displayCompany.id)!.filter(u => u.email.toUpperCase().includes(searchedKeyword.toUpperCase()) || u.name?.toUpperCase().includes(searchedKeyword.toUpperCase()));
                  if (key === 0 && newUser !== undefined)
                    companyUserList.unshift(newUser);
                  return (
                    companyUserList.map((companyUser, key) => {
                      let isEdit = InEditMode() && companyUser?.id === userToEdit?.id;
                      return (
                        <TableRow className={defaultRowStyle} key={key} sx={{
                          borderBottom: "1px solid black",
                          "& td": {
                            fontSize: tableCellFontSize,
                            fontFamily: "Arial, Helvetica",
                            color: "#21345b"
                          }
                        }}>
                          {isEdit ?
                            <>
                              <TableCell data-cy={UsersPageIds.company}>
                                {currentUserCompanyId === IntegrityId ?
                                  <FormControl fullWidth>
                                    <InputLabel id="company-select-label">Select Company</InputLabel>
                                    <Select sx={{fontSize: tableCellFontSize}} data-cy={UsersPageIds.selectCompany} labelId="company-select-label" label="Select company" value={currentCompanyId} onChange={(e) => setCurrentCompanyId(e.target.value)}>
                                      {displayCompanies.map((company, index) => {
                                        return (
                                          <MenuItem sx={{fontSize: tableCellFontSize}} key={index} value={company.id}>
                                            {company.name}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                  :
                                  <TableCell data-cy={UsersPageIds.company}>{displayCompany.name}</TableCell>}
                              </TableCell>
                              <TableCell data-cy={UsersPageIds.editName}> <Input value={currentName} onChange={e => setCurrentName(e.target.value)} /></TableCell>
                              <TableCell><Input data-cy={UsersPageIds.editEmail} value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} /></TableCell>
                              <TableCell data-cy={UsersPageIds.editPassword}><Input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></TableCell>
                              <TableCell data-cy={UsersPageIds.editPhone}><Input value={currentPhone} onChange={e => setCurrentPhone(e.target.value)} /></TableCell>
                              <TableCell><Checkbox color="darkBlue" data-cy={UsersPageIds.editIsAdmin} checked={currentIsAdmin} onChange={e => setCurrentIsAdmin(e.target.checked)} />Admin</TableCell>
                              <TableCell><Checkbox color="darkBlue" data-cy={UsersPageIds.editIsActive} checked={currentIsActive} onChange={e => setCurrentIsActive(e.target.checked)} />Active</TableCell>
                              <TableCell data-cy={UsersPageIds.initiativeIds}></TableCell>
                              <TableCell>
                                <IconButton data-cy={UsersPageIds.saveChangesButton} onClick={() => SaveEdit()}>
                                  <DoneIcon sx={{fontSize: tableButtonFontSize}}/>
                                </IconButton>
                                <IconButton data-cy={UsersPageIds.cancelChangesButton} onClick={() => CancelEdit()}>
                                  <CancelIcon sx={{fontSize: tableButtonFontSize}}/>
                                </IconButton>
                              </TableCell>
                            </>
                            :
                            <>
                              <TableCell data-cy={UsersPageIds.company}>{displayCompany.name}</TableCell>
                              <TableCell data-cy={UsersPageIds.name}>{companyUser?.name}</TableCell>
                              <TableCell data-cy={UsersPageIds.email}>{companyUser?.email}</TableCell>
                              <TableCell data-cy={UsersPageIds.password}>{companyUser?.password}</TableCell>
                              <TableCell data-cy={UsersPageIds.phone}>{companyUser?.phoneNumber}</TableCell>
                              <TableCell data-cy={UsersPageIds.isAdmin}>{companyUser?.isAdmin ? "Admin" : "User"}</TableCell>
                              <TableCell data-cy={UsersPageIds.isActive}>{companyUser?.isActive ? "Active" : "Inactive"}</TableCell>
                              <TableCell data-cy={UsersPageIds.initiativeIds}><EditUserInitiativesButton user={companyUser} allCompanies={[displayCompany]} SubmitUserData={SubmitUserData} expanded={true} /></TableCell>
                              <TableCell>
                                <IconButton data-cy={UsersPageIds.editButton} disabled={InEditMode()} onClick={() => EnterEditMode(companyUser?.id, companyUsers, false)}>
                                  <EditIcon sx={{fontSize: tableButtonFontSize}}/>
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
          <Paginator count={displayCompanies.length}/>
        </div>
      </div>
    </ThemeProvider>
  )
}
