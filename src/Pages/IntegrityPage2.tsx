import { Item, StyledCard, StyledCardActions, StyledCardContent, StyledFormGroup, StyledTextField, TableHeaderStyle, cancelButtonStyle, cardHeader, submitButtonStyle, yellowButtonStyle } from "../Styles";
import { Fragment, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { User, getUserById, selectAllUsers, selectCurrentUserId } from "../Store/UserSlice";
import { Company, IntegrityId, getDocuments, selectAllCompanies, uploadDocuments } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Checkbox, FormControlLabel, FormGroup, IconButton, Input} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { AdminEditInitiativesList } from "../Components/User/AdminEditInitiativesList";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useEditUser } from "../Services/useEditUser";
import { v4 } from "uuid";
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
  grid: "adminEditUserGrid"
}

export default function IntegrityPage(){
  const allCompanies = useAppSelector(selectAllCompanies);
  const allUsers = useAppSelector(selectAllUsers);
  const [integrityUsers, setIntegrityUsers] = useState<User[]>([]);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const dispatch = useAppDispatch();

  const {
    SetupEditUser,
    EnterEditMode,
    InEditMode,
    AddEmptyUser,
    SaveEdit,
    CancelEdit,
    usersList,
    userToEdit,
    SubmitUserData,
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
  } = useEditUser();


  useEffect(() =>
  {
    if(allUsers.find(user => user.id === currentUserId)?.isAdmin)
      dispatch(getUserById({}));
  }, [currentUserId]);

  useEffect(() => 
  {
    const newIntegrityUsers = allUsers.filter(user => user.companyId === IntegrityId);
    setIntegrityUsers(newIntegrityUsers);
    SetupEditUser(newIntegrityUsers);
  }, [allUsers])

  let sortedUsers = JSON.parse(JSON.stringify(usersList));
  sortedUsers.sort((a: User, b: User) => a.name! > b.name! ? 1 : -1);

  let sortedCompanies = JSON.parse(JSON.stringify(allCompanies));
  sortedCompanies.sort((a: Company, b: Company) => a.name > b.name ? 1 : -1);


  return (
    <>
      <div className="flex col-span-4 bg-[#2ed7c3] rounded-md py-6 px-5">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl font-bold w-full">Integrity Inspired Solutions</p>
            <p className="text-3xl w-full">Users</p>
          </div>
        </div>
      </div>
      <div className="mx-[2%] mb-[2%]">
        {sortedUsers.length !== 0 &&
          <div className="mt-2 mb-4">
            <StyledTextField className="w-1/2" id={IntegrityPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name or email" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)} />
          </div>
        }
        <div className="flex flex-col justify-between">
          <button disabled={InEditMode()} id={IntegrityPageIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyUser(IntegrityId)}>Add User</button>
        </div>
        <div className="col-span-1 py-[2%]">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
              <TableContainer component={Paper}>
                  <Table className="table-auto w-full outline outline-3 bg-gray-100">
                      <colgroup>
                          <col style={{ width: '15%' }} />
                          <col style={{ width: '15%' }} />
                          <col style={{ width: '13%' }} />
                          <col style={{ width: '13%' }} />
                          <col style={{ width: '12%' }} />
                          <col style={{ width: '12%' }} />
                          <col style={{ width: '10%' }} />
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
                            <TableHeaderStyle>Manage Users</TableHeaderStyle>
                            <TableHeaderStyle>Name
                                {/* <TableSortLabel 
                                onClick={() => requestSort('companyName')} active={true} direction={sortConfig.direction === 'descending' ? 'desc' : 'asc'}>
                                </TableSortLabel> */}
                            </TableHeaderStyle>
                            <TableHeaderStyle>Email</TableHeaderStyle>
                            <TableHeaderStyle>Password</TableHeaderStyle>
                            <TableHeaderStyle>Phone</TableHeaderStyle>
                            <TableHeaderStyle>Admin Status</TableHeaderStyle>
                            <TableHeaderStyle>Active Status</TableHeaderStyle>
                            <TableHeaderStyle>Initiatives</TableHeaderStyle>
                          </TableRow>
                      </TableHead>
                <TableBody>
                    {sortedUsers.filter((u: { email: string; name: string; }) => u.email.toUpperCase().includes(searchedKeyword.toUpperCase()) || u.name?.toUpperCase().includes(searchedKeyword.toUpperCase())).map((displayItem: User, key: number) => {
                  let isEdit = InEditMode() && displayItem.id === userToEdit?.id;
                  return (
                  <TableRow sx={{
                    borderBottom: "1px solid black",
                    "& td": {
                      fontSize: "1.1rem",
                      fontFamily: "Arial, Helvetica"
                    }
                  }}>
                    {isEdit ? 
                    <>
                    <TableCell>
                        <IconButton onClick={() => SaveEdit()}>
                            <DoneIcon />
                        </IconButton>
                        <IconButton onClick={() => CancelEdit()}>
                            <CancelIcon />
                        </IconButton>
                    </TableCell>
                    <TableCell id={IntegrityPageIds.name}> <Input value={currentName} onChange={e => setCurrentName(e.target.value)}/></TableCell>
                      <TableCell id={IntegrityPageIds.email}><Input value={currentEmail} onChange={e => setCurrentEmail(e.target.value)}/></TableCell>
                      <TableCell id={IntegrityPageIds.password}><Input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/></TableCell>
                      <TableCell id={IntegrityPageIds.phone}><Input value={currentPhone} onChange={e => setCurrentPhone(e.target.value)}/></TableCell>
                      <TableCell id={IntegrityPageIds.isAdmin}><Checkbox checked={currentIsAdmin} onChange={e => setCurrentIsAdmin(e.target.checked)}/>Admin</TableCell>
                      <TableCell id={IntegrityPageIds.isActive}><Checkbox checked={currentIsActive} onChange={e => setCurrentIsActive(e.target.checked)}/>Active</TableCell>
                      <TableCell id={IntegrityPageIds.initiativeIds}></TableCell>
                      </>
                    : 
                    <>
                    <TableCell>
                        <IconButton onClick={() => EnterEditMode(displayItem.id, integrityUsers, false)}>
                            <EditIcon />
                        </IconButton>
                    </TableCell>
                    <TableCell id={IntegrityPageIds.name}>{displayItem.name}</TableCell>
                      <TableCell id={IntegrityPageIds.email}>{displayItem.email}</TableCell>
                      <TableCell id={IntegrityPageIds.password}>{displayItem.password}</TableCell>
                      <TableCell id={IntegrityPageIds.phone}>{displayItem.phoneNumber}</TableCell>
                      <TableCell id={IntegrityPageIds.isAdmin}>{displayItem.isAdmin ? "Admin" : "User"}</TableCell>
                      <TableCell id={IntegrityPageIds.isActive}>{displayItem.isActive ? "Active" : "Inactive"}</TableCell>
                      <TableCell id={IntegrityPageIds.initiativeIds}><EditUserInitiativesButton user={displayItem} allCompanies={allCompanies} SubmitUserData={SubmitUserData}/></TableCell>
                      </>
                    }
                </TableRow>
                    );
                    }
                    )}
                </TableBody>
                </Table>
                </TableContainer>
              </div>
          </div>
          </>           
        )       
}