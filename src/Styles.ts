import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, styled } from '@mui/material/styles';
import { Card, CardActions, CardContent, FormControlLabel, Paper, TextField, TextareaAutosize } from '@mui/material';
import { grey } from '@mui/material/colors';

export const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    outline : '3px solid #879794',
  }
}

export const integrityColors = {
  integrityDarkBlue: '#21355B',
  integrityLightBlue: '#69D5C3',
  integrityYellow: '#FAB947',
  integrityGrayBlue: '#445362',
  integrityDarkGray: '#65665E',
  integrityLightGray: '#879794',
  integrityVeryLightGray: '#E4E1E5'
}

const globalTheme = createTheme({
  palette: {
    primary: {
      main: grey[300]
    }
  }
})

export const TableHeaderStyle =
  styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.white,
      color: '#21345b'
    }
  })); 

  export const Item = styled(Paper)(() => ({
    backgroundColor: '#E4E1E5',
    padding: 8,
    textAlign: 'center',
    color: 'black',
    elevation: 12,
  }));

  export const UserItem = styled(Paper)(() => ({
    backgroundColor: '#E4E1E5',
    padding: 2,
    marginBottom: 6,
    marginTop: 1,
    textAlign: 'center',
    color: 'black',
    elevation: 12,
    width: "100%",
    marginLeft: 4
  }));

  export const StyledCard = styled(Card)(() => ({
  }))

  export const StyledCardContent = styled(CardContent)(() => ({
    alignItems: "center"
  }))

  export const StyledCardActions = styled(CardActions)(() => ({
    height: 50
  }))

  export const StyledTextField = 
  styled(TextField)(() => ({
    ".MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#65665E",
      color: "#65665E"
    },
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 2,
    width: "100%"
  }));

  export const UserTextField = 
  styled(TextField)(() => ({
    ".MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#65665E",
      color: "#65665E"
    },
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    height: 10,
    width: "10%"
  }));

  export const StyledTextarea =
  styled(TextareaAutosize)(() => ({
    width: "100%",
    borderColor: '#4A90E2',
    borderWidth: 1, 
    marginBottom: 10,
    padding: "0.5rem"
  }));

  export const StyleFormControlLabel =
  styled(FormControlLabel)(() => ({
    display: 'block'
  }))
  
export const labelStyle = "font-bold text-lg";
export const tooltipStyle = "hover:bg-slate-50 cursor-pointer";
export const inputStyle = "outline rounded outline-1 p-2 hover:outline-2 focus:outline-2 mt-2 mb-2";
export const selectStyle = "outline rounded outline-1 p-2 hover:outline-2 focus:outline-2";
export const cardHeader = "text-2xl font-semibold mb-4";

export const submitButtonStyle = "rounded h-3/4 max-h-7 w-[90px] mx-2 bg-lime-600 text-white enabled:hover:bg-lime-700 disabled:opacity-75";
export const cancelButtonStyle = "rounded h-3/4 max-h-7 w-[90px] mx-2 bg-red-600 text-white enabled:hover:bg-red-700 disabled:opacity-75";
export const genericButtonStyle = "outline outline-[#445362] rounded bg-[#21345b] text-white h-10 w-24 transition ease-in-out enabled:hover:bg-white enabled:hover:text-[#445362] disabled:opacity-75";
export const yellowButtonStyle = "outline outline-[#445362] h-[40px] w-32 bg-[#FAB947] text-[#445362] rounded-md transition ease-in-out enabled:hover:bg-white enabled:hover:text-[#445362] disabled:opacity-75";

export const defaultRowStyle = "odd:bg-gray-200";
export const redProbabilityStyle = "bg-red-300";
export const greenProbabilityStyle = "bg-green-200";
