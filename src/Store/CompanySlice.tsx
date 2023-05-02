import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AuthenticateUser, AuthenticateUserRequest, DateInfo, GetCompanyInfo, GetCompanyInfoRequest, ThroughputData, DecisionData, UpsertCompanyInfo, UpsertCompanyInfoRequest, UpsertInitiativeInfo, UpsertInitiativeInfoRequest, UpsertThroughputData, UpsertThroughputDataRequest, UpsertDecisionDataRequest, UpsertDecisionData, DeleteDecisionDataRequest, DeleteDecisionData } from "../Services/CompanyService"
import { RootState } from "./Store"
import { addUsersToStore, setCurrentUserId, User } from "./UserSlice"

export interface Company {
    id: string,
    name: string,
    initiatives: Initiative[]
}

export interface CompanyState {
    companies: Company[],
    logInAttempts: number
}

export interface Initiative {
    id: string,
    title: string,
    targetDate: DateInfo,
    startDate: DateInfo,
    totalItems: number,
    itemsCompletedOnDate: ThroughputData[],
    decisions: DecisionData[]
}

const initialState: CompanyState = {
    companies: [],
    logInAttempts: 0
}

export const IntegrityId = "53beceb7-054b-4740-830f-98a1dc0cc991"; //We should probably change how we handle this in the future

export const getCompanyInfo = createAsyncThunk(
    'companies/getCompanyInfo',
    async (args: GetCompanyInfoRequest, {dispatch}) => {
        const response = await GetCompanyInfo(args);
        const companyInfo = response.info;
        
        if (response.status.toUpperCase().includes('FAILED'))
            throw Error;

        let users: User[] = [];
        let companies: Company[] = [];
        for(const info of companyInfo)
        {
            let company: Company = {id: info.id, name: info.companyName, initiatives: []};
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
                for(const initiative of info.initiatives)
                {
                  company.initiatives.push(initiative);
                }
            }
        }
        dispatch(addUsersToStore(users));

        return companies;
    }
)

export const upsertCompanyInfo = createAsyncThunk(
  'companies/upsertCompanyInfo',
  async (args: UpsertCompanyInfoRequest, {dispatch}): Promise<Company> => {
      const response = await UpsertCompanyInfo(args);
      
    if (response.status.toUpperCase().includes('FAILED'))
      throw Error;
    let newId = response.id;
    let newCompany: Company = JSON.parse(JSON.stringify(args.company));
    newCompany.id = newId;
    
    let newUser: User = JSON.parse(JSON.stringify(args.employee));
    newUser.companyId = newId;
    newUser.id = newId;   //this stinks; consider having just one id property if they're just going to be identical

    dispatch(addUsersToStore([newUser]));

    return newCompany;
  }
)

export const upsertInitiativeInfo = createAsyncThunk(
  'companies/upsertInitiativesInfo',
  async (args: UpsertInitiativeInfoRequest, {}): Promise<{initiative: Initiative, companyId: string}> => {
    const response = await UpsertInitiativeInfo(args);

    if(response.status.toUpperCase().includes('FAILED'))
      throw Error;
    
    let newInitiative: Initiative = JSON.parse(JSON.stringify(args.initiative));
    newInitiative.id = response.initiativeId;
    return {initiative: newInitiative, companyId: args.companyId};
  }
)

export const upsertThroughputData = createAsyncThunk(
  'companies/upsertThroughputInfo',
  async (args: UpsertThroughputDataRequest, {}): Promise<{initiativeId: string, companyId: string, data: ThroughputData[]}> => {
    const response = await UpsertThroughputData(args);

    if(response.status.toUpperCase().includes('FAILED'))
      throw Error;

    return {initiativeId: args.initiativeId, companyId: args.companyId, data: args.itemsCompletedOnDate};
  }
)

export const upsertDecisionData = createAsyncThunk(
  'companies/upsertDecisionData',
  async (args: UpsertDecisionDataRequest, {}): Promise<{initiativeId: string, companyId: string, data: DecisionData[]}> => {
    const response = await UpsertDecisionData(args);

    if(response.status.toUpperCase().includes('FAILED'))
      throw Error;

    for(const pair of response.idMap)
    {
      let oldId = pair[0];
      let newId = pair[1];
      let decisionIndex = args.decisions.findIndex(d => d.id === oldId);
      args.decisions[decisionIndex].id = newId;
    }

    return {initiativeId: args.initiativeId, companyId: args.companyId, data: args.decisions};
  }
)

