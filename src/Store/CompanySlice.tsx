import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Action } from "@remix-run/router"
import { AddCompany, AddCompanyRequest, GetAllCompanies, GetCompanyInfo, GetCompanyInfoRequest } from "../Services/CompanyService"
import { RootState } from "./Store"
import { addUsersToStore, User } from "./UserSlice"

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

        if (response.status.toUpperCase().includes('FAILED'))
            throw Error;
            
        let newCompany = JSON.parse(JSON.stringify(args.company));
        newCompany.id = response.id;
        return newCompany;
    }
)

export const getCompanyInfo = createAsyncThunk(
    'companies/getCompanyInfo',
    async (args: GetCompanyInfoRequest, {dispatch, getState}) => {
        const response = await GetCompanyInfo(args);
        const companyInfo = response.info;

        let users: User[] = [];
        let companies: Company[] = [];
        for(const info of companyInfo)
        {
            let company: Company = {id: info.companyId, name: info.companyName};
            companies.push(company);

            let employee = info.employeeInfo;
            let user: User = {
                id: employee.employeeId,
                email: employee.employeeEmail,
                password: employee.employeePassword,
                companyId: company.id
            }
            users.push(user);
        }
        dispatch(addUsersToStore(users));

        return {companies: companies};
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
            .addCase(getCompanyInfo.fulfilled, (state, action) => {
                state.companies = action.payload.companies;
            })
    }
});

export const {} = companySlice.actions;

export const selectAllCompanies = (state: RootState) => state.companies.companies;

export default companySlice.reducer;