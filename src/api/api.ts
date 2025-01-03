/* eslint-disable no-console */
import axios from 'axios';

export class APIError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'APIError';
  }
}

export interface CardResponse {
  Set: string;
  Number: string;
  Name: string;
  Type: string;
  Aspects?: string[];
  Traits?: string[];
  Arenas?: string[];
  Cost: string;
  Power: string;
  HP: string;
  FrontText?: string;
  DoubleSided?: boolean;
  Rarity?: string;
  Unique?: boolean;
  Artist?: string;
  VariantType?: string;
  MarketPrice?: string;
  FoilPrice?: string;
  FrontArt?: string;
}


const CORS_PROXY = 'https://api.allorigins.win/get?url=';
const BASE_URL = 'https://api.swu-db.com';

const apiClient = axios.create({
  baseURL: CORS_PROXY,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCatalog = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<{ contents: string }>(`${CORS_PROXY}${encodeURIComponent(`${BASE_URL}/catalog/hps`)}`);
    const parsedData = JSON.parse(response.data.contents); 

    if (!parsedData || !Array.isArray(parsedData.data)) {
      throw new APIError('Unexpected response format for catalog');
    }

    return parsedData.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error in fetchCatalog:', error.message);
      throw new APIError('Failed to fetch catalog data', error);
    }
    console.error('Unexpected Error in fetchCatalog:', error);
    throw new APIError('Failed to fetch catalog data', error);
  }
};

export const searchCards = async (query: string): Promise<CardResponse[]> => {
  if (!query.trim()) {
    return []; 
  }

  try {
    const response = await apiClient.get<{ contents: string }>(
      `${CORS_PROXY}${encodeURIComponent(`${BASE_URL}/cards/search?q=${query}&pretty=true`)}`
    );

    const parsedResponse = JSON.parse(response.data.contents);
    const { data } = parsedResponse;

    if (!data || !Array.isArray(data)) {
      console.error('Unexpected response format:', parsedResponse);
      throw new APIError('Unexpected response format for card search');
    }

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error in searchCards:', error.message);
      throw new APIError('Failed to fetch card data', error);
    }
    console.error('Unexpected Error in searchCards:', error);
    throw new APIError('Failed to fetch card data', error);
  }
};
