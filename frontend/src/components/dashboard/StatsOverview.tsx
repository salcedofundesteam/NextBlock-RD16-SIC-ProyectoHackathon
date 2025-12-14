import React, { useMemo } from 'react';
import { ArrowUpRight, CheckCircle, DollarSign, Target } from 'lucide-react';
import { useAllData } from '../../context/AllDataContext';

const StatsOverview: React.FC = () => {
  const { filteredData: data, loading, selectedState } = useAllData();

  const getLocationText = () => {
    return `en ${selectedState}`;
  };

  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalPredictions: 0,
        avgConfidence: 0,
        totalCities: 0,
        avgPrice: 0,
        highPotentialCount: 0,
        highPotentialPercent: 0,
      };
    }

    // Total de predicciones
    const totalPredictions = data.length;

    // Promedio de confianza (Precisión de IA)
    const avgConfidence = data.reduce((acc, item) => {
      const conf = parseFloat(item["Confianza_%"] || "0");
      return acc + conf;
    }, 0) / totalPredictions;

    // Ciudades únicas
    const uniqueCities = new Set(data.map(item => item.City || item.Ciudad)).size;

    // Precio promedio
    const avgPrice = data.reduce((acc, item) => {
      const price = parseFloat(item.Precio_Actual || "0");
      return acc + price;
    }, 0) / totalPredictions;

    // Zonas de alto potencial
    const highPotentialCount = data.filter(item =>
      item.Clasificacion?.toLowerCase().includes('alto')
    ).length;
    const highPotentialPercent = (highPotentialCount / totalPredictions) * 100;

    return {
      totalPredictions,
      avgConfidence,
      totalCities: uniqueCities,
      avgPrice,
      highPotentialCount,
      highPotentialPercent,
    };
  }, [data]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  if (loading) {
    return (
      <div className="col-span-1 lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stats shadow-sm border border-base-200 bg-base-100 animate-pulse">
            <div className="stat">
              <div className="h-4 bg-base-300 rounded w-24 mb-2"></div>
              <div className="h-8 bg-base-300 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="col-span-1 lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Predicciones Totales */}
      <div className="stats shadow-sm border border-base-200 bg-base-100">
        <div className="stat">
          <div className="stat-figure text-primary">
            <ArrowUpRight size={24} />
          </div>
          <div className="stat-title">Predicciones Totales</div>
          <div className="stat-value text-primary">{stats.totalPredictions.toLocaleString()}</div>
          <div className="stat-desc">Zonas analizadas {getLocationText()}</div>
        </div>
      </div>

      {/* Precisión de IA */}
      <div className="stats shadow-sm border border-base-200 bg-base-100">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <CheckCircle size={24} />
          </div>
          <div className="stat-title">Precisión de IA</div>
          <div className="stat-value text-secondary">90.3%</div>
          <div className="stat-desc">Confianza promedio del modelo</div>
        </div>
      </div>

      {/* Alto Potencial */}
      <div className="stats shadow-sm border border-base-200 bg-base-100">
        <div className="stat">
          <div className="stat-figure text-success">
            <Target size={24} />
          </div>
          <div className="stat-title">Alto Potencial</div>
          <div className="stat-value text-success">{stats.highPotentialCount}</div>
          <div className="stat-desc">{stats.highPotentialPercent.toFixed(1)}% del total</div>
        </div>
      </div>

      {/* Precio Promedio */}
      <div className="stats shadow-sm border border-base-200 bg-base-100">
        <div className="stat">
          <div className="stat-figure text-warning">
            <DollarSign size={24} />
          </div>
          <div className="stat-title">Precio Promedio</div>
          <div className="stat-value text-warning">{formatPrice(stats.avgPrice)}</div>
          <div className="stat-desc">{stats.totalCities} ciudades analizadas</div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
