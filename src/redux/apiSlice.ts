import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { GridPhoto } from '../utils/types';
import config from './../config.json'

const API_URL = config.API_URL;


export const fetchPhotos = createAsyncThunk(
  'photos/fetchPhotos',
  async (page: number) => {
    const response = await axios.get(`${API_URL}/photos?page=${page}`);
    return response.data; // Assume the API returns { items: GridPhoto[], hasMore: boolean }
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
        state.photos = [...state.photos, ...action.payload.items];
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
