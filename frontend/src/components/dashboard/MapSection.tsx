import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAllData } from '../../context/AllDataContext';
import ZoneDetailPanel from './ZoneDetailPanel';

// Coordenadas centrales por estado
const STATE_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'all': { lat: 39.8283, lng: -98.5795, zoom: 4 }, // Centro de EE.UU.
  'TX': { lat: 31.9686, lng: -99.9018, zoom: 6 },
  'CA': { lat: 36.7783, lng: -119.4179, zoom: 6 },
  'NY': { lat: 43.0, lng: -75.5, zoom: 7 },
  'FL': { lat: 27.6648, lng: -81.5158, zoom: 6 },
  'IL': { lat: 40.6331, lng: -89.3985, zoom: 6 },
  'PA': { lat: 41.2033, lng: -77.1945, zoom: 7 },
  'OH': { lat: 40.4173, lng: -82.9071, zoom: 7 },
  'GA': { lat: 32.1656, lng: -82.9001, zoom: 7 },
  'NC': { lat: 35.7596, lng: -79.0193, zoom: 7 },
  'MI': { lat: 44.3148, lng: -85.6024, zoom: 6 },
  'NJ': { lat: 40.0583, lng: -74.4057, zoom: 8 },
  'VA': { lat: 37.4316, lng: -78.6569, zoom: 7 },
  'WA': { lat: 47.7511, lng: -120.7401, zoom: 7 },
  'AZ': { lat: 34.0489, lng: -111.0937, zoom: 6 },
  'MA': { lat: 42.4072, lng: -71.3824, zoom: 8 },
  'TN': { lat: 35.5175, lng: -86.5804, zoom: 7 },
  'IN': { lat: 40.2672, lng: -86.1349, zoom: 7 },
  'MO': { lat: 37.9643, lng: -91.8318, zoom: 7 },
  'MD': { lat: 39.0458, lng: -76.6413, zoom: 8 },
  'WI': { lat: 43.7844, lng: -88.7879, zoom: 7 },
  'CO': { lat: 39.5501, lng: -105.7821, zoom: 7 },
  'MN': { lat: 46.7296, lng: -94.6859, zoom: 6 },
  'SC': { lat: 33.8361, lng: -81.1637, zoom: 7 },
  'AL': { lat: 32.3182, lng: -86.9023, zoom: 7 },
  'LA': { lat: 30.9843, lng: -91.9623, zoom: 7 },
  'KY': { lat: 37.8393, lng: -84.2700, zoom: 7 },
  'OR': { lat: 43.8041, lng: -120.5542, zoom: 6 },
  'OK': { lat: 35.0078, lng: -97.0929, zoom: 7 },
  'CT': { lat: 41.6032, lng: -73.0877, zoom: 9 },
  'UT': { lat: 39.3210, lng: -111.0937, zoom: 6 },
  'IA': { lat: 41.8780, lng: -93.0977, zoom: 7 },
  'NV': { lat: 38.8026, lng: -116.4194, zoom: 6 },
  'AR': { lat: 35.2010, lng: -91.8318, zoom: 7 },
  'MS': { lat: 32.3547, lng: -89.3985, zoom: 7 },
  'KS': { lat: 39.0119, lng: -98.4842, zoom: 7 },
  'NM': { lat: 34.5199, lng: -105.8701, zoom: 6 },
  'NE': { lat: 41.4925, lng: -99.9018, zoom: 7 },
  'ID': { lat: 44.0682, lng: -114.7420, zoom: 6 },
  'WV': { lat: 38.5976, lng: -80.4549, zoom: 7 },
  'HI': { lat: 19.8968, lng: -155.5828, zoom: 7 },
  'NH': { lat: 43.1939, lng: -71.5724, zoom: 8 },
  'ME': { lat: 45.2538, lng: -69.4455, zoom: 7 },
  'MT': { lat: 46.8797, lng: -110.3626, zoom: 6 },
  'RI': { lat: 41.5801, lng: -71.4774, zoom: 10 },
  'DE': { lat: 38.9108, lng: -75.5277, zoom: 9 },
  'SD': { lat: 43.9695, lng: -99.9018, zoom: 7 },
  'ND': { lat: 47.5515, lng: -101.0020, zoom: 7 },
  'AK': { lat: 64.2008, lng: -152.4937, zoom: 4 },
  'VT': { lat: 44.5588, lng: -72.5778, zoom: 8 },
  'WY': { lat: 43.0760, lng: -107.2903, zoom: 6 },
  'DC': { lat: 38.9072, lng: -77.0369, zoom: 11 },
};

// Nombres de estados
const STATE_NAMES: Record<string, string> = {
  'all': 'Estados Unidos',
  'TX': 'Texas', 'CA': 'California', 'NY': 'Nueva York', 'FL': 'Florida',
  'IL': 'Illinois', 'PA': 'Pensilvania', 'OH': 'Ohio', 'GA': 'Georgia',
  'NC': 'Carolina del Norte', 'MI': 'Michigan', 'NJ': 'Nueva Jersey',
  'VA': 'Virginia', 'WA': 'Washington', 'AZ': 'Arizona', 'MA': 'Massachusetts',
  'TN': 'Tennessee', 'IN': 'Indiana', 'MO': 'Misuri', 'MD': 'Maryland',
  'WI': 'Wisconsin', 'CO': 'Colorado', 'MN': 'Minnesota', 'SC': 'Carolina del Sur',
  'AL': 'Alabama', 'LA': 'Luisiana', 'KY': 'Kentucky', 'OR': 'Oregón',
  'OK': 'Oklahoma', 'CT': 'Connecticut', 'UT': 'Utah', 'IA': 'Iowa',
  'NV': 'Nevada', 'AR': 'Arkansas', 'MS': 'Misisipi', 'KS': 'Kansas',
  'NM': 'Nuevo México', 'NE': 'Nebraska', 'ID': 'Idaho', 'WV': 'Virginia Occidental',
  'HI': 'Hawái', 'NH': 'Nueva Hampshire', 'ME': 'Maine', 'MT': 'Montana',
  'RI': 'Rhode Island', 'DE': 'Delaware', 'SD': 'Dakota del Sur',
  'ND': 'Dakota del Norte', 'AK': 'Alaska', 'VT': 'Vermont', 'WY': 'Wyoming',
  'DC': 'Washington D.C.'
};

