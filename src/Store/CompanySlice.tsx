import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Action } from "@remix-run/router"
import { GetAllCompanies } from "../Services/CompanyService"
import { RootState } from "./Store"

export interface Company {
    id: number,
    name: string,
    initiatives?: number[]
}

export interface CompanyState {
    companies: Company[]
    currentCompanyId: number
}

const initialState: CompanyState = {
    companies: [{id: -1, name: "default", initiatives: []}],
    currentCompanyId: -1
}

export const getCompanyData = createAsyncThunk(
    'companies/getCompanyData',
    async () => {
        const response = await GetAllCompanies();
        return response;
    }
)

export const companySlice = createSlice({
    name: "companies",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getCompanyData.fulfilled, (state, action) => {
                // console.log("thunk reducer", action.payload);
                state.companies = action.payload;
            })
    }
});

export const {} = companySlice.actions;

export const selectAllCompanies = (state: RootState) => state.companies.companies;

export default companySlice.reducer;