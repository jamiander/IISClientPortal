import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Action } from "@remix-run/router"
import { AddCompany, AddCompanyRequest, GetAllCompanies } from "../Services/CompanyService"
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

export const addCompany = createAsyncThunk(
    'companies/addCompany',
    async(args: AddCompanyRequest) : Promise<Company> => {
        const response = await AddCompany(args);
        console.log(response.status);

        if (response.status.toUpperCase().includes('SUCCESS')){
            let newCompany = JSON.parse(JSON.stringify(args.company));
            newCompany.id = response.id;
            return newCompany;
        }
        throw Error;
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
            .addCase(addCompany.fulfilled, (state, action) => {
                state.companies.push(action.payload);
            })
    }
});

export const {} = companySlice.actions;

export const selectAllCompanies = (state: RootState) => state.companies.companies;

export default companySlice.reducer;