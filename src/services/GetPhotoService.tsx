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

export const fetchPaginatedPhotos = async (page: number, pageSize:number): Promise<FetchPhotosResponse> => {
  const response = await axios.get(`${API_URL}/getPhotos?page=${page}&pageSize=${pageSize}`);
  return response.data; // Ensure this matches the API's response format
};

export const likePhoto = async (id:number, hasLiked:boolean) => {
  const response = await axios.put(`${API_URL}/likePhoto`, {
    id,
    hasLiked,
  });
  return response.data; // Returns the server's response
};
