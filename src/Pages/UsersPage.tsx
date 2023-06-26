import { IntegrityTheme, TableHeaderStyle, defaultRowStyle, tableButtonFontSize, tableCellFontSize, tableHeaderFontSize } from "../Styles";
import { useEffect, useState } from "react";
import { User, getUserById, selectAllUsers, selectCurrentUser } from "../Store/UserSlice";
import { Company, IntegrityId, selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Checkbox, FormControl, Grid, IconButton, Input, InputLabel, MenuItem, Select, ThemeProvider} from "@mui/material";
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
import { UserFilter } from "../Services/Filters";
import { AddButton } from "../Components/AddButton";
import { MakeClone } from "../Services/Cloning";
import { SearchBar } from "../Components/SearchBar";
import { Paginator } from "../Components/Paginator";
import { usePaginator } from "../Services/usePaginator";
import { ActiveRadioSet } from "../Components/ActiveRadioSet";

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

  const paginator = usePaginator();

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
    const filteredUsers = UserFilter(allUsers, radioValue).filter(u => u.companyId !== IntegrityId).filter(u => u.email.toUpperCase().includes(searchedKeyword.toUpperCase()) || u.name?.toUpperCase().includes(searchedKeyword.toUpperCase()));
    filteredUsers.sort((a: User, b: User) => {
      let nameA = a.name ?? "";
      let nameB = b.name ?? "";
      return nameA.toUpperCase() > nameB.toUpperCase() ? 1 : -1;
    })
    filteredUsers.sort((a: User, b: User) => {
      let companyA = allCompanies.find(c => c.id === a.companyId);
      let companyB = allCompanies.find(c => c.id === b.companyId);

      if(companyA && companyB)
        return companyA.name.toUpperCase() > companyB.name.toUpperCase() ? 1 : -1;
      return 0;
    });

    const paginatedUsers = paginator.PaginateItems(filteredUsers);
    setCompanyUsers(paginatedUsers);
    setCurrentCompanyId(currentUserCompanyId);
    SetupEditUser(paginatedUsers);
    
  }, [allUsers, radioValue, paginator.page, paginator.rowsPerPage, searchedKeyword]);

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
            borderRadius: 1
          }}>
            <Grid item xs={3} sx={{ display: 'flex',
              justifyContent: 'flex-start',
            }}>
              <SearchBar cypressData={UsersPageIds.keywordFilter} disabled={InEditMode()} value={searchedKeyword} setValue={setSearchedKeyword} placeholder={"Keyword in Name or Email"}/>
            </Grid>
            <ActiveRadioSet cypressData={UsersPageIds.radioIds} name="usersPage" setRadioValue={setRadioValue} listItems={allUsers} filterFunc={UserFilter}/>
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
                {
                  usersList.map((companyUser, key) => {
                      let isEdit = InEditMode() && companyUser.id === userToEdit?.id;
                      let displayCompany = allCompanies.find(c => c.id === companyUser.companyId);
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
                                  <TableCell data-cy={UsersPageIds.company}>{displayCompany?.name}</TableCell>}
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
                              <TableCell data-cy={UsersPageIds.company}>{displayCompany?.name}</TableCell>
                              <TableCell data-cy={UsersPageIds.name}>{companyUser.name}</TableCell>
                              <TableCell data-cy={UsersPageIds.email}>{companyUser.email}</TableCell>
                              <TableCell data-cy={UsersPageIds.password}>{companyUser.password}</TableCell>
                              <TableCell data-cy={UsersPageIds.phone}>{companyUser.phoneNumber}</TableCell>
                              <TableCell data-cy={UsersPageIds.isAdmin}>{companyUser.isAdmin ? "Admin" : "User"}</TableCell>
                              <TableCell data-cy={UsersPageIds.isActive}>{companyUser.isActive ? "Active" : "Inactive"}</TableCell>
                              <TableCell data-cy={UsersPageIds.initiativeIds}><EditUserInitiativesButton user={companyUser} allCompanies={displayCompany ? [displayCompany] : []} SubmitUserData={SubmitUserData} expanded={true} /></TableCell>
                              <TableCell>
                                <IconButton data-cy={UsersPageIds.editButton} disabled={InEditMode()} onClick={() => EnterEditMode(companyUser.id, companyUsers, false)}>
                                  <EditIcon sx={{fontSize: tableButtonFontSize}}/>
                                </IconButton>
                              </TableCell>
                            </>}
                        </TableRow>
                      );
                    })
                  
                }
              </TableBody>
            </Table>
          </TableContainer>
          <Paginator paginator={paginator}/>
        </div>
      </div>
    </ThemeProvider>
  )
}
