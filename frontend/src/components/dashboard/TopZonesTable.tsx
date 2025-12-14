import React, { useMemo } from 'react';
import { useAllData } from '../../context/AllDataContext';

const TopZonesTable: React.FC = () => {
    const { filteredData } = useAllData();

    // Top 5 zonas por confianza
    const topConfidenceZones = useMemo(() => {
        return [...filteredData]
            .sort((a, b) => parseFloat(b["Confianza_%"] || '0') - parseFloat(a["Confianza_%"] || '0'))
            .slice(0, 5);
    }, [filteredData]);

    return (
        <div className="col-span-1 lg:col-span-4 card bg-base-100 shadow-xl border border-base-200 h-full">
            <div className="card-body p-4">
                <h3 className="card-title text-sm opacity-70">
                    🏆 Top 5 Zonas por Confianza
                </h3>
                <div className="overflow-x-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Ciudad</th>
                                <th>Conf.</th>
                                <th>Crec.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topConfidenceZones.map((zone, i) => (
                                <tr key={i} className="hover">
                                    <td className="font-mono text-xs">{zone.RegionName}</td>
                                    <td className="truncate max-w-20">{zone.City || zone.Ciudad}</td>
                                    <td>
                                        <span className="badge badge-success badge-xs">
                                            {parseFloat(zone["Confianza_%"] || '0').toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="text-success font-bold">
                                        {parseFloat(zone["Crecimiento_2025_%"] || '0').toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TopZonesTable;
