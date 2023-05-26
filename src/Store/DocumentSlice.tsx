import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DownloadDocument, DownloadDocumentRequest, GetDocumentUrls, GetDocumentUrlsRequest, UploadDocument, UploadDocumentRequest } from "../Services/DocumentService";
import { RootState } from "./Store";

export interface DocumentInfo {
  url: string,
  blobName: string,
  fileName: string,
  initiativeId?: string
}

export interface DocumentState {
  documents: DocumentInfo[]
}

const initialState: DocumentState = {
  documents: []
}

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocuments',
  async (args: UploadDocumentRequest, {}) => {
    const response = await UploadDocument(args);
  }
)

export const getDocumentUrls = createAsyncThunk(
  'documents/getDocumentUrls',
  async (args: GetDocumentUrlsRequest, {}) => {
    const response = await GetDocumentUrls(args);
    return response.documents;
  }
)

export const downloadDocument = createAsyncThunk(
  'documents/downloadDocuments',
  async (args: DownloadDocumentRequest, {}) => {
    const response = await DownloadDocument(args);
    return response.downloadStrings;
  }
)

export const documentSlice = createSlice({
  name: "documents",
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocument.fulfilled, (state, action) => {
        
      })
      .addCase(getDocumentUrls.fulfilled, (state, action) => {
        
      })
      .addCase(downloadDocument.fulfilled, (state, action) => {
        
      })
  }
});

export const {} = documentSlice.actions;
export const selectAllDocuments = (state: RootState) => state.documents.documents;

export default documentSlice.reducer;
