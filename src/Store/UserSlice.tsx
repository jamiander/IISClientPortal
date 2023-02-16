import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddUser, GetAllUsers } from "../Services/UserService";
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

export const addUser = createAsyncThunk(
    'users/addUser',
    async (user: User) : Promise<User> => {
        const newId = await AddUser({user:user});
        return {
            id: newId,
            email: user.email,
            password: user.password,
            companyId: user.companyId,
            name: user.name,
            phoneNumber: user.phoneNumber
        };
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
            .addCase(addUser.fulfilled, (state, action) => {
                let existingUser = state.users.find(user => user.id === action.payload.id);
                if(!existingUser)
                    state.users.push(action.payload);
                else
                    existingUser = action.payload;
            })
    },
});

export const { setCurrentUserId, signOut } = userSlice.actions;

export const selectAllUsers = (state: RootState) => state.users.users;
export const selectCurrentUser = (state: RootState) => state.users.users.find((user: User) => user.id === state.users.currentUserId);
export const selectIsLoggedIn = (state:RootState) => state.users.currentUserId !== -1;

export default userSlice.reducer;
