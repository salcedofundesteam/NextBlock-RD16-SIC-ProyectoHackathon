import axiosInstance from './axios.config';

export interface IAllData {
  RegionName: string;
  City: string;
  State: string;
  Precio_Actual: string;
  Clasificacion: string;
  "Confianza_%": string;
  Datos_Clave: string;
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
