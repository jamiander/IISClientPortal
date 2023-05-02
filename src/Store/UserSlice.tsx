import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import { clearCompanies } from "./CompanySlice";

export interface User {
    id: string
    email: string
    password: string
    companyId: string
    name?: string
    phoneNumber?: string
}

export interface UserState{
    users: User[]
    currentUserId: string
}

const initialState: UserState = {
    users: [],
    currentUserId: "-1"
}

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
    extraReducers: (builder) => {},
});

export const { setCurrentUserId, signOut, addUsersToStore } = userSlice.actions;

export const selectAllUsers = (state: RootState) => state.users.users;
export const selectCurrentUser = (state: RootState) => state.users.users.find((user: User) => user.id === state.users.currentUserId);
export const selectCurrentUserId = (state: RootState) => state.users.currentUserId;
export const selectIsLoggedIn = (state:RootState) => state.users.currentUserId !== "-1";

export default userSlice.reducer;
