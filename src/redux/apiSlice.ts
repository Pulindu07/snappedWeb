import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GridPhoto } from '../utils/types';
import { fetchPaginatedPhotos } from '../services/GetPhotoService';



interface FetchPhotosPayload {
  photos: GridPhoto[];
  hasMore: boolean;
  currentPage:number;
  totalCount:number;
  totalPages:number
}

export const fetchPhotos = createAsyncThunk<FetchPhotosPayload, number>(
  'photos/fetchPhotos',
  async (page: number) => {
    const response = await fetchPaginatedPhotos(page);
    return response;
  }
);

interface PhotosState {
  photos: GridPhoto[];
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PhotosState = {
  photos: [],
  currentPage: 1,
  hasMore: true,
  loading: false,
  error: null,
};

const apiSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = [...state.photos, ...action.payload.photos];
        state.hasMore = action.payload.hasMore;
        state.currentPage += 1;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load photos';
      });
  },
});

export default apiSlice.reducer;
