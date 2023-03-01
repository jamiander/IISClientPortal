import axios from "axios";
import { Company, Initiative } from "../Store/CompanySlice";
import { User } from "../Store/UserSlice";
import { BASE_URL } from "./Http";

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
  initiatives?: Initiative[]
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
    //no initiatives; this should be handled by the UpdateInitiativeInfo() method
  }

  let baseUrl = BASE_URL + "AddCompanyDataDB?code=Hu3y-USXm491pUrvMF-jQVFDMQvazAvfxEq9pAp58LhWAzFu7kjFvQ==";

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
  let baseUrl = BASE_URL + "AddInitiativeDataDB?code=Myq5EJ7IUzofxs4iufiWIiprJxBmItjWZXG9zoTbnwcpAzFu-ZD83w==";

  let response = await axios.post(baseUrl, {initiative: request.initiative, companyId: request.companyId, isTest: request.isTest});
  return response.data;
}

export function FindItemsRemaining(initiative: Initiative)  {
  const itemsCompleted = initiative.itemsCompletedOnDate.map((item) => item.itemsCompleted);
  let totalItemsCompleted = 0;

  itemsCompleted.forEach((num) => totalItemsCompleted += num);
  return initiative.totalItems - totalItemsCompleted;
}