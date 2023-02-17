import axios from "axios";
import { Company } from "../Store/CompanySlice";
import { BASE_URL, http } from "./Http";

interface GetAllCompaniesRequest {
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
    // console.log("service", response.data);
    return response.data;
}

interface AddCompanyRequest {
    company: Company,
    isTest: boolean
}

interface AddCompanyResponse {
    id: number,
    status: string
}

// export async function AddCompany(request?: AddCompanyRequest) : Promise<AddCompanyResponse> {

// }