import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './apiSlice';

export const store = configureStore({
  reducer: {
    photos: apiReducer,
  },
});

// Typed dispatch
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
