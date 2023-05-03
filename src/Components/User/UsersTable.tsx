import { useEffect, useState } from "react";
import { CompanyFilter } from "../../Services/Filters";
import { Company } from "../../Store/CompanySlice";
import { User } from "../../Store/UserSlice";
import EditUserButton from "./EditUserButton";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { defaultRowStyle, inputStyle, TableHeaderStyle } from "../../Styles";

export const UserTableIds = {
  companyNameFilter: "userTableFilterCompanyName"
}

interface UsersTableProps {
  companyList: Company[],
  radioStatus: string,
  SubmitUpdateUser:(companyName: string) => void,
  handleEditUser:(company?:Company) => void,
  handleCloseEditUser:() => void
}

export default function UsersTable(props: UsersTableProps){
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchedCompany, setSearchedCompany] = useState<string>("");

  useEffect(() => {
    setFilteredCompanies(props.companyList.filter(e => e.name.toLowerCase().includes(searchedCompany.toLowerCase())));
  },[searchedCompany])

  function PasswordDisplay(user:User){
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisibility = () => {
      setPasswordShown(passwordShown ? false:true);
    };
    return(
      <div className="px-4 w-4/5">
        <input disabled type={passwordShown ? 'text' : 'password'} value={user.password} className="bg-inherit flex justify-center"/>
        <label>
          <input type={'checkbox'} className='hover:outline outline-1 -outline-offset-2' onClick={togglePasswordVisibility}/> Show Password
        </label>
      </div>
    )
  }

  return(
    <div className="grid grid-cols-1 w-full h-auto">
      <div className="col-span-1 h-[4vh] px-2 pb-[2%] space-x-2">
        <input id={UserTableIds.companyNameFilter} className={inputStyle} type={'text'} placeholder="Filter by Company" onChange={(e) => setSearchedCompany(e.target.value)}/>
      </div>
      <div className="col-span-1 py-[2%]">
        <TableContainer component={Paper}>
          <Table className="table-auto w-full outline outline-3 bg-gray-100">
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
              
              <TableHeaderStyle>Edit</TableHeaderStyle>
            </TableRow>
          </TableHead>
          <TableBody>
             {
              filteredCompanies.map((display,index) => {
             
                return(
                  <TableRow className={defaultRowStyle} sx={{
                    borderBottom: "1px solid black",
                      "& td": {
                        fontSize: "1.1rem",
                        fontFamily: "Arial, Helvetica" 
                      }
                    }}>
                    <TableCell>{display?.name}</TableCell>
                    
                    <TableCell>
                      <EditUserButton company={display} SubmitUpdateUser={props.SubmitUpdateUser} handleEditUser={props.handleEditUser} handleCloseEditUser={props.handleCloseEditUser} index={index}/>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}