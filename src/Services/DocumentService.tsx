import axios from "axios";
import { BASE_URL } from "./Http";
import { BlobClient, BlobServiceClient, ContainerClient, Tags } from "@azure/storage-blob";
import { DocumentInfo } from "../Store/DocumentSlice";

export interface GenerateSASTokenRequest {
  write: boolean
}

interface GenerateSASTokenResponse {
  sasToken: string,
  status: string
}

export async function GenerateSASToken(request: GenerateSASTokenRequest) : Promise<GenerateSASTokenResponse>
{
  let baseUrl = "https://generatesasfunctionapp.azurewebsites.net/api/GenerateSASToken?code=xyAJVDU4cfr8z7LyuJPIzZPvY_7lkFl9puS5WEJFlMRpAzFu8z_ZMQ=="//BASE_URL + "GenerateSASToken?code=7lJ3CLhesmELNgg94iDcPGAwI5F-IunzSMT8RFa7hw7SAzFu4QNahQ=="//"GenerateSASToken?code=MHZgZfZl14fymSwq3Mx_Y8SZCeuuNCZ6UUUGYi_4wDgaAzFu5cKyvQ==";
  const response = await axios.post(baseUrl, request);
  return response.data;
}

export interface GetDocumentUrlsRequest {
  companyId: string
  initiativeId?: string
}

export interface GetDocumentUrlsResponse {
  documents: DocumentInfo[]
}

export async function GetDocumentUrls(request: GetDocumentUrlsRequest) : Promise<GetDocumentUrlsResponse>
{
  const docs: DocumentInfo[] = [];
  const containerName = `client-portal-data`;

  const tokenResponse = await GenerateSASToken({write: false});
  const sasToken = tokenResponse.sasToken;
  let status = tokenResponse.status;

  const uploadUrl = `https://iisclientstorage.blob.core.windows.net/${sasToken}`;

  const blobService = new BlobServiceClient(uploadUrl);
  const containerClient: ContainerClient = blobService.getContainerClient(containerName);

  let query = `companyId='${request.companyId}'`;
  if(request.initiativeId)
    query += ` AND initiativeId='${request.initiativeId}'`;

  let i = 1;
  for await (const blob of containerClient.findBlobsByTags(query))
  {
    const url = `https://iisclientstorage.blob.core.windows.net/${containerName}/${blob.name}${sasToken}`
    
    const blobClient = new BlobClient(url);
    
    const properties = await blobClient.getProperties();
    let fileName = "";
    if(properties.metadata?.filename)
      fileName = properties.metadata.filename;

    const tags = await blobClient.getTags();

    const docItem: DocumentInfo = {
      url: url,
      blobName: blob.name,
      fileName: fileName,
      initiativeId: tags.tags.initiativeId
    }
    
    docs.push(docItem);
  }

  return {documents: docs};
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
    request.documentInfo.fileName,
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
  file: File
  documentId: string
  companyId: string
  initiativeId?: string
}

interface UploadDocumentResponse {
  status: string
}

export async function UploadDocument(request: UploadDocumentRequest) : Promise<UploadDocumentResponse>
{
  const tokenResponse = await GenerateSASToken({write: true});
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

    let tags: any = {companyId: request.companyId};
    if(request.initiativeId)
      tags = {companyId: request.companyId, initiativeId: request.initiativeId};
    await blobClient.setTags(tags);
    await blobClient.setMetadata({fileName: file.name});
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
