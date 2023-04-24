import { useState } from "react";
import { CompanyFilter } from "../../Services/Filters";
import { Company } from "../../Store/CompanySlice";
import { User } from "../../Store/UserSlice";
import { styled } from '@mui/material/styles';
import EditUserButton from "./EditUserButton";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { defaultRowStyle } from "../../Styles";

interface UsersTableProps {
  userList: User[],
  companyList: Company[],
  radioStatus: string,
  SubmitUpdateUser:(companyName: string, email: string, password: string) => void,
  handleEditUser:(user:User,company?:Company) => void,
  handleCloseEditUser:() => void
}
interface ClientTableProps{
  clients:User[]
}

export default function UsersTable(props: UsersTableProps){

  const TableHeaderStyle =
  styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    }
  })); 

  const TableCellStyle = 
  styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
      alignContent: { alignItems: 'right'},
    }
  }))

  function PasswordDisplay(user:User){
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisibility = () => {
      setPasswordShown(passwordShown ? false:true);
    };
    return(
      <div className="px-4 w-4/5">
        <input disabled type={passwordShown ? 'text' : 'password'} value={user.password} className="bg-inherit flex justify-center"/>
        <input type={'checkbox'} className='hover:outline outline-1 -outline-offset-2' onClick={togglePasswordVisibility}/> Show Password
      </div>
    )
  }

  function ClientTable(cprops:ClientTableProps){
    return(
      <TableContainer component={Paper}>
      <Table className="table-auto w-[100%] outline outline-3 my-3 bg-gray-100">
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
          <TableHeaderStyle>Email</TableHeaderStyle>
          <TableHeaderStyle>Password</TableHeaderStyle>
          <TableHeaderStyle>Edit</TableHeaderStyle>
        </TableRow>
      </TableHead>
      <TableBody>
        {cprops.clients.map((user, index)=>{
          const company = props.companyList.find(company => company.id === user.companyId);
          return(
            <TableRow key={index} className={defaultRowStyle} sx={{
              borderBottom: "1px solid black",
                "& td": {
                  fontSize: "1.1rem",
                  fontFamily: "Arial, Helvetica" 
                }
              }}>
              <TableCellStyle>{company?.name}</TableCellStyle>
              <TableCellStyle>{user.email}</TableCellStyle>
              <TableCellStyle>
                <PasswordDisplay {...(user)}/>
              </TableCellStyle>
              <TableCellStyle>
                <EditUserButton index={index} user={user} company={company} SubmitUpdateUser={props.SubmitUpdateUser} handleEditUser={props.handleEditUser} handleCloseEditUser={props.handleCloseEditUser}/>
              </TableCellStyle>
            </TableRow>
          )
        })}
        </TableBody>
      </Table>
      </TableContainer>
    )
  }
  return(
    <ClientTable clients={CompanyFilter(props.userList,props.radioStatus)}/>
  )
}