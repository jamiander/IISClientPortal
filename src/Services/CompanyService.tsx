import { Company } from "../Store/CompanySlice";
import { BASE_URL, http } from "./Http";

interface GetAllCompaniesRequest {
    id?: number,
    name?: string
}

interface GetAllCompaniesResponse {
    companies: Company[]
}

export async function GetAllCompanies(request?: GetAllCompaniesRequest) : Promise<GetAllCompaniesResponse> {
    let baseUrl = BASE_URL + "GetCompanyBlob?code=_OCKRgqpoHjkLRhEKxfkRfVOqLJOFNt-XHIoRbcNQL4VAzFuOb5VlA==&clientId=blobs_extension";

    let query = [];
    if (request)
    {
        if (request.id !== undefined) query.push(`id=${request.id}`);
        if (request.name !== undefined) query.push(`name=${request.name}`);

        if (query.length > 0) baseUrl += "&" + query.join("&");
    }

    let response = await http.get(baseUrl);
    console.log(response.data);
    return response.data.data;
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