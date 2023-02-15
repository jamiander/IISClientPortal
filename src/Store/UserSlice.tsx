import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
}

const initialState: UserState = {
    users: []
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

    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserData.fulfilled, (state, action) => {
                state.users = action.payload;
            })
    },
});

export const { } = userSlice.actions;

export const selectAllUsers = (state: RootState) => state.users.users;

export default userSlice.reducer;
