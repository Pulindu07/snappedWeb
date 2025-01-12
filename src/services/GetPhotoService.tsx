import axios from 'axios';
import { GridPhoto } from '../utils/types';
import config from '../config.json';

const API_URL = config.API_URL;

interface FetchPhotosResponse {
  photos: GridPhoto[];
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
  totalPages: number;
}

export const fetchPaginatedPhotos = async (page: number): Promise<FetchPhotosResponse> => {
  const response = await axios.get(`${API_URL}/getPhotos?page=${page}`);
  return response.data; // Ensure this matches the API's response format
};
