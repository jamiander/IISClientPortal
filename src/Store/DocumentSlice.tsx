import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetDocumentUrls, GetDocumentUrlsRequest, UploadDocuments, UploadDocumentsRequest } from "../Services/DocumentService";
import { RootState } from "./Store";



export interface DocumentState {
  documents: Blob[]
}

const initialState: DocumentState = {
  documents: []
}

export const uploadDocuments = createAsyncThunk(
  'documents/uploadDocuments',
  async (args: UploadDocumentsRequest, {}) => {
    const response = await UploadDocuments(args);
  }
)

export const getDocumentUrls = createAsyncThunk(
  'documents/getDocumentUrls',
  async (args: GetDocumentUrlsRequest, {}) => {
    const response = await GetDocumentUrls(args);
    
  }
)

export const documentSlice = createSlice({
  name: "documents",
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        
      })
  }
});

export const {} = documentSlice.actions;
export const selectAllDocuments = (state: RootState) => state.documents.documents;

export default documentSlice.reducer;
