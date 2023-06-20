import axios from "axios";
import { Company, Initiative } from "../Store/CompanySlice";
import { BASE_URL } from "./Http";

export interface DateInfo {
  month: number,
  day: number,
  year: number
}

export interface CompanyInfo {
  id: string,
  companyName: string,
  initiatives?: Initiative[]
}

export interface ThroughputData {
  date: DateInfo,
  itemsCompleted: number
}

export interface DecisionData {
  id: string,
  description: string,
  resolution: string,
  participants: string,
  date: DateInfo
}

export interface GetCompanyByIdRequest {
  companyId?: string
}

interface GetCompanyByIdResponse {
  info: CompanyInfo[],
  status: string
}

export async function GetCompanyById(request?: GetCompanyByIdRequest) : Promise<GetCompanyByIdResponse> {
  let baseUrl = BASE_URL + "GetCompanyDataDB?code=yxbqHLA5Vp_XyQwwR8TrGLamOrTxv9Dbqw53RhEOYy9CAzFuckblhQ==";

  let req = {
    companyId: request?.companyId ?? "-1",
  }

  let response = await axios.post(baseUrl,req)
  return response.data;
}

export interface GetCompanyByInitiativeIdsRequest {
  initiativeIds: string[],
  isAdmin: boolean,
  companyId: string
}

interface GetCompanyByInitiativeIdsResponse {
  companies: CompanyInfo[],
  status: string
}

export async function GetCompanyByInitiativeIds(request: GetCompanyByInitiativeIdsRequest) : Promise<GetCompanyByInitiativeIdsResponse>
{
  let baseUrl = BASE_URL + "GetCompanyByInitiativeIds?code=Lj4J8iPJp7cWh6dJ21oZp2gAk_F0WdjRVQzXH8wXs8qfAzFuwV-vxA=="//"GetCompanyDataByInitiativeIds?code=wcatNw26L7SrWt4WmlVv7e78esr3_zfmD-TFDDiXSzgOAzFuKl1EOQ==";

  let response = await axios.post(baseUrl,request);
  return response.data;
}

export interface UpsertCompanyInfoRequest {
  company: Company,
  isTest: boolean
}

interface UpsertCompanyInfoResponse {
  id: string,
  status: string
}

export async function UpsertCompanyInfo(request: UpsertCompanyInfoRequest) : Promise<UpsertCompanyInfoResponse> {
  const company = request.company;
  const isTest = request.isTest;
  
  const info: CompanyInfo = {
    id: company.id,
    companyName: company.name
  }

  let baseUrl = BASE_URL + "UpsertCompany?code=0JYI46YvF4B_jZ85-lydrEhkvhK4OsAVJQ8m9IOwvlyhAzFuC6gIaw=="//"AddCompanyDataDB?code=Hu3y-USXm491pUrvMF-jQVFDMQvazAvfxEq9pAp58LhWAzFu7kjFvQ==";

  let response = await axios.post(baseUrl, {company: info, isTest: isTest});
  return response.data;
}

export interface UpsertInitiativeInfoRequest {
  initiative: Initiative,
  companyId: string,
  isTest: boolean
}

interface UpsertInitiativeInfoResponse {
  initiativeId: string,
  status: string
}

export async function UpsertInitiativeInfo(request: UpsertInitiativeInfoRequest) : Promise<UpsertInitiativeInfoResponse> { 
  let baseUrl = BASE_URL + "UpsertInitiative?code=mbc_NA3iZRAOA2p9ZpIHEkVVM6p5iH_oJiWCDIojWKgtAzFuE0Y1nQ=="//"AddInitiativeDataDB?code=Myq5EJ7IUzofxs4iufiWIiprJxBmItjWZXG9zoTbnwcpAzFu-ZD83w==";

  let response = await axios.post(baseUrl, {initiative: request.initiative, companyId: request.companyId, isTest: request.isTest});
  return response.data;
}

export function FindItemsRemaining(initiative: Initiative | undefined) {
  if(initiative)
  {
    const itemsCompleted = initiative.itemsCompletedOnDate.map((item) => item.itemsCompleted);
    let totalItemsCompleted = 0;

    itemsCompleted.forEach((num) => totalItemsCompleted += num);
    return initiative.totalItems - totalItemsCompleted;
  }
  return NaN;
}

export interface UpsertThroughputDataRequest {
  isTest: boolean,
  companyId: string,
  initiativeId: string,
  itemsCompletedOnDate: ThroughputData[]
}

interface UpsertThroughputDataResponse {
  status: string
}

export async function UpsertThroughputData(request: UpsertThroughputDataRequest) : Promise<UpsertThroughputDataResponse>
{
  let baseUrl = BASE_URL + "UpsertThroughput?code=s8KUWDvJuOMxeIieJvnbNyZkV7XNNpChqQ3bSzjRr7KbAzFuHfLxgA==&clientId=default"//"AddThroughputDataDB?code=7zfSWKR3W3-8WhgYqHm-8k50IZY6TdtJ_3ylenab25OoAzFuFzdQLA==";

  const response = await axios.post(baseUrl,request);
  return response.data;
}

export interface UpsertDecisionDataRequest {
  isTest: boolean,
  companyId: string,
  initiativeId: string,
  decisions: DecisionData[]
}

interface UpsertDecisionDataResponse {
  decisionId: string,
  status: string
}


export async function UpsertDecisionData(request: UpsertDecisionDataRequest) : Promise<UpsertDecisionDataResponse>
{
  let baseUrl = BASE_URL + "UpsertDecision?code=riMxKLGMhqFJkkU7__gRG7zAh6LNofdmSkYFyoeCQIl7AzFuURByhg=="//"AddDecisionDataDB?code=vg1Gfo79pB09asPWVpH-lNaXbl3KTux5RuuMy741kmqIAzFuHnJFvg==";

  const response = await axios.post(baseUrl,request);
  return response.data;
}

export interface DeleteDecisionDataRequest {
  isTest: boolean,
  companyId: string,
  initiativeId: string,
  decisionIds: string[]
}

interface DeleteDecisionDataResponse {
  status: string
}

export async function DeleteDecisionData(request: DeleteDecisionDataRequest) : Promise<DeleteDecisionDataResponse>
{
  let baseUrl = BASE_URL + "DeleteDecision?code=WJEB3bQS72oj6vvMyO1iXBQbnQHGG4_HXUF5GxtBfE-HAzFu2ONMkQ=="//"DeleteDecisionDataDB?code=W_thQCwjUyvN_AsTbRgkXmFkNx6oJ26cV8mQQBTJW5QJAzFu0f9log==";
  const response = await axios.delete(baseUrl, { data: request});
  return response.data;
}
