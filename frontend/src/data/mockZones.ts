// Interfaz actualizada al nuevo formato del API
export interface ZoneData {
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

// Los datos ahora vienen del API. Este array queda vacío como fallback.
export const texasZones: ZoneData[] = [];
