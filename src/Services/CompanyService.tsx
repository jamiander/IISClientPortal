import axios from "axios";
import { Company, Initiative } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice";
import { BASE_URL } from "./Http";

/*interface GetAllCompaniesRequest {
  id?: number,
  name?: string
}

export async function GetAllCompanies(request?: GetAllCompaniesRequest) : Promise<Company[]> {
  let baseUrl = BASE_URL + "GetCompanyBlob?code=_8QdLaD5ssAgZt0-H4e7K4WgEI-RVxuTQ3qeMMSRq-PiAzFu39mM2Q==";

  let query = [];
  if (request)
  {
    if (request.id !== undefined) query.push(`id=${request.id}`);
    if (request.name !== undefined) query.push(`name=${request.name}`);

    if (query.length > 0) baseUrl += "&" + query.join("&");
  }

  let response = await axios.get(baseUrl);
  return response.data;
}

export interface AddCompanyRequest {
  company: Company,
  isTest: boolean
}

interface AddCompanyResponse {
  id: number,
  status: string
}

export async function AddCompany(request?: AddCompanyRequest) : Promise<AddCompanyResponse> {
  let baseUrl = BASE_URL + "AddCompanyBlob?code=20f81kJNWLkzF8bRRY5tUMOYggSA2iEWB1kgUZE_reYfAzFu-V801Q==";

  let response = await axios.post(baseUrl, request);
  return response.data;
}*/

interface EmployeeInfo {
  employeeId: string//number,
  employeeEmail: string,
  employeePassword: string
}

export interface DateInfo {
  month: string,
  day: string,
  year: string
}

export interface CompanyInfo {
  //companyId: number,
  id: string,
  companyName: string,
  employeeInfo: EmployeeInfo,
  initiatives?: any //not sure how to represent this, since the key is dynamic { "<id string>": InitiativeObject{} }
}

export interface GetCompanyInfoRequest {
  companyId?: number,
  employeeId?: number
}

interface GetCompanyInfoResponse {
  info: CompanyInfo[],
  status: string
}

export async function GetCompanyInfo(request?: GetCompanyInfoRequest) : Promise<GetCompanyInfoResponse> {
  let baseUrl = BASE_URL + "GetCompanyDataDB?code=yxbqHLA5Vp_XyQwwR8TrGLamOrTxv9Dbqw53RhEOYy9CAzFuckblhQ=="//"GetCompanyData?code=1HsP_rZR0qd4PKt7Z7NyV7RQxSQWpMq9mirkMKg3ZNBcAzFuCCfxTQ==";

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

export interface UpdateCompanyInfoRequest {
  company: Company,
  employee: User,
  isTest: boolean
}

interface UpdateCompanyInfoResponse {
  id: string,//number,
  status: string
}

export async function UpdateCompanyInfo(request: UpdateCompanyInfoRequest) : Promise<UpdateCompanyInfoResponse> {
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
    //no initiatives; this shoulbe be handled by the UpdateInitiativeInfo() method
  }

  let baseUrl = BASE_URL + "AddCompanyDataDB?code=Hu3y-USXm491pUrvMF-jQVFDMQvazAvfxEq9pAp58LhWAzFu7kjFvQ=="//"AddCompanyData?code=WkVKzojbAuWrWSmQVvYWKiG_iD9R4S_-7wp3xsE1SuOhAzFuEJk5oQ==";

  let response = await axios.post(baseUrl, {company: info, isTest: isTest});
  return response.data;
}

export interface UpdateInitiativeInfoRequest {
  initiative: Initiative,
  companyId: string//number,
  isTest: boolean
}

interface UpdateInitiativeInfoResponse {
  initiativeId: string//number,
  status: string
}

export async function UpdateInitiativeInfo(request: UpdateInitiativeInfoRequest) : Promise<UpdateInitiativeInfoResponse> { 
  let baseUrl = BASE_URL + "AddInitiativeDataDB?code=Myq5EJ7IUzofxs4iufiWIiprJxBmItjWZXG9zoTbnwcpAzFu-ZD83w=="//AddInitiativeData?code=j8g7WVHgX7VVQXnN6__iUKZptpUbmZfdiBjmm9K2aRDpAzFuBMcYaw==";

  let response = await axios.post(baseUrl, {initiative: request.initiative, companyId: request.companyId, isTest: request.isTest});
  return response.data;
}

export function FindItemsRemaining(initiative: Initiative)  {
  const itemsCompleted = initiative.itemsCompletedOnDate.map((item) => item.itemsCompleted);
  let totalItemsCompleted = 0;

  itemsCompleted.forEach((num) => totalItemsCompleted += num);
  return initiative.totalItems - totalItemsCompleted;
}