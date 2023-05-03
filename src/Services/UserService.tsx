import axios from "axios";
import { BASE_URL } from "./Http";
import { User } from "../Store/UserSlice";

export interface GetUserByIdRequest {
  userId: string
}

interface GetUserByIdResponse {
  users: User[],
  status: string
}

export async function GetUserById(request: GetUserByIdRequest) : Promise<GetUserByIdResponse>
{
  let baseUrl = BASE_URL + "GetUserData?code=pxYC2Kl--ufhva3gjlh5s-B5hhn6e--oUiAkLHloNcKbAzFumtzS-w==";

  const response = await axios.post(baseUrl,request);
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
  status: string
}

export async function AuthenticateUser(request: AuthenticateUserRequest) : Promise<AuthenticateUserResponse>
{
  let baseUrl = BASE_URL + "AuthenticateUser?code=Yii5WyJ84vXw42ujOwPcttVh18kVIi0tD1d4uMN18h52AzFuELZqaQ==";

  const response = await axios.post(baseUrl,request);
  return response.data;
}

export interface UpsertUserInfoRequest {
  user: User
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