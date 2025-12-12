import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAllData } from '../../context/AllDataContext';
import ZoneDetailPanel from './ZoneDetailPanel';

// Adapter to match ZoneData expected by Panel if interface slightly differs, 
// strictly creating an adapter here if needed. 
// However, ZoneData (mock) and IAllData (API) are identical in the prompt. 
// We will alias IAllData as ZoneData type to reuse the detail panel seamlessly.
// Ideally ZoneDetailPanel should import the type from the API now.

// Component to handle map center logic
const SetViewOnLoad = () => {
    const map = useMap();
    // Center roughly on Texas
    // Only set view once to avoid resetting user zoom
    useEffect(() => {
        map.setView([31.9686, -99.9018], 6);
    }, [map]);
    return null;
}

const MapSection: React.FC = () => {
  const { data: zones, loading, error, refreshData } = useAllData();
  // We align the type here. In a real app we would refactor ZoneDetailPanel to use shared type.
  // For now casting or using any if compatible.
  const [selectedZone, setSelectedZone] = useState<any | null>(null);

  const getColor = (classification: string) => {
     if (!classification) return '#9ca3af';
     if (classification.includes('Alto Potencial')) return '#22c55e'; // Green
     if (classification.includes('Estable')) return '#eab308'; // Yellow
     return '#ef4444'; // Red (Bajo Potencial)
  };

  return (
    <div className="col-span-1 lg:col-span-8 card bg-base-100 shadow-xl overflow-hidden h-[500px] lg:h-[600px] border border-base-200 relative">
      
      {/* Absolute Overlay for Title */}
      <div className="absolute top-4 left-4 z-[400] bg-base-100/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-base-200 flex flex-col gap-1 max-w-[200px]">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span>📍</span> Mapa de Texas
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
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Sobrevalorada
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
          center={[31.9686, -99.9018]} 
          zoom={6} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false} // Disable default top-left
          scrollWheelZoom={true}
          className="z-0"
        >
          <SetViewOnLoad />
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
                       <strong className="block text-sm">{zone.City}</strong>
                       <span className="text-xs opacity-80 block mb-1">{zone.RegionName}</span>
                       <span className={`badge badge-xs text-white border-none py-2 px-2 mt-1`} style={{backgroundColor: color}}>
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