// Componente para manejar el centrado dinámico del mapa
interface MapCenterProps {
  selectedState: string;
  zones: Array<{ Latitude: string; Longitude: string }>;
}

const DynamicMapCenter: React.FC<MapCenterProps> = ({ selectedState, zones }) => {
  const map = useMap();
useEffect(() => {
  console.log(`Estado seleccionado: ${selectedState}`);
  console.log(`Cantidad de zonas: ${zones.length}`);
  if (zones.length > 0) {
    console.log('Ejemplo de zona:', zones[0]);
    console.log('Latitud (raw):', zones[0].Latitude, typeof zones[0].Latitude);
    console.log('Longitud (raw):', zones[0].Longitude, typeof zones[0].Longitude);
  }
}, [selectedState, zones]);
  useEffect(() => {
    const center = STATE_CENTERS[selectedState] || STATE_CENTERS['all'];

    // Si es "all" y hay datos, calcular el centro basado en los datos
    if (selectedState === 'all' && zones.length > 0) {
      const validZones = zones.filter(z => z.Latitude && z.Longitude);
      if (validZones.length > 0) {
        const lats = validZones.map(z => parseFloat(z.Latitude));
        const lngs = validZones.map(z => parseFloat(z.Longitude));
        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        map.setView([avgLat, avgLng], 4);
        return;
      }
    }

    map.setView([center.lat, center.lng], center.zoom);
  }, [map, selectedState, zones]);

  return null;
};

const MapSection: React.FC = () => {
  const { filteredData: zones, loading, error, refreshData, selectedState } = useAllData();
  const [selectedZone, setSelectedZone] = useState<any | null>(null);

  const getColor = (classification: string) => {
    if (!classification) return '#9ca3af';
    if (classification.includes('Alto Potencial')) return '#22c55e'; // Green
    if (classification.includes('Estable')) return '#eab308'; // Yellow
    return '#ef4444'; // Red (Bajo Potencial)
  };

  const getMapTitle = () => {
    if (selectedState === 'all') return 'Mapa de EE.UU.';
    return `Mapa de ${STATE_NAMES[selectedState] || selectedState}`;
  };

  const initialCenter = useMemo(() => {
    const center = STATE_CENTERS[selectedState] || STATE_CENTERS['all'];
    return { lat: center.lat, lng: center.lng, zoom: center.zoom };
  }, [selectedState]);

  return (
    <div className="col-span-1 lg:col-span-8 card bg-base-100 shadow-xl overflow-hidden h-[500px] lg:h-[550px] border border-base-200 relative">

      {/* Absolute Overlay for Title */}
      <div className="absolute top-4 left-4 z-[400] bg-base-100/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-base-200 flex flex-col gap-1 max-w-[220px]">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span>📍</span> {getMapTitle()}
        </h3>
        <p className="text-xs opacity-60 leading-snug">
          {loading ? 'Cargando datos...' :
            error ? 'Error de conexión' :
              `${zones.length} zonas analizadas.`}
        </p>

        {/* Legend */}
        <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-base-300">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Alto Potencial
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Estable
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Bajo Potencial
          </div>
        </div>

        {error && (
          <button onClick={refreshData} className="btn btn-xs btn-error mt-2">Reintentar</button>
        )}
      </div>

      {/* Detail Panel Overlay */}
      <ZoneDetailPanel zone={selectedZone} onClose={() => setSelectedZone(null)} />

      <div className="h-full w-full relative z-0">
        <MapContainer
          center={[initialCenter.lat, initialCenter.lng]}
          zoom={initialCenter.zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={true}
          className="z-0"
        >
          <DynamicMapCenter selectedState={selectedState} zones={zones} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Custom Zoom Control Bottom Right */}
          <ZoomControl position="bottomright" />

          {!loading && zones.map((zone, idx) => {
            const color = getColor(zone.Clasificacion);
            // Ensure unique key fallback
            const key = zone.RegionName || idx;
            const isSelected = selectedZone?.RegionName === zone.RegionName;

            // Guard against bad data
            if (!zone.Latitude || !zone.Longitude) return null;

            return (
              <CircleMarker
                key={key}
                center={[parseFloat(zone.Latitude), parseFloat(zone.Longitude)]}
                radius={isSelected ? 10 : 6}
                pathOptions={{
                  fillColor: color,
                  color: isSelected ? '#000' : 'white',
                  weight: isSelected ? 3 : 1,
                  fillOpacity: 0.8
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedZone(zone);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="text-center">
                    <strong className="block text-sm">{zone.City || zone.Ciudad}</strong>
                    <span className="text-xs opacity-80 block mb-1">{zone.RegionName}</span>
                    <span className={`badge badge-xs text-white border-none py-2 px-2 mt-1`} style={{ backgroundColor: color }}>
                      {zone.Clasificacion || 'N/A'}
                    </span>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapSection;
