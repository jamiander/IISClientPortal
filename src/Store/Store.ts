import { configureStore } from '@reduxjs/toolkit';
import companySlice from './CompanySlice';
import userSlice from './UserSlice';

export const store = configureStore({
    reducer: {
            users: userSlice,
            companies: companySlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;