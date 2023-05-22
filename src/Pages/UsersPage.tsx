import { StyledTextField, TableHeaderStyle, defaultRowStyle, yellowButtonStyle } from "../Styles";
import { useEffect, useRef, useState } from "react";
import { User, getUserById, selectAllUsers, selectCurrentUserId, upsertUserInfo } from "../Store/UserSlice";
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
import AdminAddUserModal from "../Components/User/AdminAddUserModal";
import { ValidateUser, ValidationFailedPrefix } from "../Services/Validation";
import { enqueueSnackbar } from "notistack";
import { AdminSelectCompanyModal } from "../Components/User/AdminSelectCompanyModal";

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
  addModal: "usersPageAddModal",
  
}

export default function UsersPage(){
  const allCompanies = useAppSelector(selectAllCompanies);
  const allUsers = useAppSelector(selectAllUsers);
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [displayCompanies, setDisplayCompanies] = useState<Company[]>([]);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const dispatch = useAppDispatch();
  const [AdminAddUserModalIsOpen, setAdminAddUserModalIsOpen] = useState(false);

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
    SetupEditUser(allUsers);
  }, [allUsers])

  useEffect(() =>
  {
    let sortedCompanies: Company[] = JSON.parse(JSON.stringify(allCompanies));
    sortedCompanies.sort((a: Company, b: Company) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    setDisplayCompanies(sortedCompanies.filter((company: { id: string; }) => company.id !== IntegrityId));
  },[allCompanies]); 
  
  let currentUserCompanyId = allUsers.find(user => user.id === currentUserId)?.companyId!;
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

  function SubmitAddUser(user: User): boolean
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
    let validation = ValidateUser(user,usersList);
    if(validation.success)
    {
      dispatch(upsertUserInfo({isTest: isTest, users: [user]}))
      return true;
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
    
    return false;
  }

  const [isCompanySelectOpen, setIsCompanySelectOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  function ConfirmSelect()
  {
    const matchingCompany = allCompanies.find(c => c.id === selectedCompanyId);
    if(matchingCompany)
    {
      AddEmptyUser(selectedCompanyId);
      setTimeout(() => myRef.current?.scrollIntoView(),1);
      setIsCompanySelectOpen(false);
    }
    else
      enqueueSnackbar(ValidationFailedPrefix + "A valid company must be selected.", {variant: "error"})
  }

  function CancelSelect()
  {
    setIsCompanySelectOpen(false);
  }

  const myRef = useRef<HTMLElement>(null);

  return (
    <>
      <div className="flex col-span-4 bg-[#2ed7c3] py-6 px-5">
        <div className="w-full flex justify-between">
          <div className="space-y-2 w-1/2">
            <p className="text-5xl font-bold w-full">User Management</p>
          </div>
        </div>
      </div>
      <div className="mx-[2%] mb-[2%]">
        {companyUsers.length !== 0 &&
        <div className="mt-2 mb-4">
          <StyledTextField className="w-1/2" id={UsersPageIds.keywordFilter} disabled={InEditMode()} placeholder="Keyword in name or email" label="Search" value={searchedKeyword} onChange={(e) => setSearchedKeyword(e.target.value)} />
        </div>}
        {currentUserCompanyId !== IntegrityId &&
        <div className="flex flex-col justify-between">
          <button disabled={InEditMode()} id={UsersPageIds.addButton} className={yellowButtonStyle} onClick={() => AddEmptyUser(currentUserCompanyId)}>Add User</button>
        </div>}
        {currentUserCompanyId === IntegrityId &&
        <div className="flex flex-col justify-between">
          <button disabled={InEditMode()} id={UsersPageIds.addButton} className={yellowButtonStyle} onClick={() => setIsCompanySelectOpen(true)}>Add User</button>
            {/*<AdminAddUserModal title="Add User" isOpen={AdminAddUserModalIsOpen} setAdminAddUserModalIsOpen={setAdminAddUserModalIsOpen} companies={displayCompanies} Submit={SubmitAddUser} expanded={false}/>
            */}
            <AdminSelectCompanyModal isOpen={isCompanySelectOpen} setIsOpen={setIsCompanySelectOpen} companies={allCompanies.filter(c => c.id !== IntegrityId)} companyId={selectedCompanyId} setCompanyId={setSelectedCompanyId} Confirm={ConfirmSelect} Cancel={CancelSelect}/>
        </div>}
        <div className="col-span-1 py-[2%]">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <TableContainer component={Paper}>
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
                  <TableHeaderStyle>Edit User</TableHeaderStyle>
                </TableRow>
              </TableHead>
              <TableBody id={UsersPageIds.table}>
                {displayCompanies.map((displayCompany, key) => {
                  let companyUserList = usersList.filter(cu => cu.companyId === displayCompany.id)!.filter(u => u.email.toUpperCase().includes(searchedKeyword.toUpperCase()) || u.name?.toUpperCase().includes(searchedKeyword.toUpperCase()));
                  return (
                    companyUserList.map((companyUser,key) => {
                      let isEdit = InEditMode() && companyUser?.id === userToEdit?.id;
                      return (
                        <TableRow className={defaultRowStyle} key={key} sx={{
                          borderBottom: "1px solid black",
                          "& td": {
                            fontSize: "1.1rem",
                            fontFamily: "Arial, Helvetica"
                          }
                        }}>
                          {isEdit ?
                          <>
                            <TableCell id={UsersPageIds.company}>{displayCompany?.name}</TableCell>
                            <TableCell id={UsersPageIds.name}> <Input value={currentName} onChange={e => setCurrentName(e.target.value)}/></TableCell>
                            <TableCell id={UsersPageIds.email}><Input value={currentEmail} onChange={e => setCurrentEmail(e.target.value)}/></TableCell>
                            <TableCell id={UsersPageIds.password}><Input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/></TableCell>
                            <TableCell id={UsersPageIds.phone}><Input value={currentPhone} onChange={e => setCurrentPhone(e.target.value)}/></TableCell>
                            <TableCell id={UsersPageIds.isAdmin}><Checkbox checked={currentIsAdmin} onChange={e => setCurrentIsAdmin(e.target.checked)}/>Admin</TableCell>
                            <TableCell id={UsersPageIds.isActive}><Checkbox checked={currentIsActive} onChange={e => setCurrentIsActive(e.target.checked)}/>Active</TableCell>
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
                            <TableCell id={UsersPageIds.initiativeIds}><EditUserInitiativesButton user={companyUser} allCompanies={[displayCompany]} SubmitUserData={SubmitUserData} expanded={true}/></TableCell>
                            <TableCell>
                              <IconButton id={UsersPageIds.editButton} disabled={InEditMode()} onClick={() => EnterEditMode(companyUser?.id, companyUsers, false)}>
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                          </>
                          }
                        </TableRow>
                      );
                    })
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>           
  )       
}