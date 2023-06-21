import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetArticle, GetArticleRequest, UpsertArticle, UpsertArticleRequest } from "../Services/ArticleService";
import { MakeClone } from "../Services/Cloning";
import { RootState } from "./Store";
import { DateInfo } from "../Services/CompanyService";

export interface Article {
  id: string
  title: string
  text: string
  updatedDate: DateInfo
  updatedBy: string
  companyId: string
  initiativeId?: string 
  isIntegrityOnly: boolean
}  

export interface ArticleState {
  articles: Article[]
}

const initialState: ArticleState = {
  articles: []
}

export const getArticle = createAsyncThunk(
  'articles/getArticle',
  async (args: GetArticleRequest) => {
    const response = await GetArticle(args);
    const articles = response.articles;
    
    return articles;
  }
)

export const upsertArticle = createAsyncThunk(
  'articles/upsertArticle',
  async (args: UpsertArticleRequest) => {
    const response = await UpsertArticle(args);

    if(response.status.toUpperCase().includes("FAILED"))
      throw new Error(response.status);

    return MakeClone(args.articles);
  }
)

export const articleSlice = createSlice({
  name: "articles",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticle.fulfilled, (state, action) => {
        const newArticles = action.payload;
        state.articles = newArticles;
      })
      .addCase(upsertArticle.fulfilled, (state, action) => {
        const newArticles = action.payload;
        for(const article of newArticles)
        {
          const articleIndex = state.articles.findIndex(a => a.id === article.id);
          if(articleIndex > -1)
            state.articles.splice(articleIndex,1,article);
          else
            state.articles.push(article);
        }
      })
  }
});

export const {  } = articleSlice.actions;

export const selectAllArticles = (state: RootState) => state.articles.articles;

export default articleSlice.reducer;