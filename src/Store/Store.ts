import { configureStore } from '@reduxjs/toolkit';
import companySlice from './CompanySlice';
import userSlice from './UserSlice';
import documentSlice from './DocumentSlice';
import articleSlice from './ArticleSlice';

export const store = configureStore({
    reducer: {
            users: userSlice,
            companies: companySlice,
            documents: documentSlice,
            articles: articleSlice,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;