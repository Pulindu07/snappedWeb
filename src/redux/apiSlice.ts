import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GridPhoto } from '../utils/types';
import { fetchPaginatedPhotos, likePhoto } from '../services/GetPhotoService';
import { encodeBase64, decodeBase64 } from '../utils/helper';
import {DEFAULT_PAGE_SIZE} from './../config.json';

const pageSize = DEFAULT_PAGE_SIZE;

interface FetchPhotosPayload {
  photos: GridPhoto[];
  hasMore: boolean;
  currentPage:number;
  totalCount:number;
  totalPages:number
}

interface FetchLikePhotoPayload {
  Id: number;
  HasLike: boolean;
  LikeCount:number;
}

interface LikePhotoRequest {
  id: number;
  hasLiked: boolean;
}

export const fetchPhotos = createAsyncThunk<FetchPhotosPayload, number>(
  'photos/fetchPhotos',
  async (page: number) => {
    const response = await fetchPaginatedPhotos(page, pageSize);
    if(response.photos.length>0){
      response.photos.forEach(element => {
          element.prevUrl=decodeBase64(element.prevUrl);
          element.url=decodeBase64(element.url);
      });
    }
    return response;
  }
);

export const fetchLikedPhoto = createAsyncThunk<FetchLikePhotoPayload, LikePhotoRequest>(
  'photos/fetchLikedPhotos',
  async ({id, hasLiked}) => {
    const response = await likePhoto(id,hasLiked);
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
