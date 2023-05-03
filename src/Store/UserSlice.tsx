import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import { clearCompanies, getCompanyByInitiativeIds, IntegrityId } from "./CompanySlice";
import { AuthenticateUser, AuthenticateUserRequest, GetUserById, GetUserByIdRequest } from "../Services/UserService";

export interface User {
    id: string
    email: string
    password: string
    companyId: string
    initiativeIds?: string[]
    name?: string
    phoneNumber?: string
}

export interface UserState{
    users: User[]
    currentUserId: string
    logInAttempts: number
}

const initialState: UserState = {
    users: [],
    currentUserId: "-1",
    logInAttempts: 0
}

export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (args: GetUserByIdRequest, {dispatch}) => {
    const response = await GetUserById(args);
    
    if(response.status.toUpperCase().includes("FAILED"))
      throw Error;
    
    const users = response.users;
    dispatch(addUsersToStore(users));
  }
)

export const authenticateUser = createAsyncThunk(
  'users/authenticateUser',
  async (args: AuthenticateUserRequest, {dispatch, getState}) => {
    const response = await AuthenticateUser(args);
    
    if(response.status.toUpperCase().includes("FAILED"))
      throw Error;
    
    const companyId = response.companyId;
    if(companyId !== IntegrityId)   //Admins see all
      dispatch(getCompanyByInitiativeIds({initiativeIds: response.initiativeIds}));
    else
      dispatch(getCompanyByInitiativeIds({initiativeIds: []}));
    dispatch(setCurrentUserId(companyId));
  }
)

export const userSlice = createSlice({
    name: "users",
    initialState: initialState,
    reducers: {
        setCurrentUserId: (state, action: PayloadAction<string>) => {
            let id = action.payload;
            //if(state.users.find((user: User) => user.id === id))
                state.currentUserId = action.payload;
            //else
              //  state.currentUserId = -1;
        },
        signOut: (state) => {
            state.currentUserId = "-1";
            state.users = [];
        },
        addUsersToStore: (state, action: PayloadAction<User[]>) => {
            let newUsers = action.payload;
            for(const user of newUsers)
            {
                let userIndex = state.users.findIndex(u => u.id === user.id);
                if(userIndex > -1)
                    state.users.splice(userIndex, 1);

                state.users.push(user);
            }
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(authenticateUser.fulfilled, (state, action) => {
          state.logInAttempts = 0;
        })
        .addCase(authenticateUser.rejected, (state, action) => {
          state.logInAttempts++;
        })
    },
});

export const { setCurrentUserId, signOut, addUsersToStore } = userSlice.actions;

export const selectAllUsers = (state: RootState) => state.users.users;
export const selectCurrentUser = (state: RootState) => state.users.users.find((user: User) => user.id === state.users.currentUserId);
export const selectCurrentUserId = (state: RootState) => state.users.currentUserId;
export const selectIsLoggedIn = (state:RootState) => state.users.currentUserId !== "-1";
export const selectLogInAttempts = (state: RootState) => state.users.logInAttempts;

export default userSlice.reducer;
