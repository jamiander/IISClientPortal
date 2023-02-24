import axios from "axios";
import { User } from "../Store/UserSlice";
import { BASE_URL, http } from "./Http";

/*interface GetAllUsersRequest {
    id?: number,
    email?: string,
    companyId?: number
}

interface GetAllUsersResponse {
    users: User[]
}

export async function GetAllUsers(request?: GetAllUsersRequest): Promise<User[]>
{
    let baseUrl = BASE_URL + "GetUserBlob?code=p8O-6DDRKEKkyBLCUW2dFAkBtDZj45u_tCVkRhQRhQFbAzFuq_N7Kg=="//"https://clientportaltestfunction.azurewebsites.net/api/Users?code=7Pala2sxQeLXQT9C5q8Coj2H_JbOW_4tzuUYbxCB7fiYAzFu5f8hZw=="//BASE_URL + "Users";

    let query = [];
    if(request)
    {
        if(request.id !== undefined)
            query.push(`id=${request.id}`);
        if(request.email !== undefined)
            query.push(`email=${request.email}`);
        if(request.companyId !== undefined)
            query.push(`companyId=${request.companyId}`);

        if(query.length > 0)
        {
            baseUrl += "&"; //the function code's already a part of the query
            baseUrl += query.join("&");
        }
    }

    let response = await axios.get(baseUrl)//http.get<GetAllUsersResponse>(baseUrl);
    //console.log(response)
    return response.data;
}

interface AddUserRequest {
    user: User
    isTest: boolean
}

interface AddUserResponse {
    id: number
    status: string
}

export async function AddUser(request: AddUserRequest): Promise<AddUserResponse>
{
    let baseUrl = BASE_URL + "AddUserBlob?code=tZd1SRgatu5UuLWMBqPXMVH6xqqnu7bgWjQ-tyWqxq6uAzFustCzjw==";
    
    let response = await axios.post(baseUrl,request);
    return response.data;
}*/
