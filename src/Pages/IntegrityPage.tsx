import { IntegrityTheme, TableHeaderStyle, UserTextField, defaultRowStyle, tableButtonFontSize, tableCellFontSize, tableHeaderFontSize } from "../Styles";
import { useEffect, useState } from "react";
import { User, getUserById, selectAllUsers, selectCurrentUser } from "../Store/UserSlice";
import { Company, IntegrityId, selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Box, Checkbox, Grid, IconButton, Input, InputAdornment, ThemeProvider} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEditUser } from "../Services/useEditUser";
import { EditUserInitiativesButton } from "../Components/User/EditUserInitiativesButton";
import { AddButton } from "../Components/AddButton";
import { MakeClone } from "../Services/Cloning";
import { SearchBar } from "../Components/SearchBar";
import { Paginator } from "../Components/Paginator";
import { usePaginator } from "../Components/usePaginator";

export const IntegrityPageIds = {
  modal: "adminEditUserModal",
  closeModalButton: "adminEditUserModalCloseModalButton",
  email: "adminEditUserEmail",
  password: "adminEditUserPassword",
  initiativeIds: "adminEditUserInitiativeIds",
  name: "adminEditUserName",
  phone: "adminEditUserPhone",
  isAdmin: "adminEditIsAdmin",
  isActive: "adminEditUserIsActive",
  editEmail: "adminEditUserEditEmail",
  editPassword: "adminEditUserEditPassword",
  editName: "adminEditUserEditName",
  editPhone: "adminEditUserEditPhone",
  editIsAdmin: "adminEditUserEditIsAdmin",
  editIsActive: "adminEditUserEditIsActive",
  addButton: "adminEditUserAddButton",
  editButton: "adminEditUserEditButton",
  saveChangesButton: "adminEditUserSaveChangesButton",
  cancelChangesButton: "adminEditUserCancelChangesButton",
  deleteButton: "adminEditUserDeleteButton",
  keywordFilter: "adminEditUserKeywordFilter",
  table: "adminEditUserTable"
}

