import React from 'react';
import type { ZoneData } from '../../data/mockZones';
import { X, TrendingUp, DollarSign, Activity } from 'lucide-react';

interface ZoneDetailPanelProps {
  zone: ZoneData | null;
  onClose: () => void;
}

const ZoneDetailPanel: React.FC<ZoneDetailPanelProps> = ({ zone, onClose }) => {
  if (!zone) return null;

  // Helper to determine badge color based on classification
  const getBadgeColor = (classification: string) => {
    if (!classification) return 'badge-neutral';
    if (classification.includes('Alto Potencial')) return 'badge-success';
    if (classification.includes('Estable')) return 'badge-warning';
    return 'badge-error'; // Bajo Potencial
  };

  return (
    <div className="absolute top-4 right-4 z-[500] w-80 bg-base-100 shadow-2xl rounded-xl border border-base-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-4 bg-base-200/50 border-b border-base-200 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg leading-tight">{zone.RegionName}</h3>
          <p className="text-sm opacity-70">{zone.City || zone.Ciudad}, {zone.State || zone.Estado}</p>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Classification Badge */}
        <div className={`badge ${getBadgeColor(zone.Clasificacion)} badge-lg w-full font-bold text-white shadow-sm`}>
          {zone.Clasificacion}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-base-200/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-primary mb-1">
              <DollarSign size={16} />
              <span className="text-xs font-bold uppercase opacity-70">Precio</span>
            </div>
            <p className="font-bold text-sm">
              ${parseFloat(zone.Precio_Actual).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="bg-base-200/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Activity size={16} />
              <span className="text-xs font-bold uppercase opacity-70">Confianza</span>
            </div>
            <p className="font-bold text-sm">{zone["Confianza_%"]}%</p>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-sm border-b border-base-200 pb-2">
            <span className="opacity-70">Lat / Lng</span>
            <span className="font-mono text-xs opacity-50">{zone.Latitude}, {zone.Longitude}</span>
          </div>
        </div>

        {/* Key Data / Insights */}
        <div className="bg-base-100 border border-base-200 p-3 rounded-lg shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-accent" />
            <span className="font-bold text-xs uppercase">Métricas Clave</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="opacity-70">Crecimiento 2025:</span>
              <span className="font-bold text-success">{zone["Crecimiento_2025_%"]}%</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Asequibilidad:</span>
              <span className="font-bold">{zone.Asequibilidad}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Vacancia:</span>
              <span className="font-bold text-warning">{zone["Vacancia_%"]}%</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Impulso Mercado:</span>
              <span className="font-bold text-info">{zone["Impulso_Mercado_%"]}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneDetailPanel;
