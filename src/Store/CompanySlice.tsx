import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { DateInfo, GetCompanyInfo, GetCompanyInfoRequest, UpdateCompanyInfo, UpdateCompanyInfoRequest, UpdateInitiativeInfo, UpdateInitiativeInfoRequest } from "../Services/CompanyService"
import { RootState } from "./Store"
import { addUsersToStore, User } from "./UserSlice"

export interface Company {
    id: number,
    name: string,
    initiatives: Initiative[]
}

export interface CompanyState {
    companies: Company[]
}

export interface Initiative {
    id: number,
    title: string,
    targetDate: DateInfo,
    totalItems: number,
    itemsCompletedOnDate: [
        {
            date: DateInfo,
            itemsCompleted: number
        }
    ] | []
}

const initialState: CompanyState = {
    companies: [{id: -1, name: "default", initiatives: []}],
}

/*export const getCompanyData = createAsyncThunk(
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
)*/

export const getCompanyInfo = createAsyncThunk(
    'companies/getCompanyInfo',
    async (args: GetCompanyInfoRequest, {dispatch, getState}) => {
        const response = await GetCompanyInfo(args);
        const companyInfo = response.info;
        console.log(response.status);
        if (response.status.toUpperCase().includes('FAILED'))
            throw Error;

        let users: User[] = [];
        let companies: Company[] = [];
        for(const info of companyInfo)
        {
            let company: Company = {id: info.companyId, name: info.companyName, initiatives: []};
            companies.push(company);

            let employee = info.employeeInfo;
            let user: User = {
                id: employee.employeeId,
                companyId: company.id,
                email: employee.employeeEmail,
                password: employee.employeePassword
            }
            users.push(user);

            if(info.initiatives)
            {
                for(const [key,value] of Object.entries(info.initiatives))
                {
                    let initiative: Initiative = {...value as Initiative,id: parseInt(key)};
                    company.initiatives.push(initiative);
                }
            }
        }
        dispatch(addUsersToStore(users));

        return companies;
    }
)

export const updateCompanyInfo = createAsyncThunk(
    'companies/updateCompanyInfo',
    async (args: UpdateCompanyInfoRequest, {dispatch, getState}): Promise<Company> => {
        const response = await UpdateCompanyInfo(args);
        
        if (response.status.toUpperCase().includes('FAILED'))
            throw Error;
        
        let newCompany: Company = JSON.parse(JSON.stringify(args.company));
        newCompany.id = response.id;
        
        let newUser: User = JSON.parse(JSON.stringify(args.employee));
        newUser.companyId = response.id;
        newUser.id = response.id;   //this stinks; consider having just one id property if they're just going to be identical

        dispatch(addUsersToStore([newUser]));

        return newCompany;
    }
)

export const updateInitiativeInfo = createAsyncThunk(
    'companies/updateInitiativesInfo',
    async (args: UpdateInitiativeInfoRequest, {dispatch, getState}): Promise<{initiative: Initiative, companyId: number}> => {
        const response = await UpdateInitiativeInfo(args);

        if(response.status.toUpperCase().includes('FAILED'))
            throw Error;
        
        let newInitiative: Initiative = JSON.parse(JSON.stringify(args.initiative));
        newInitiative.id = response.id;
        return {initiative: newInitiative, companyId: args.companyId};
    }
)

export const companySlice = createSlice({
    name: "companies",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            /*.addCase(getCompanyData.fulfilled, (state, action) => {
                state.companies = action.payload;
            })
            .addCase(addCompany.fulfilled, (state, action) => {
                state.companies.push(action.payload);
            })*/
            .addCase(getCompanyInfo.fulfilled, (state, action) => {
                const newCompanies = action.payload;
                for(const company of newCompanies)
                {
                    let companyIndex = state.companies.findIndex(c => c.id === company.id);
                    if(companyIndex > -1)
                        state.companies.splice(companyIndex,1);
                    state.companies.push(company);
                }
            })
            .addCase(updateCompanyInfo.fulfilled, (state, action) => {
                const newCompany = action.payload;
                const companyIndex = state.companies.findIndex(company => company.id === newCompany.id)
                if(companyIndex > -1)
                    state.companies.splice(companyIndex, 1);
                state.companies.push(newCompany);
            })
            .addCase(updateInitiativeInfo.fulfilled, (state, action) => {
                const newInitiative = action.payload.initiative;
                const companyId = action.payload.companyId;
                const matchingCompany = state.companies.find(company => company.id === companyId);
                if(matchingCompany)
                {
                    const initIndex = matchingCompany.initiatives.findIndex(init => init.id === newInitiative.id);
                    if(initIndex > -1)
                        matchingCompany.initiatives.splice(initIndex,1);
                    matchingCompany.initiatives.push(newInitiative);
                }
            })
    }
});

export const {} = companySlice.actions;

export const selectAllCompanies = (state: RootState) => state.companies.companies;

export default companySlice.reducer;