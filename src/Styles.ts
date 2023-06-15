import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, styled } from '@mui/material/styles';
import { Card, CardActions, CardContent, FormControlLabel, Paper, TextField, TextareaAutosize } from '@mui/material';

import "@mui/material/styles/createPalette";
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    darkBlue: Palette['primary'];
    lightBlue: Palette['primary'];
    yellow: Palette['primary'];
    grayBlue: Palette['primary'];
    darkGray: Palette['primary'];
    lightGray: Palette['primary'];
    veryLightGray: Palette['primary'];
  }
  interface PaletteOptions {
    darkBlue?: Palette['primary'];
    lightBlue?: Palette['primary'];
    yellow?: Palette['primary'];
    grayBlue?: Palette['primary'];
    darkGray?: Palette['primary'];
    lightGray?: Palette['primary'];
    veryLightGray?: Palette['primary'];
  }
}

declare module "@mui/material" {
  interface ButtonPropsColorOverrides {
    lightBlue: true;
    darkBlue: true;
    yellow: true;
    grayBlue: true;
    darkGray: true;
    lightGray: true;
    veryLightGray: true;
  }
  interface CheckboxPropsColorOverrides {
    lightBlue: true;
    darkBlue: true;
    yellow: true;
    grayBlue: true;
    darkGray: true;
    lightGray: true;
    veryLightGray: true;
  }
  interface TextFieldPropsColorOverrides {
    lightBlue: true;
    darkBlue: true;
    yellow: true;
    grayBlue: true;
    darkGray: true;
    lightGray: true;
    veryLightGray: true;
  }
}

export const IntegrityTheme = createTheme({
  palette: {
    darkBlue: {
      light: '#2E4A7F',
      main: '#21355B',
      dark: '#131F34',
      contrastText: '#FFFFFF'
    },
    lightBlue: {
      light: '#A7E6DC',
      main: '#69D5C3',
      dark: '#40C9B2',
      contrastText: '#21355B'
    },
    yellow: {
      light: '#FBCC79',
      main: '#FAB947',
      dark: '#F9A616',
      contrastText: '#21355B'
    },
    grayBlue: {
      light: '#5A6E81',
      main: '#445362',
      dark: '#303B45',
      contrastText: '#FFFFFF'
    },
    darkGray: {
      light: '#7E7F75',
      main: '#65665E',
      dark: '#4A4A44',
      contrastText: '#FFFFFF'
    },
    lightGray: {
      light: '#A2AEAC',
      main: '#879794',
      dark: '#6D7E7B',
      contrastText: '#FFFFFF'
    },
    veryLightGray: {
      light: '#F3F1F3',
      main: '#E4E1E5',
      dark: '#CBC6CD',
      contrastText: '#21355B'
    }
  }
});

export const integrityColors = {
  integrityDarkBlue: '#21355B',
  integrityLightBlue: '#69D5C3',
  integrityYellow: '#FAB947',
  integrityGrayBlue: '#445362',
  integrityDarkGray: '#65665E',
  integrityLightGray: '#879794',
  integrityVeryLightGray: '#E4E1E5'
}

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
    width: "99%",
    marginLeft: ".5%",
    marginRight: ".5%"
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
    
  }));

  export const StyledTextarea =
  styled(TextareaAutosize)(() => ({
    width: "100%",
    borderColor: '#65665E',
    borderWidth: 1, 
    borderRadius: 1,
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
export const redProbabilityStyle = "bg-[#FF6464]";
export const greenProbabilityStyle = "bg-[#69D5C3]";

export const tableCellFontSize = "min(calc(14px + 0.390625vw),16px)";
export const tableHeaderFontSize = "min(calc(17px + 0.390625vw),20px)";
export const tableButtonFontSize = tableHeaderFontSize;
