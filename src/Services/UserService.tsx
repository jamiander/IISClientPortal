import axios from "axios";
import { BASE_URL } from "./Http";
import { User } from "../Store/UserSlice";
import { IntegrityId } from "../Store/CompanySlice";

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
  let baseUrl = BASE_URL + "GetUser?code=s8KUWDvJuOMxeIieJvnbNyZkV7XNNpChqQ3bSzjRr7KbAzFuHfLxgA==&clientId=default"//"GetUserData?code=hl9AyWCStkzMXWiAnBlIqVe3UQnbdbU5IHSNsuuHTLwlAzFuraK-gw=="//"GetUserData?code=pxYC2Kl--ufhva3gjlh5s-B5hhn6e--oUiAkLHloNcKbAzFumtzS-w==";

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
  let baseUrl = BASE_URL + "UpsertUser?code=k6zaUMg_mGaCpKxYIYVxZt5DOkSIHhnobTkxQ_umTWhFAzFurMvcxA=="//"AddUserData?code=0DxuosCHuDX2GjYbeUu0aqu45wAg95xIAf4B2ecRjO-vAzFu3q_cJQ==";
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
  let baseUrl = BASE_URL + "DeleteUser?code=ZkVqxvB36cDit4dez7wo-r1UW4TwQogApP2Qiu-ekpgqAzFu5lOVGw=="//"DeleteUserData?code=IEWMcaPAbEmpSopN_hCw-ltu09BWB8bKbkIkahtQj_tDAzFuPGcLYA==";
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
  let baseUrl = BASE_URL + "AuthenticateUser?code=5d6A69cIKIFWq4cY7Z42Z9RFIegglOxfrgLl4Ln03RzuAzFucqajig=="//"AuthenticateUser?code=Yii5WyJ84vXw42ujOwPcttVh18kVIi0tD1d4uMN18h52AzFuELZqaQ==";

  //If azure goes down:
  //const response = {data: {companyId: IntegrityId, initiativeIds: [], userId: "", isAdmin: true, isActive: true, status: "SUCCESS"}}
  const response = await axios.post(baseUrl,request);
  return response.data;
}