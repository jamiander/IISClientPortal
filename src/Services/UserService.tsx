import axios from "axios";
import { BASE_URL } from "./Http";
import { User } from "../Store/UserSlice";

export interface GetUserByIdRequest {
  userId?: string
  companyId?: string
}

interface GetUserByIdResponse {
  users: User[],
  status: string
}

export async function GetUserById(request: GetUserByIdRequest) : Promise<GetUserByIdResponse>
{
  let baseUrl = BASE_URL + "GetUserData?code=hl9AyWCStkzMXWiAnBlIqVe3UQnbdbU5IHSNsuuHTLwlAzFuraK-gw==";

  const response = await axios.post(baseUrl,request);
  return response.data;
}

export interface UpsertUserInfoRequest {
  isTest: boolean,
  users: User[]
}

interface UpsertUserInfoResponse {
  userId: string,
  status: string
}

export async function UpsertUserInfo(request: UpsertUserInfoRequest) : Promise<UpsertUserInfoResponse> {
  let baseUrl = BASE_URL + "AddUserData?code=0DxuosCHuDX2GjYbeUu0aqu45wAg95xIAf4B2ecRjO-vAzFu3q_cJQ==";
  const response = await axios.post(baseUrl,request);
  return response.data;
}

export interface DeleteUserInfoRequest {
  userId: string,
  isTest: boolean
}

interface DeleteUserInfoResponse {
  status: string
}

export async function DeleteUserInfo(request: DeleteUserInfoRequest) : Promise<DeleteUserInfoResponse> {
  let baseUrl = BASE_URL + "DeleteUserData?code=IEWMcaPAbEmpSopN_hCw-ltu09BWB8bKbkIkahtQj_tDAzFuPGcLYA==";
  const response = await axios.delete(baseUrl,{data: request});
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
  initiativeIds: string[],
  userId: string,
  isAdmin: boolean,
  isActive: boolean,
  status: string
}

export async function AuthenticateUser(request: AuthenticateUserRequest) : Promise<AuthenticateUserResponse>
{
  let baseUrl = BASE_URL + "AuthenticateUser?code=3lIbrkD6t-chmTe78dZbu--PjJh6f6uL6hzFmWMYprXwAzFusnnOTg==";
  const response = await axios.post(baseUrl,request);
  return response.data;
}