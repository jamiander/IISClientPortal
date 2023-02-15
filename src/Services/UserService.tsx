import { User } from "../Store/UserSlice";
import { BASE_URL, http } from "./Http";

interface GetAllUsersResponse {
    users: User[]
}

export async function GetAllUsers(): Promise<User[]>
{
    let baseUrl = BASE_URL + "Users";

    let response = await http.get<GetAllUsersResponse>(baseUrl);
    return response.data.data.users;
}
