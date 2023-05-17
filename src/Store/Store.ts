import { configureStore } from '@reduxjs/toolkit';
import companySlice from './CompanySlice';
import userSlice from './UserSlice';
import documentSlice from './DocumentSlice';

export const store = configureStore({
    reducer: {
            users: userSlice,
            companies: companySlice,
            documents: documentSlice,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;