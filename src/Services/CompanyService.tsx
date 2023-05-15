import axios from "axios";
import { Company, Initiative } from "../Store/CompanySlice";
import { BASE_URL } from "./Http";
import { AnonymousCredential, BlobClient, BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from "@azure/storage-blob";

export interface DateInfo {
  month: number,
  day: number,
  year: number
}

export interface CompanyInfo {
  id: string,
  companyName: string,
  initiatives?: Initiative[]
}

export interface ThroughputData {
  date: DateInfo,
  itemsCompleted: number
}

export interface DecisionData {
  id: string,
  description: string,
  resolution: string,
  participants: string[],
  date: DateInfo
}

export interface GetCompanyByIdRequest {
  companyId?: string
}

interface GetCompanyByIdResponse {
  info: CompanyInfo[],
  status: string
}

export async function GetCompanyById(request?: GetCompanyByIdRequest) : Promise<GetCompanyByIdResponse> {
  let baseUrl = BASE_URL + "GetCompanyDataDB?code=yxbqHLA5Vp_XyQwwR8TrGLamOrTxv9Dbqw53RhEOYy9CAzFuckblhQ==";

  let req = {
    companyId: request?.companyId ?? "-1",
  }

  let response = await axios.post(baseUrl,req)
  return response.data;
}

export interface GetCompanyByInitiativeIdsRequest {
  initiativeIds: string[],
  isAdmin: boolean,
  companyId: string
}

interface GetCompanyByInitiativeIdsResponse {
  companies: CompanyInfo[],
  status: string
}

export async function GetCompanyByInitiativeIds(request: GetCompanyByInitiativeIdsRequest) : Promise<GetCompanyByInitiativeIdsResponse>
{
  let baseUrl = BASE_URL + "GetCompanyDataByInitiativeIds?code=wcatNw26L7SrWt4WmlVv7e78esr3_zfmD-TFDDiXSzgOAzFuKl1EOQ==";

  let response = await axios.post(baseUrl,request);
  return response.data;
}

export interface UpsertCompanyInfoRequest {
  company: Company,
  isTest: boolean
}

interface UpsertCompanyInfoResponse {
  id: string,
  status: string
}

export async function UpsertCompanyInfo(request: UpsertCompanyInfoRequest) : Promise<UpsertCompanyInfoResponse> {
  const company = request.company;
  const isTest = request.isTest;
  
  const info: CompanyInfo = {
    id: company.id,
    companyName: company.name
  }

  let baseUrl = BASE_URL + "AddCompanyDataDB?code=Hu3y-USXm491pUrvMF-jQVFDMQvazAvfxEq9pAp58LhWAzFu7kjFvQ==";

  let response = await axios.post(baseUrl, {company: info, isTest: isTest});
  return response.data;
}

export interface UpsertInitiativeInfoRequest {
  initiative: Initiative,
  companyId: string,
  isTest: boolean
}

interface UpsertInitiativeInfoResponse {
  initiativeId: string,
  status: string
}

export async function UpsertInitiativeInfo(request: UpsertInitiativeInfoRequest) : Promise<UpsertInitiativeInfoResponse> { 
  let baseUrl = BASE_URL + "AddInitiativeDataDB?code=Myq5EJ7IUzofxs4iufiWIiprJxBmItjWZXG9zoTbnwcpAzFu-ZD83w==";

  let response = await axios.post(baseUrl, {initiative: request.initiative, companyId: request.companyId, isTest: request.isTest});
  return response.data;
}

export function FindItemsRemaining(initiative: Initiative | undefined) {
  if(initiative)
  {
    const itemsCompleted = initiative.itemsCompletedOnDate.map((item) => item.itemsCompleted);
    let totalItemsCompleted = 0;

    itemsCompleted.forEach((num) => totalItemsCompleted += num);
    return initiative.totalItems - totalItemsCompleted;
  }
  return NaN;
}

export interface UpsertThroughputDataRequest {
  isTest: boolean,
  companyId: string,
  initiativeId: string,
  itemsCompletedOnDate: ThroughputData[]
}

interface UpsertThroughputDataResponse {
  status: string
}

export async function UpsertThroughputData(request: UpsertThroughputDataRequest) : Promise<UpsertThroughputDataResponse>
{
  let baseUrl = BASE_URL + "AddThroughputDataDB?code=7zfSWKR3W3-8WhgYqHm-8k50IZY6TdtJ_3ylenab25OoAzFuFzdQLA==";

  const response = await axios.post(baseUrl,request);
  return response.data;
}

export interface UpsertDecisionDataRequest {
  isTest: boolean,
  companyId: string,
  initiativeId: string,
  decisions: DecisionData[]
}

interface UpsertDecisionDataResponse {
  decisionId: string,
  status: string
}


export async function UpsertDecisionData(request: UpsertDecisionDataRequest) : Promise<UpsertDecisionDataResponse>
{
  let baseUrl = BASE_URL + "AddDecisionDataDB?code=vg1Gfo79pB09asPWVpH-lNaXbl3KTux5RuuMy741kmqIAzFuHnJFvg==";

  const response = await axios.post(baseUrl,request);
  return response.data;
}

export interface DeleteDecisionDataRequest {
  isTest: boolean,
  companyId: string,
  initiativeId: string,
  decisionIds: string[]
}

interface DeleteDecisionDataResponse {
  status: string
}

export async function DeleteDecisionData(request: DeleteDecisionDataRequest) : Promise<DeleteDecisionDataResponse>
{
  let baseUrl = BASE_URL + "DeleteDecisionDataDB?code=W_thQCwjUyvN_AsTbRgkXmFkNx6oJ26cV8mQQBTJW5QJAzFu0f9log==";
  const response = await axios.delete(baseUrl, { data: request});
  return response.data;
}


export interface GenerateSASTokenRequest {
}

interface GenerateSASTokenResponse {
  sasToken: string,
  status: string
}

export async function GenerateSASToken(request: GenerateSASTokenRequest) : Promise<GenerateSASTokenResponse>
{
  let baseUrl = BASE_URL + "GenerateSASToken?code=MHZgZfZl14fymSwq3Mx_Y8SZCeuuNCZ6UUUGYi_4wDgaAzFu5cKyvQ==";
  const response = await axios.post(baseUrl, request);
  return response.data;
}

export interface GetDocumentsRequest {
  documentId: string
}

interface GetDocumentsResponse {
  documents: {url: string, name: any}[]
}

export async function GetDocuments(request: GetDocumentsRequest) : Promise<GetDocumentsResponse>
{
  const returnedBlobUrls = [];
  const containerName = `client-portal-data`;

  const tokenResponse = await GenerateSASToken({});
  const sasToken = tokenResponse.sasToken;
  let status = tokenResponse.status;

  const uploadUrl = `https://iisclientstorage.blob.core.windows.net/${sasToken}`;
  console.log(uploadUrl);

  const blobService = new BlobServiceClient(uploadUrl);
  const containerClient: ContainerClient = blobService.getContainerClient(containerName);
  

  async function blobToString(blob: Blob): Promise<string> {
    const fileReader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      fileReader.onloadend = (ev: any) => {
        resolve(ev.target!.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(blob);
    });
  }


  // get list of blobs in container
  for await (const blob of containerClient.listBlobsFlat()) {
    console.log(`${blob.name}`);

    const blobItem = {
      url: `https://iisclientstorage.blob.core.windows.net/${containerName}/${blob.name}${sasToken}`,
      name: blob.name
    }

    //console.log(blob);

    // if image is public, just construct URL
    returnedBlobUrls.push(blobItem);

    //-------------
    const blobClient = new BlobClient(blobItem.url);
    // Download and convert a blob to a string
    const downloadBlockBlobResponse = await blobClient.download();
    const downloadedBlob = await downloadBlockBlobResponse.blobBody;
    if(downloadedBlob)
    {
      const downloadedString = await blobToString(downloadedBlob);
      console.log(
        "Downloaded blob content",
        downloadedString
      );
    }
  }

  return {documents: returnedBlobUrls};
}

export interface UploadDocumentsRequest {
  isTest: boolean
  files: FileList
  documentId: string
}

interface UploadDocumentsResponse {
  status: string
}

export async function UploadDocuments(request: UploadDocumentsRequest) : Promise<UploadDocumentsResponse>
{
  const tokenResponse = await GenerateSASToken({});
  const sasToken = tokenResponse.sasToken;
  let status = tokenResponse.status;

  const containerName = `client-portal-data`;
  const uploadUrl = `https://iisclientstorage.blob.core.windows.net/${sasToken}`;
  console.log(uploadUrl);

  try{
    const file = request.files[0];
    const blobService = new BlobServiceClient(uploadUrl);
    const containerClient: ContainerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(request.documentId+"."+file.name.split(".").at(-1));
    const options = { blobHTTPHeaders: { blobContentType: file.type }}

    await blobClient.uploadData(file, options);
  
  }
  catch (e)
  {
    console.log(e)
    status = "ERROR: Something went wrong with the upload."
  }
  
  return {status: status}
}
