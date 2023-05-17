import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetDocuments, GetDocumentsRequest, UploadDocuments, UploadDocumentsRequest } from "../Services/DocumentService";
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

export const getDocuments = createAsyncThunk(
  'documents/getDocuments',
  async (args: GetDocumentsRequest, {}) => {
    const response = await GetDocuments(args);
    
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
