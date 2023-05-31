import { TableHeaderStyle, UserTextField, defaultRowStyle } from "../Styles";
import { useEffect, useState } from "react";
import { User, getUserById, selectAllUsers, selectCurrentUser } from "../Store/UserSlice";
import { Company, IntegrityId, selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Checkbox, IconButton, Input, InputAdornment} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
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


  useEffect(() =>
  {
    if(currentUser?.isAdmin && currentUser.companyId === IntegrityId)
      dispatch(getUserById({}));
  }, []);

  useEffect(() => 
  {
    let newIntegrityUsers = allUsers.filter(user => user.companyId === IntegrityId);
    newIntegrityUsers.sort((a: User, b: User) => a.email.toUpperCase() > b.email.toUpperCase() ? 1 : -1);
    setIntegrityUsers(newIntegrityUsers);
    SetupEditUser(newIntegrityUsers);
  }, [allUsers]);

  useEffect(() => {
    let newSortedCompanies: Company[] = JSON.parse(JSON.stringify(allCompanies));
    newSortedCompanies.sort((a: Company, b: Company) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    setSortedCompanies(newSortedCompanies);
  }, [allCompanies]);

  return (
    <>
      <div className="flex col-span-4 bg-[#69D5C3] py-6 px-5 rounded-md">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl text-[#21345b] font-bold w-full">Developer Management</p>
          </div>
        </div>
      </div>
      <div className="mx-[2%] mb-[2%]">
        {allUsers.length !== 0 &&
          <div className="flex flex-col justify-content:space-between">
            <div className="space-x-10 flex flex-wrap mt-5">
              <IconButton disabled={InEditMode()} data-cy={IntegrityPageIds.addButton} onClick={() => AddEmptyUser(IntegrityId)}>
                <AddIcon fontSize="large"/>
              </IconButton>
              <UserTextField data-cy={IntegrityPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name or email" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }} />
            </div>
          </div>
        }
        <div className="col-span-1 py-[2%]">
          <TableContainer elevation={12} component={Paper}>
            <Table className="table-auto w-full outline outline-3 bg-gray-100">
            <colgroup>
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />
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
                        fontSize: "1.1rem",
                        fontFamily: "Arial, Helvetica",
                        color: "#21345b"
                      }
                    }}
                      key={key}
                    >
                      {isEdit ? 
                      <>
                        <TableCell><Input data-cy={IntegrityPageIds.name}value={currentName} onChange={e => setCurrentName(e.target.value)}/></TableCell>
                        <TableCell><Input data-cy={IntegrityPageIds.email} value={currentEmail} onChange={e => setCurrentEmail(e.target.value)}/></TableCell>
                        <TableCell><Input data-cy={IntegrityPageIds.password} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/></TableCell>
                        <TableCell><Input data-cy={IntegrityPageIds.phone} value={currentPhone} onChange={e => setCurrentPhone(e.target.value)}/></TableCell>
                        <TableCell><Checkbox data-cy={IntegrityPageIds.isAdmin} checked={currentIsAdmin} onChange={e => setCurrentIsAdmin(e.target.checked)}/>Admin</TableCell>
                        <TableCell><Checkbox data-cy={IntegrityPageIds.isActive} checked={currentIsActive} onChange={e => setCurrentIsActive(e.target.checked)}/>Active</TableCell>
                        <TableCell data-cy={IntegrityPageIds.initiativeIds}></TableCell>
                        <TableCell>
                          <IconButton data-cy={IntegrityPageIds.saveChangesButton} onClick={() => SaveEdit()}>
                            <DoneIcon />
                          </IconButton>
                          <IconButton data-cy={IntegrityPageIds.cancelChangesButton} onClick={() => CancelEdit()}>
                            <CancelIcon />
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
                            <EditIcon />
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
        </div>
      </div>
    </>
  )
}