export function IntegrityPage(){
  const allCompanies = useAppSelector(selectAllCompanies);
  const allUsers = useAppSelector(selectAllUsers);
  const [sortedCompanies, setSortedCompanies] = useState<Company[]>([]);
  const [integrityUsers, setIntegrityUsers] = useState<User[]>([]);
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
    if(currentUser?.isAdmin && currentUser.companyId === IntegrityId)
      dispatch(getUserById({}));
  }, []);

  useEffect(() => 
  {
    const filteredUsers = allUsers.filter(user => user.companyId === IntegrityId);
    filteredUsers.sort((a: User, b: User) => a.email.toUpperCase() > b.email.toUpperCase() ? 1 : -1);
    const paginatedUsers = paginator.PaginateItems(filteredUsers);
    setIntegrityUsers(paginatedUsers);
    SetupEditUser(paginatedUsers);
    
  }, [allUsers,paginator.page,paginator.rowsPerPage]);

  useEffect(() => {
    let newSortedCompanies = MakeClone(allCompanies);
    newSortedCompanies.sort((a: Company, b: Company) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    setSortedCompanies(newSortedCompanies);
  }, [allCompanies]);

  let admins = integrityUsers.filter(u => u.isAdmin === true);

  return (
    <ThemeProvider theme={IntegrityTheme}>
      <div className="mx-[2%] mb-2">
        {allUsers.length !== 0 &&
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
              <Grid item xs={6}
                sx={{ display: 'flex',
                justifyContent: 'flex-start'
                }}> 
                <SearchBar cypressData={IntegrityPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in Name or Email" value={searchedKeyword} setValue={setSearchedKeyword}/>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex',
                justifyContent: 'flex-end',
                }}> 
                <AddButton cypressData={IntegrityPageIds.addButton} HandleClick={() => AddEmptyUser(IntegrityId, true)} disabled={InEditMode()}/> 
              </Grid>
            </Grid>
          </div> 
        }
        <div className="col-span-1 py-2">
          <TableContainer elevation={12} component={Paper}>
            <Table className="table-auto w-full outline outline-3 bg-gray-100">
            <colgroup>
                <col style={{ width: '17vw' }} />
                <col style={{ width: '17vw' }} />
                <col style={{ width: '17vw' }} />
                <col style={{ width: '10vw' }} />
                <col style={{ width: '8vw' }} />
                <col style={{ width: '8vw' }} />
                <col style={{ width: '7vw' }} />
                <col style={{ width: '7vw' }} />
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
              <TableBody data-cy={IntegrityPageIds.table}>
                {usersList.filter(u => u.email.toUpperCase().includes(searchedKeyword.toUpperCase()) || u.name?.toUpperCase().includes(searchedKeyword.toUpperCase()))
                  .map((displayItem: User, key: number) => {
                  let isEdit = InEditMode() && displayItem.id === userToEdit?.id;
                  return (
                    <TableRow className={defaultRowStyle} sx={{
                      borderBottom: "1px solid black",
                      "& td": {
                        fontSize: tableCellFontSize,
                        fontFamily: "Arial, Helvetica",
                        color: "#21345b"
                      }
                    }}
                      key={key}
                    >
                      {isEdit ? 
                      <>
                        <TableCell><Input sx={{fontSize: "calc(12px + 0.390625vw)"}} data-cy={IntegrityPageIds.editName}value={currentName} onChange={e => setCurrentName(e.target.value)}/></TableCell>
                        <TableCell><Input sx={{fontSize: "calc(12px + 0.390625vw)"}} data-cy={IntegrityPageIds.editEmail} value={currentEmail} onChange={e => setCurrentEmail(e.target.value)}/></TableCell>
                        <TableCell><Input sx={{fontSize: "calc(12px + 0.390625vw)"}} data-cy={IntegrityPageIds.editPassword} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/></TableCell>
                        <TableCell><Input sx={{fontSize: "calc(12px + 0.390625vw)"}} data-cy={IntegrityPageIds.editPhone} value={currentPhone} onChange={e => setCurrentPhone(e.target.value)}/></TableCell>
                        {(displayItem.isAdmin != true || admins.length > 1) ?
                        <TableCell>
                          <Checkbox data-cy={IntegrityPageIds.editIsAdmin} checked={currentIsAdmin} onChange={e => setCurrentIsAdmin(e.target.checked)}/>Admin
                        </TableCell>
                        :
                        <TableCell data-cy={IntegrityPageIds.isAdmin}>{displayItem.isAdmin ? "Admin" : "User"}</TableCell>
                        }
                        <TableCell><Checkbox color="darkBlue" data-cy={IntegrityPageIds.editIsActive} checked={currentIsActive} onChange={e => setCurrentIsActive(e.target.checked)}/>Active</TableCell>
                        <TableCell data-cy={IntegrityPageIds.initiativeIds}></TableCell>
                        <TableCell>
                          <IconButton data-cy={IntegrityPageIds.saveChangesButton} onClick={() => SaveEdit()}>
                            <DoneIcon sx={{fontSize: tableButtonFontSize}}/>
                          </IconButton>
                          <IconButton data-cy={IntegrityPageIds.cancelChangesButton} onClick={() => CancelEdit()}>
                            <CancelIcon sx={{fontSize: tableButtonFontSize}}/>
                          </IconButton>
                        </TableCell>
                      </>
                      : 
                      <>
                        <TableCell data-cy={IntegrityPageIds.name}>{displayItem.name}</TableCell>
                        <TableCell data-cy={IntegrityPageIds.email}>{displayItem.email}</TableCell>
                        <TableCell data-cy={IntegrityPageIds.password}>{displayItem.password}</TableCell>
                        <TableCell data-cy={IntegrityPageIds.phone}>{displayItem.phoneNumber}</TableCell>
                        <TableCell data-cy={IntegrityPageIds.isAdmin}>{displayItem.isAdmin ? "Admin" : "User"}</TableCell>
                        <TableCell data-cy={IntegrityPageIds.isActive}>{displayItem.isActive ? "Active" : "Inactive"}</TableCell>
                        <TableCell data-cy={IntegrityPageIds.initiativeIds}><EditUserInitiativesButton user={displayItem} allCompanies={sortedCompanies} SubmitUserData={SubmitUserData} expanded={false}/></TableCell>
                        <TableCell>
                          <IconButton data-cy={IntegrityPageIds.editButton} disabled={InEditMode()} onClick={() => EnterEditMode(displayItem.id, integrityUsers, false)}>
                            <EditIcon sx={{fontSize: tableButtonFontSize}}/>
                          </IconButton>
                        </TableCell>
                      </>
                      }
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Paginator paginator={paginator}/>
        </div>
      </div>
    </ThemeProvider>
  )
}