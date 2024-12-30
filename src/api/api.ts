// api.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8010';

export class APIError extends Error {
  constructor(
    message: string,
    public originalError?: unknown,
  ) {
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

export interface APIResponse<T> {
  data: T;
  status?: number;
  message?: string;
}

export const fetchCatalog = async (): Promise<string[]> => {
  try {
    const response = await axios.get<{ id: number; name: string }[]>(
      `${BASE_URL}/catalog/hps`
    );
    return response.data.map((item) => item.name); // Transform to array of strings
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new APIError(
        `Failed to fetch catalog data: ${error.message}`,
        error
      );
    }
    throw new APIError('Failed to fetch catalog data');
  }
};

export const searchCards = async (hp: string): Promise<CardResponse[]> => {
  try {
    const response = await axios.get<CardResponse[]>(`${BASE_URL}/cards`, {
      params: hp ? { Catalog: hp, pretty: true } : { pretty: true },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new APIError(`Failed to fetch card data: ${error.message}`, error);
    }
    throw new APIError('Failed to fetch card data');
  }
};
