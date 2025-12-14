// Interfaz actualizada al nuevo formato del API
export interface ZoneData {
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

// Los datos ahora vienen del API. Este array queda vacío como fallback.
export const texasZones: ZoneData[] = [];
