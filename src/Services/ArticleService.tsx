import axios from "axios";
import { BASE_URL } from "./Http";
import { Article } from "../Store/ArticleSlice";

export interface GetArticleRequest {
  companyId: string
  initiativeId?: string
  userCompanyId: string
}

interface GetArticleResponse {
  articles: Article[]
}

export async function GetArticle(request: GetArticleRequest) : Promise<GetArticleResponse>
{
  let baseUrl = BASE_URL + "GetArticle?code=JHoMZaryOQsvt6NyHcyxEQaWTRYOlyh1NX4UFTgM9BscAzFu5Xv1EA==";
  let response = await axios.post(baseUrl,request);
  return response.data;
}

export interface UpsertArticleRequest {
  articles: Article[]
  isTest: boolean
}

interface UpsertArticleResponse {
  status: string
}

export async function UpsertArticle(request: UpsertArticleRequest) : Promise<UpsertArticleResponse>
{
  let baseUrl = BASE_URL + "UpsertArticle?code=dbvizt0B4iMUOzdpJ6HkLURMc8fg_Qzv8e1sn3hnJQ0KAzFuwwOZbw==";
  let response = await axios.post(baseUrl,request);
  return response.data;
}
