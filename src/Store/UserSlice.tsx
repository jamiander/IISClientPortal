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

interface AddUserArgs {
    user: User,
    isTest: boolean
}

export const addUser = createAsyncThunk(
    'users/addUser',
    async (args: AddUserArgs) : Promise<User> => {
        const response = await AddUser({user: args.user, isTest: args.isTest});
        const status = response.status;
        console.log(status);
        if(status.toUpperCase().includes('SUCCESS'))
        {
            let newUser = JSON.parse(JSON.stringify(args.user));
            newUser.id = response.id;
            return newUser;
        }
        throw Error
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
