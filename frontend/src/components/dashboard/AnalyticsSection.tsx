import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAllData } from '../../context/AllDataContext';

const COLORS = {
  'Alto Potencial': '#22c55e',
  'Potencial Moderado': '#f59e0b',
  'Bajo Potencial': '#ef4444',
  'Estable': '#3b82f6',
  'default': '#6b7280'
};

const AnalyticsSection: React.FC = () => {
  const { filteredData: data, loading } = useAllData();

  // Distribución por clasificación
  const classificationData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const counts: Record<string, number> = {};
    data.forEach(item => {
      const classification = item.Clasificacion || 'Sin clasificar';
      counts[classification] = (counts[classification] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: COLORS[name as keyof typeof COLORS] || COLORS.default
    }));
  }, [data]);

  // Distribución de precios por rangos
  const priceRangeData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const ranges = {
      '< $100K': 0,
      '$100K-200K': 0,
      '$200K-300K': 0,
      '$300K-500K': 0,
      '> $500K': 0
    };

    data.forEach(item => {
      const price = parseFloat(item.Precio_Actual || '0');
      if (price < 100000) ranges['< $100K']++;
      else if (price < 200000) ranges['$100K-200K']++;
      else if (price < 300000) ranges['$200K-300K']++;
      else if (price < 500000) ranges['$300K-500K']++;
      else ranges['> $500K']++;
    });

    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, [data]);

  // No additional calculations needed for analytics section

  if (loading) {
    return (
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-xl border border-base-200 h-[200px] animate-pulse">
            <div className="card-body p-4">
              <div className="h-4 bg-base-300 rounded w-32 mb-4"></div>
              <div className="h-full bg-base-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
      {/* Distribución por Clasificación */}
      <div className="card bg-base-100 shadow-xl border border-base-200 h-[260px]">
        <div className="card-body p-4">
          <h3 className="card-title text-lg opacity-70 justify-center">
            <b>Distribución por Clasificación</b>
          </h3>
          <div className="h-full w-full flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {classificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} zonas`, '']}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 text-xs space-y-1">
              {classificationData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="truncate">{item.name}</span>
                  <span className="font-bold ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Distribución de Precios */}
      <div className="card bg-base-100 shadow-xl border border-base-200 h-[260px]">
        <div className="card-body p-4">
          <h3 className="card-title text-lg opacity-70 justify-center">
              <b>Distribución de Precios</b>
          </h3>
          <div className="h-full w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceRangeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                <XAxis type="number" fontSize={9} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" fontSize={9} axisLine={false} tickLine={false} width={60} />
                <Tooltip
                  formatter={(value: number) => [`${value} propiedades`, '']}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
