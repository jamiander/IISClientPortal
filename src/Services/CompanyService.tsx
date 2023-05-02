import axios from "axios";
import { Company, Initiative } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice";
import { BASE_URL } from "./Http";

interface EmployeeInfo {
  employeeId: string,
  employeeEmail: string,
  employeePassword: string
}

export interface DateInfo {
  month: number,
  day: number,
  year: number
}

export interface CompanyInfo {
  id: string,
  companyName: string,
  employeeInfo: EmployeeInfo,
  initiatives?: Initiative[]
}

export interface ThroughputData {
  date: DateInfo,
  itemsCompleted: number
}

export interface DecisionData {
  id: number,
  description: string,
  resolution: string,
  participants: string[],
  date: DateInfo
}

export interface GetCompanyInfoRequest {
  companyId?: string,
  employeeId?: number
}

interface GetCompanyInfoResponse {
  info: CompanyInfo[],
  status: string
}

export async function GetCompanyInfo(request?: GetCompanyInfoRequest) : Promise<GetCompanyInfoResponse> {
  let baseUrl = BASE_URL + "GetCompanyDataDB?code=yxbqHLA5Vp_XyQwwR8TrGLamOrTxv9Dbqw53RhEOYy9CAzFuckblhQ==";

  let query = [];/*
  if (request)
  {
    if (request.companyId !== undefined) query.push(`companyId=${request.companyId}`);
    if (request.employeeId !== undefined) query.push(`employeeId=${request.employeeId}`);

    if (query.length > 0) baseUrl += "&" + query.join("&");
  }*/

  let req = {
    companyId: (request?.companyId ?? -1).toString(),
    employeeId: (request?.employeeId ?? -1).toString(),
  }

  let response = await axios.post(baseUrl,req)//get(baseUrl); //using post since I couldn't get query parameters to work with the cosmos sql
  return response.data;
}

export interface UpsertCompanyInfoRequest {
  company: Company,
  employee: User,
  isTest: boolean
}

interface UpsertCompanyInfoResponse {
  id: string,
  status: string
}

export async function UpsertCompanyInfo(request: UpsertCompanyInfoRequest) : Promise<UpsertCompanyInfoResponse> {
  const company = request.company;
  const employee = request.employee;
  const isTest = request.isTest;
  
  const info: CompanyInfo = {
    id: company.id.toString(),
    companyName: company.name,
    employeeInfo: {
      employeeId: employee.id.toString(),
      employeeEmail: employee.email,
      employeePassword: employee.password
    },
  }

  let baseUrl = BASE_URL + "AddCompanyDataDB?code=Hu3y-USXm491pUrvMF-jQVFDMQvazAvfxEq9pAp58LhWAzFu7kjFvQ==";

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
  let baseUrl = BASE_URL + "AddInitiativeDataDB?code=Myq5EJ7IUzofxs4iufiWIiprJxBmItjWZXG9zoTbnwcpAzFu-ZD83w==";

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
  initiativeId: number,
  itemsCompletedOnDate: ThroughputData[]
}

interface UpsertThroughputDataResponse {
  status: string
}

export interface UpsertDecisionDataRequest {
  isTest: boolean,
  companyId: string,
  initiativeId: number,
  decisions: DecisionData[]
}

interface UpsertDecisionDataResponse {
  status: string,
  idMap: [[number,number]]
}

export interface DeleteDecisionDataRequest {
  isTest: boolean,
  companyId: string,
  initiativeId: number,
  decisionIds: number[]
}

interface DeleteDecisionDataResponse {
  status: string
}

export async function UpsertThroughputData(request: UpsertThroughputDataRequest) : Promise<UpsertThroughputDataResponse>
{
  let baseUrl = BASE_URL + "AddThroughputDataDB?code=7zfSWKR3W3-8WhgYqHm-8k50IZY6TdtJ_3ylenab25OoAzFuFzdQLA==";

  const response = await axios.post(baseUrl,request);
  return response.data;
}

export async function UpsertDecisionData(request: UpsertDecisionDataRequest) : Promise<UpsertDecisionDataResponse>
{
  let baseUrl = BASE_URL + "AddDecisionDataDB?code=vg1Gfo79pB09asPWVpH-lNaXbl3KTux5RuuMy741kmqIAzFuHnJFvg==";

  const response = await axios.post(baseUrl,request);
  return response.data;
}

export async function DeleteDecisionData(request: DeleteDecisionDataRequest) : Promise<DeleteDecisionDataResponse>
{
  let baseUrl = BASE_URL + "DeleteDecisionDataDB?code=W_thQCwjUyvN_AsTbRgkXmFkNx6oJ26cV8mQQBTJW5QJAzFu0f9log==";
  const response = await axios.delete(baseUrl, { data: request});
  console.log(response.data);
  return response.data;
}

export interface AuthenticateUserRequest {
  creds: {
    username: string,
    password: string
  }
}

interface AuthenticateUserResponse {
  companyId: string,
  status: string
}

export async function AuthenticateUser(request: AuthenticateUserRequest) : Promise<AuthenticateUserResponse>
{
  let baseUrl = BASE_URL + "UserAuthentication?code=iqcIvAsZ41saejn9tQunqf70l-WeFVqYz62IGmKCLiu2AzFuLOqw7g==";

  const response = await axios.post(baseUrl,request);
  return response.data;
}
