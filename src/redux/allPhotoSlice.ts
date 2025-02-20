import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GridPhoto } from '../utils/types';
import { fetchAllPhotos, fetchPaginatedPhotos, likePhoto } from '../services/GetPhotoService';
import { decodeBase64 } from '../utils/helper';

interface FetchPhotosPayload {
  photos: GridPhoto[];
  hasMore: boolean;
  currentPage:number;
  totalCount:number;
  totalPages:number
}

export const fetchAllThePhotos = createAsyncThunk<FetchPhotosPayload, number>(
  'photos/fetchAllThePhotos',
  async (page: number) => {
    const response = await fetchAllPhotos(page);
    if(response.photos.length>0){
      response.photos.forEach(element => {
          element.prevUrl=decodeBase64(element.prevUrl);
          element.url=decodeBase64(element.url);
      });
    }
    return response;
  }
);


interface PhotosState {
  allPhotos: GridPhoto[];
  allCurrentPage: number;
  allHasMore: boolean;
  allLoading: boolean;
  allError: string | null;
  allTotalPages:number;
}

const initialState: PhotosState = {
  allPhotos: [],
  allCurrentPage: 1,
  allHasMore: true,
  allLoading: false,
  allError: null,
  allTotalPages:1
};

const allPhotoSlice = createSlice({
  name: 'allPhotos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllThePhotos.pending, (state) => {
        state.allLoading = true;
      })
      .addCase(fetchAllThePhotos.fulfilled, (state, action) => {
        state.allLoading = false;
        state.allPhotos = [...state.allPhotos, ...action.payload.photos];
        state.allHasMore = action.payload.hasMore;
        state.allCurrentPage += 1;
        state.allTotalPages=action.payload.totalPages;
      })
      .addCase(fetchAllThePhotos.rejected, (state, action) => {
        state.allLoading = false;
        state.allError = action.error.message || 'Failed to load photos';
      });
  },
});

export default allPhotoSlice.reducer;
