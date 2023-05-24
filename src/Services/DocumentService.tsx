import axios from "axios";
import { BASE_URL } from "./Http";
import { BlobClient, BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { DocumentInfo } from "../Store/DocumentSlice";

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

export interface GetDocumentUrlsRequest {
  companyId: string
}

export interface GetDocumentUrlsResponse {
  documents: DocumentInfo[]
}

export async function GetDocumentUrls(request: GetDocumentUrlsRequest) : Promise<GetDocumentUrlsResponse>
{
  const returnedBlobUrls = [];
  const containerName = `client-portal-data`;

  const tokenResponse = await GenerateSASToken({});
  const sasToken = tokenResponse.sasToken;
  let status = tokenResponse.status;

  const uploadUrl = `https://iisclientstorage.blob.core.windows.net/${sasToken}`;
  //console.log(uploadUrl);

  const blobService = new BlobServiceClient(uploadUrl);
  const containerClient: ContainerClient = blobService.getContainerClient(containerName);

  let i = 1;
  for await (const blob of containerClient.findBlobsByTags(`companyId='${request.companyId}'`))
  {
    //console.log(`Blob ${i++}: ${containerName}`);

    const blobItem = {
      url: `https://iisclientstorage.blob.core.windows.net/${containerName}/${blob.name}${sasToken}`,
      name: blob.name
    }
    //console.log(blob);
    
    returnedBlobUrls.push(blobItem);
  }

  return {documents: returnedBlobUrls};
}

export interface DownloadDocumentRequest {
  documentInfo: DocumentInfo
}

interface DownloadDocumentResponse {
  downloadStrings: string[]
}

export async function DownloadDocument(request: DownloadDocumentRequest) : Promise<DownloadDocumentResponse>
{
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

  let downloadBlobs: Blob[] = [];
  let downloadStrings: string[] = [];
  
  const blobClient = new BlobClient(request.documentInfo.url);
  // Download and convert a blob to a string
  const downloadBlockBlobResponse = await blobClient.download();
  const downloadedBlob = await downloadBlockBlobResponse.blobBody;
  if(downloadedBlob)
  {
    const downloadedString = await blobToString(downloadedBlob);
    /*console.log(
      "Downloaded blob content",
      downloadedString
    );*/
    downloadBlobs.push(downloadedBlob);
    downloadStrings.push(downloadedString);
  }
  

  // Create blob link to download
  const url = window.URL.createObjectURL(
    downloadBlobs[0]//new Blob([blob]),
  );
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    request.documentInfo.name,
  );

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();

  // Clean up and remove the link
  link.parentNode?.removeChild(link);

  /*const embed = document.createElement('embed');
  embed.src = url;
  embed.width = "250";
  embed.height = "200";
  document.body.appendChild(embed);*/

  window.URL.revokeObjectURL(url);

  return {downloadStrings: downloadStrings};
}

export interface UploadDocumentRequest {
  isTest: boolean
  file: File
  documentId: string
  companyId: string
}

interface UploadDocumentResponse {
  status: string
}

export async function UploadDocument(request: UploadDocumentRequest) : Promise<UploadDocumentResponse>
{
  const tokenResponse = await GenerateSASToken({});
  const sasToken = tokenResponse.sasToken;
  let status = tokenResponse.status;

  const containerName = `client-portal-data`;
  const uploadUrl = `https://iisclientstorage.blob.core.windows.net/${sasToken}`;
  console.log(uploadUrl);

  try{
    const file = request.file;
    const blobService = new BlobServiceClient(uploadUrl);
    const containerClient: ContainerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(request.documentId+"."+file.name.split(".").at(-1));
    const options = { blobHTTPHeaders: { blobContentType: file.type }};

    await blobClient.uploadData(file, options);
    await blobClient.setTags({companyId: request.companyId});
  }
  catch (e)
  {
    console.log(e)
    status = "ERROR: Something went wrong with the upload."
  }
  
  return {status: status}
}

//Using Azure function app; don't remove yet
/*export async function UploadDocument(request: UploadDocumentsRequest) : Promise<UploadDocumentsResponse>
{
  let formData = new FormData();
  formData.append("file",request.files[0]);

  const base_url = BASE_URL + "UploadDocument?code=mFtD4EttHnv1RAnrPlfxPuNoIaalHBoNPhv7bEjJkeOsAzFugcQaWw==";
  const response = await axios.post(base_url,formData,{headers: {'Content-Type': 'multipart/form-data'}});
  return response.data;
}*/
