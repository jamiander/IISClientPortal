import { StyledTextField, TableHeaderStyle, defaultRowStyle, yellowButtonStyle } from "../Styles";
import { useEffect, useState } from "react";
import { User, getUserById, selectAllUsers, selectCurrentUserId } from "../Store/UserSlice";
import { Company, IntegrityId, selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { Checkbox, IconButton, Input} from "@mui/material";
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

export default function IntegrityPage(){
  const allCompanies = useAppSelector(selectAllCompanies);
  const allUsers = useAppSelector(selectAllUsers);
  const [sortedCompanies, setSortedCompanies] = useState<Company[]>([]);
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
    if(allUsers.find(user => user.id === currentUserId)?.isAdmin)
      dispatch(getUserById({}));
  }, [currentUserId]);

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
      <div className="flex col-span-4 bg-[#2ed7c3] rounded-md py-6 px-5">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl font-bold w-full">Integrity Inspired Solutions</p>
            <p className="text-3xl w-full">Users</p>
          </div>
        </div>
      </div>
      <div className="mx-[2%] mb-[2%]">
        {allUsers.length !== 0 &&
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
                <col style={{ width: '7%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '6%' }} />
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
                  <TableHeaderStyle>Edit User</TableHeaderStyle>
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
              <TableBody id={IntegrityPageIds.table}>
                {usersList.filter(u => u.email.toUpperCase().includes(searchedKeyword.toUpperCase()) || u.name?.toUpperCase().includes(searchedKeyword.toUpperCase()))
                  .map((displayItem: User, key: number) => {
                  let isEdit = InEditMode() && displayItem.id === userToEdit?.id;
                  return (
                    <TableRow className={defaultRowStyle} sx={{
                      borderBottom: "1px solid black",
                      "& td": {
                        fontSize: "1.1rem",
                        fontFamily: "Arial, Helvetica"
                      }
                    }}
                      key={key}
                    >
                      {isEdit ? 
                      <>
                        <TableCell>
                          <IconButton id={IntegrityPageIds.saveChangesButton} onClick={() => SaveEdit()}>
                            <DoneIcon />
                          </IconButton>
                          <IconButton id={IntegrityPageIds.cancelChangesButton} onClick={() => CancelEdit()}>
                            <CancelIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell><Input id={IntegrityPageIds.name}value={currentName} onChange={e => setCurrentName(e.target.value)}/></TableCell>
                        <TableCell><Input id={IntegrityPageIds.email} value={currentEmail} onChange={e => setCurrentEmail(e.target.value)}/></TableCell>
                        <TableCell><Input id={IntegrityPageIds.password} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/></TableCell>
                        <TableCell><Input id={IntegrityPageIds.phone} value={currentPhone} onChange={e => setCurrentPhone(e.target.value)}/></TableCell>
                        <TableCell><Checkbox id={IntegrityPageIds.isAdmin} checked={currentIsAdmin} onChange={e => setCurrentIsAdmin(e.target.checked)}/>Admin</TableCell>
                        <TableCell><Checkbox id={IntegrityPageIds.isActive} checked={currentIsActive} onChange={e => setCurrentIsActive(e.target.checked)}/>Active</TableCell>
                        <TableCell id={IntegrityPageIds.initiativeIds}></TableCell>
                      </>
                      : 
                      <>
                        <TableCell>
                          <IconButton id={IntegrityPageIds.editButton} disabled={InEditMode()} onClick={() => EnterEditMode(displayItem.id, integrityUsers, false)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell id={IntegrityPageIds.name}>{displayItem.name}</TableCell>
                        <TableCell id={IntegrityPageIds.email}>{displayItem.email}</TableCell>
                        <TableCell id={IntegrityPageIds.password}>{displayItem.password}</TableCell>
                        <TableCell id={IntegrityPageIds.phone}>{displayItem.phoneNumber}</TableCell>
                        <TableCell id={IntegrityPageIds.isAdmin}>{displayItem.isAdmin ? "Admin" : "User"}</TableCell>
                        <TableCell id={IntegrityPageIds.isActive}>{displayItem.isActive ? "Active" : "Inactive"}</TableCell>
                        <TableCell id={IntegrityPageIds.initiativeIds}><EditUserInitiativesButton user={displayItem} allCompanies={sortedCompanies} SubmitUserData={SubmitUserData} expanded={false}/></TableCell>
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