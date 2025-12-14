import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useAllData } from '../../context/AllDataContext';

const TopCitiesChart: React.FC = () => {
    const { filteredData } = useAllData();

    // Top 10 ciudades por cantidad de zonas
    const topCitiesData = useMemo(() => {
        if (!filteredData || filteredData.length === 0) return [];

        const cityCounts: Record<string, number> = {};
        filteredData.forEach(item => {
            const city = item.City || item.Ciudad || 'Desconocida';
            cityCounts[city] = (cityCounts[city] || 0) + 1;
        });

        return Object.entries(cityCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, value]) => ({ name: name.substring(0, 10), value, fullName: name }));
    }, [filteredData]);

    return (
        <div className="col-span-1 lg:col-span-4 card bg-base-100 shadow-xl border border-base-200 h-[260px]">
            <div className="card-body p-4">
                <h3 className="card-title text-sm opacity-70">
                    🏙️ Top Ciudades por Zonas
                </h3>
                <div className="h-full w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topCitiesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="name" fontSize={8} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={40} />
                            <YAxis fontSize={9} axisLine={false} tickLine={false} />
                            <Tooltip
                                formatter={(value: number) => [`${value} zonas`, '']}
                                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TopCitiesChart;
