import axios from "axios";
import { User } from "../Store/UserSlice";
import { BASE_URL, http } from "./Http";

interface GetAllUsersResponse {
    users: User[]
}

export async function GetAllUsers(): Promise<User[]>
{
    let baseUrl = "https://clientportaltestfunction.azurewebsites.net/api/Users?code=7Pala2sxQeLXQT9C5q8Coj2H_JbOW_4tzuUYbxCB7fiYAzFu5f8hZw=="//BASE_URL + "Users";

    let response = await axios.get(baseUrl)//http.get<GetAllUsersResponse>(baseUrl);
    //console.log(response)
    return response.data.users;
}
