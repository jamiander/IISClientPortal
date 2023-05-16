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

export const CompanyPageIds = {
  modal: "editUserModal",
  closeModalButton: "editUserModalCloseModalButton",
  company: "editUserCompany",
  email: "editUserEmail",
  password: "editUserPassword",
  initiativeIds: "editUserInitiativeIds",
  name: "editUserName",
  phone: "editUserPhone",
  isAdmin: "editIsAdmin",
  isActive: "editUserIsActive",
  addButton: "editUserAddButton",
  editButton: "editUserEditButton",
  saveChangesButton: "editUserSaveChangesButton",
  cancelChangesButton: "editUserCancelChangesButton",
  deleteButton: "editUserDeleteButton",
  keywordFilter: "editUserKeywordFilter",
  grid: "editUserGrid"
}

export default function CompanyPage2(){
  const allCompanies = useAppSelector(selectAllCompanies);
  const allUsers = useAppSelector(selectAllUsers);
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [displayCompanies, setDisplayCompanies] = useState<Company[]>([]);
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
    SetupEditUser(allUsers);
  }, [allUsers])

  useEffect(() =>
  {
    let sortedCompanies: Company[] = JSON.parse(JSON.stringify(allCompanies));
    sortedCompanies.sort((a: Company, b: Company) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    setDisplayCompanies(sortedCompanies.filter((company: { id: string; }) => company.id !== IntegrityId));
  },[allCompanies]); 
  
  let currentUserCompanyId = allUsers.find(user => user.id === currentUserId)?.companyId;
  let userCompany = displayCompanies.find(x => x.id === currentUserCompanyId)!;

  useEffect(() =>
  {
    if(allUsers.find(user => user.id === currentUserId)?.isAdmin)
      dispatch(getUserById({}));
  }, [currentUserId]);

  useEffect(() => 
  {
    if(currentUserCompanyId === IntegrityId){
        const otherCompanyUsers = allUsers.filter(user => user.companyId !== IntegrityId);
        setCompanyUsers(otherCompanyUsers);
        SetupEditUser(otherCompanyUsers);
    }
    else {
        const otherCompanyUsers = allUsers.filter(user => user.companyId !== IntegrityId);
        let filteredUsers = otherCompanyUsers.filter(cu => cu.companyId === userCompany?.id)
        setCompanyUsers(filteredUsers);
        SetupEditUser(filteredUsers);
    }
  }, [allUsers])

  return (
    <>
      <div className="flex col-span-4 bg-[#2ed7c3] rounded-md py-6 px-5">
          <div className="w-full flex justify-between">
              <div className="space-y-2 w-1/2">
                  <p className="text-5xl font-bold w-full">Integrity Inspired Solutions</p>
                  <p className="text-3xl w-full">Users</p>
              </div>
              <div className="flex flex-col justify-between">
                  <button disabled={InEditMode()} id={CompanyPageIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyUser(IntegrityId)}>Add User</button>
              </div>
          </div>
      </div>
      <div className="mx-[2%] mb-[2%]">
          {companyUsers.length !== 0 &&
              <div className="mt-2 mb-4">
                  <StyledTextField className="w-1/2" id={CompanyPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name or email" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)} />
              </div>}

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
                            <TableHeaderStyle>Company</TableHeaderStyle>
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
                            <TableHeaderStyle>Assigned Initiatives</TableHeaderStyle>
                          </TableRow>
                      </TableHead>
                <TableBody>
                    {displayCompanies.map((displayCompany, key) => {
                        let companyUser = companyUsers.find(cu => cu.companyId === displayCompany.id)!;
                        let isEdit = InEditMode() && companyUser?.id === userToEdit?.id;
                        return (
                  <TableRow className={defaultRowStyle} sx={{
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
                    <TableCell id={CompanyPageIds.company}>{displayCompany?.name}</TableCell>
                    <TableCell id={CompanyPageIds.name}> <Input value={currentName} onChange={e => setCurrentName(e.target.value)}/></TableCell>
                    <TableCell id={CompanyPageIds.email}><Input value={currentEmail} onChange={e => setCurrentEmail(e.target.value)}/></TableCell>
                    <TableCell id={CompanyPageIds.password}><Input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/></TableCell>
                    <TableCell id={CompanyPageIds.phone}><Input value={currentPhone} onChange={e => setCurrentPhone(e.target.value)}/></TableCell>
                    <TableCell id={CompanyPageIds.isAdmin}><Checkbox checked={currentIsAdmin} onChange={e => setCurrentIsAdmin(e.target.checked)}/>Admin</TableCell>
                    <TableCell id={CompanyPageIds.isActive}><Checkbox checked={currentIsActive} onChange={e => setCurrentIsActive(e.target.checked)}/>Active</TableCell>
                    <TableCell id={CompanyPageIds.initiativeIds}></TableCell>
                    </>
                      : 
                     <>
                    <TableCell>
                        <IconButton onClick={() => EnterEditMode(companyUser?.id, companyUsers, false)}>
                            <EditIcon />
                        </IconButton>
                    </TableCell>
                    <TableCell id={CompanyPageIds.company}>{displayCompany.name}</TableCell>
                    <TableCell id={CompanyPageIds.name}>{companyUser?.name}</TableCell>
                    <TableCell id={CompanyPageIds.email}>{companyUser?.email}</TableCell>
                    <TableCell id={CompanyPageIds.password}>{companyUser?.password}</TableCell>
                    <TableCell id={CompanyPageIds.phone}>{companyUser?.phoneNumber}</TableCell>
                    <TableCell id={CompanyPageIds.isAdmin}>{companyUser?.isAdmin ? "Admin" : "User"}</TableCell>
                    <TableCell id={CompanyPageIds.isActive}>{companyUser?.isActive ? "Active" : "Inactive"}</TableCell>
                    <TableCell id={CompanyPageIds.initiativeIds}><EditUserInitiativesButton user={companyUser} allCompanies={[displayCompany]} SubmitUserData={SubmitUserData} expanded={true}/></TableCell>
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