import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import { getCompanyByInitiativeIds } from "./CompanySlice";
import { AuthenticateUser, AuthenticateUserRequest, DeleteUserInfo, DeleteUserInfoRequest, GetUserById, GetUserByIdRequest, UpsertUserInfo, UpsertUserInfoRequest } from "../Services/UserService";

export interface User {
  id: string
  email: string
  password: string
  companyId: string
  initiativeIds: string[]
  isAdmin: boolean
  isActive: boolean
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

    return users;
  }
)

export const upsertUserInfo = createAsyncThunk(
  'users/upsertUser',
  async (args: UpsertUserInfoRequest, {dispatch}): Promise<User[]> => {
    const response = await UpsertUserInfo(args);

    if (response.status.toUpperCase().includes('FAILED'))
      throw Error;

    let newUsers: User[] = JSON.parse(JSON.stringify(args.users));
    dispatch(addUsersToStore(newUsers));
    return args.users;
  }
)

export const deleteUserInfo = createAsyncThunk(
  'users/deleteUser',
  async (args: DeleteUserInfoRequest, {dispatch}) => {
    const response = await DeleteUserInfo(args);

    if(response.status.toUpperCase().includes("FAILED"))
      throw Error;
    
    return args.userId;
  }
)

export const authenticateUser = createAsyncThunk(
  'users/authenticateUser',
  async (args: AuthenticateUserRequest, {dispatch, getState}) => {
    const response = await AuthenticateUser(args);
    
    if(response.status.toUpperCase().includes("FAILED"))
      throw Error;
    
    const user: User = {
      id: response.userId,
      email: args.creds.username,
      password: args.creds.password,
      initiativeIds: response.initiativeIds,
      companyId: response.companyId,
      isAdmin: response.isAdmin,
      isActive: response.isActive
    }
    await dispatch(getCompanyByInitiativeIds({
      initiativeIds: response.initiativeIds,
      isAdmin: response.isAdmin,
      companyId: response.companyId
    }));
    dispatch(addUsersToStore([user]));
    dispatch(setCurrentUserId(response.userId));
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
        .addCase(deleteUserInfo.fulfilled, (state, action) => {
          const userId = action.payload;
          const usersClone: User[] = JSON.parse(JSON.stringify(state.users));
          const dataIndex = usersClone.findIndex(entry => userId === entry.id);

          if(dataIndex > -1) usersClone.splice(dataIndex,1);
          state.users = usersClone;
        })
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
