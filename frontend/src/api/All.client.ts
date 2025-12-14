import axiosInstance from './axios.config';

export interface IAllData {
  RegionName: string;
  City?: string;
  Ciudad?: string;
  State?: string;
  Estado?: string;
  Precio_Actual: string;
  Clasificacion: string;
  "Confianza_%": string;
  "Crecimiento_2025_%": string;
  Asequibilidad: string;
  "Vacancia_%": string;
  "Impulso_Mercado_%": string;
  Latitude: string;
  Longitude: string;
}

export const getAllData = async (): Promise<IAllData[]> => {
  try {
    const response = await axiosInstance.get<IAllData[]>('/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw error;
  }
};