export const deleteDecisionData = createAsyncThunk(
  'companies/deleteDecisionData',
  async (args: DeleteDecisionDataRequest, {}) => {
    const response = await DeleteDecisionData(args);

    if(response.status.toUpperCase().includes('FAILED'))
      throw Error;
  
  }
)

export const authenticateUser = createAsyncThunk(
  'companies/userAuthentication',
  async (args: AuthenticateUserRequest, {dispatch, getState}) => {
    const response = await AuthenticateUser(args);
    
    if(response.status.toUpperCase().includes("FAILED"))
      throw Error;
    
    const companyId = response.companyId;
    if(companyId !== IntegrityId)   //Admins see all
      dispatch(getCompanyInfo({companyId: companyId}));
    else
      dispatch(getCompanyInfo({companyId: "-1"}));
    dispatch(setCurrentUserId(companyId));
  }
)

export const companySlice = createSlice({
    name: "companies",
    initialState: initialState,
    reducers: {
      clearCompanies: (state) => {
        state.companies = [];
      }
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
            .addCase(upsertCompanyInfo.fulfilled, (state, action) => {
                const newCompany = action.payload;
                const companyIndex = state.companies.findIndex(company => company.id === newCompany.id);
                if(companyIndex > -1)
                    state.companies.splice(companyIndex, 1);
                state.companies.push(newCompany);
            })
            .addCase(upsertInitiativeInfo.fulfilled, (state, action) => {
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
            .addCase(upsertThroughputData.fulfilled, (state, action) => {
              const companyId = action.payload.companyId;
              const initiativeId = action.payload.initiativeId.toString();
              const matchingCompany = state.companies.find(company => company.id === companyId);
              if(matchingCompany)
              {
                const matchingInit = matchingCompany.initiatives.find(init => init.id === initiativeId);
                if(matchingInit)
                {
                  const throughputClone: ThroughputData[] = JSON.parse(JSON.stringify(matchingInit.itemsCompletedOnDate));
                  for(const item of action.payload.data)
                  {
                    const itemIndex = throughputClone.findIndex(entry => 
                      entry.date.month === item.date.month &&
                      entry.date.day === item.date.day &&
                      entry.date.year === item.date.year);

                    if(itemIndex > -1)
                      throughputClone[itemIndex].itemsCompleted = item.itemsCompleted;
                    else
                      throughputClone.push(item);
                  }
                  matchingInit.itemsCompletedOnDate = throughputClone.filter(data => data.itemsCompleted !== 0);
                }
              }
            })
            .addCase(upsertDecisionData.fulfilled, (state, action) => {
              const companyId = action.payload.companyId;
              const initiativeId = action.payload.initiativeId.toString();
              const matchingCompany = state.companies.find(company => company.id === companyId);
              if(matchingCompany)
              {
                const matchingInit = matchingCompany.initiatives.find(init => init.id === initiativeId);
                if(matchingInit)
                {
                  const decisionsClone: DecisionData[] = JSON.parse(JSON.stringify(matchingInit.decisions));
                  for(const data of action.payload.data)
                  {
                    const dataIndex = decisionsClone.findIndex(entry => data.id === entry.id);

                    if(dataIndex > -1)
                      decisionsClone[dataIndex] = data;
                    else
                      decisionsClone.push(data);
                  }
                  matchingInit.decisions = decisionsClone;
                }
              }
            })
            .addCase(deleteDecisionData.fulfilled, (state, action) => {
              const companyId = action.meta.arg.companyId;
              const initiativeId = action.meta.arg.initiativeId.toString();
              const matchingCompany = state.companies.find(company => company.id === companyId);
              if(matchingCompany)
              {
                const matchingInit = matchingCompany.initiatives.find(init => init.id === initiativeId);
                if(matchingInit)
                {
                  const decisionsClone: DecisionData[] = JSON.parse(JSON.stringify(matchingInit.decisions));
                  for(const decisionId of action.meta.arg.decisionIds)
                  {
                    const dataIndex = decisionsClone.findIndex(entry => decisionId === entry.id);

                    if(dataIndex > -1)
                      decisionsClone.splice(dataIndex,1);
                  }
                  matchingInit.decisions = decisionsClone;
                }
              }
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
              state.logInAttempts = 0;
            })
            .addCase(authenticateUser.rejected, (state, action) => {
              state.logInAttempts++;
            })
    }
});

export const { clearCompanies } = companySlice.actions;

export const selectAllCompanies = (state: RootState) => state.companies.companies;
export const selectLogInAttempts = (state: RootState) => state.companies.logInAttempts;

export default companySlice.reducer;