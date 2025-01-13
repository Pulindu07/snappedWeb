import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GridPhoto } from '../utils/types';
import { fetchPaginatedPhotos } from '../services/GetPhotoService';
import { encodeBase64, decodeBase64 } from '../utils/helper';



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
    if(response.photos.length>0){
      response.photos.forEach(element => {
          element.prevUrl=decodeBase64(element.prevUrl);
          element.url=decodeBase64(element.url);
      });
    }
    console.log(response.photos[0].url);
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
