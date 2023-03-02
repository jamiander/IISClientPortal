import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useOutletContext } from "react-router-dom";
import { DateInfo, GetCompanyInfo, GetCompanyInfoRequest, ThroughputData, UpdateCompanyInfo, UpdateCompanyInfoRequest, UpdateInitiativeInfo, UpdateInitiativeInfoRequest, UpdateThroughputData, UpdateThroughputDataRequest } from "../Services/CompanyService"
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
    itemsCompletedOnDate: ThroughputData[] 
}

const initialState: CompanyState = {
    companies: [],
}

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
            let company: Company = {id: parseInt(info.id), name: info.companyName, initiatives: []};
            companies.push(company);

            let employee = info.employeeInfo;
            let user: User = {
                id: parseInt(employee.employeeId),
                companyId: company.id,
                email: employee.employeeEmail,
                password: employee.employeePassword
            }
            users.push(user);

            if(info.initiatives)
            {
                for(const initiative of info.initiatives)
                {
                  initiative.id = parseInt(initiative.id.toString());
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
        let newId = parseInt(response.id);
        let newCompany: Company = JSON.parse(JSON.stringify(args.company));
        newCompany.id = newId;
        
        let newUser: User = JSON.parse(JSON.stringify(args.employee));
        newUser.companyId = newId;
        newUser.id = newId;   //this stinks; consider having just one id property if they're just going to be identical

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
        newInitiative.id = parseInt(response.initiativeId);
        return {initiative: newInitiative, companyId: parseInt(args.companyId)};
    }
)

export const updateThroughputData = createAsyncThunk(
  'companies/updateThroughputInfo',
  async (args: UpdateThroughputDataRequest, {dispatch, getState}): Promise<{initiativeId: number, companyId: number, data: ThroughputData[]}> => {
    const response = await UpdateThroughputData(args);

    if(response.status.toUpperCase().includes('FAILED'))
      throw Error;

    return {initiativeId: parseInt(args.initiativeId), companyId: parseInt(args.companyId), data: args.itemsCompletedOnDate};
  }
)

export const companySlice = createSlice({
    name: "companies",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
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
            .addCase(updateThroughputData.fulfilled, (state, action) => {
              const ShowToast : (message: string, type: 'Success' | 'Error' | 'Warning' | 'Info') => void = useOutletContext();
              const companyId = action.payload.companyId;
              const initiativeId = action.payload.initiativeId;
              const matchingCompany = state.companies.find(company => company.id === companyId);
              if(matchingCompany)
              {
                const matchingInit = matchingCompany.initiatives.find(init => init.id === initiativeId);
                if(matchingInit)
                {
                  for(const item of action.payload.data)
                  {
                    const itemIndex = matchingInit.itemsCompletedOnDate.findIndex(entry => 
                      entry.date.month === item.date.month &&
                      entry.date.day === item.date.day &&
                      entry.date.year === item.date.year);

                    if(itemIndex > -1)
                      matchingInit.itemsCompletedOnDate[itemIndex].itemsCompleted = item.itemsCompleted;
                    else
                      matchingInit.itemsCompletedOnDate.push(item);
                  }
                }
                else
                  ShowToast("Initiative with id " + initiativeId + " does not exist clientside.","Error");
              }
              else
                ShowToast("Company with id " + companyId + " does not exist clientside.", "Error");
            })
    }
});

export const {} = companySlice.actions;

export const selectAllCompanies = (state: RootState) => state.companies.companies;

export default companySlice.reducer;