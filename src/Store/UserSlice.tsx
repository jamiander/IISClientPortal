import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetAllUsers } from "../Services/UserService";
import { RootState } from "./Store";

export interface User {
    id: number
    email: string
    password: string
    companyId: number
    name?: string
    phoneNumber?: string
}

export interface UserState{
    users: User[]
    currentUserId: number
}

const initialState: UserState = {
    users: [],
    currentUserId: -1
}

export const getUserData = createAsyncThunk(
    'users/getUserData',
    async () => {
        const response = await GetAllUsers();
        return response;
    }
)

export const userSlice = createSlice({
    name: "users",
    initialState: initialState,
    reducers: {
        setCurrentUserId: (state, action: PayloadAction<number>) => {
            let id = action.payload;
            if(state.users.find((user: User) => user.id === id))
                state.currentUserId = action.payload;
            else
                state.currentUserId = -1;
        },
        signOut:(state)=>{
            state.currentUserId = -1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserData.fulfilled, (state, action) => {
                state.users = action.payload;
            })
    },
});

export const { setCurrentUserId, signOut } = userSlice.actions;

export const selectAllUsers = (state: RootState) => state.users.users;
export const selectCurrentUser = (state: RootState) => state.users.users.find((user: User) => user.id === state.users.currentUserId);
export const selectIsLoggedIn = (state:RootState) => state.users.currentUserId !== -1;

export default userSlice.reducer;
