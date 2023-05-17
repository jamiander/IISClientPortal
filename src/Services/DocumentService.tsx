import axios from "axios";
import { BASE_URL } from "./Http";
import { BlobClient, BlobServiceClient, ContainerClient } from "@azure/storage-blob";

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

export async function UploadDocument(request: UploadDocumentsRequest) : Promise<UploadDocumentsResponse>
{
  let formData = new FormData();
  formData.append("file",request.files[0]);

  const base_url = BASE_URL + "UploadDocument?code=mFtD4EttHnv1RAnrPlfxPuNoIaalHBoNPhv7bEjJkeOsAzFugcQaWw==";
  const response = await axios.post(base_url,formData,{headers: {'Content-Type': 'multipart/form-data'}});
  return response.data;
}
