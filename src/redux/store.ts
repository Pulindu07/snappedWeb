import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './apiSlice';
import chatReducer from './chatSlice';
import allPhotosReducer from './allPhotoSlice'

export const store = configureStore({
  reducer: {
    photos: apiReducer,
    chat: chatReducer,
    allPhotos: allPhotosReducer,
  },
});

// Typed dispatch
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
