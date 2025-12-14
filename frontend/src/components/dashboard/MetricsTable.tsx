import React, { useMemo } from 'react';
import { useAllData } from '../../context/AllDataContext';

const MetricsTable: React.FC = () => {
    const { filteredData } = useAllData();

    // Calcular promedio de métricas por clasificación
    const avgMetricsByClass = useMemo(() => {
        const classifications = ['Alto Potencial', 'Buena Oportunidad', 'Promedio', 'Bajo Potencial'];
        return classifications.map(classification => {
            const zonesOfType = filteredData.filter(z => z.Clasificacion === classification);
            if (zonesOfType.length === 0) return { name: classification, crecimiento: 0, asequibilidad: 0, impulso: 0 };

            const avgCrecimiento = zonesOfType.reduce((sum, z) => sum + parseFloat(z["Crecimiento_2025_%"] || '0'), 0) / zonesOfType.length;
            const avgAsequibilidad = zonesOfType.reduce((sum, z) => sum + parseFloat(z.Asequibilidad || '0'), 0) / zonesOfType.length;
            const avgImpulso = zonesOfType.reduce((sum, z) => sum + parseFloat(z["Impulso_Mercado_%"] || '0'), 0) / zonesOfType.length;

            return {
                name: classification,
                crecimiento: avgCrecimiento.toFixed(1),
                asequibilidad: avgAsequibilidad.toFixed(1),
                impulso: avgImpulso.toFixed(1)
            };
        });
    }, [filteredData]);

    return (
        <div className="col-span-1 lg:col-span-4 card bg-base-100 shadow-xl border border-base-200 h-full">
            <div className="card-body p-4">
                <h3 className="card-title text-sm opacity-70">
                    📊 Métricas Promedio por Tipo
                </h3>
                <div className="overflow-x-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Crec.</th>
                                <th>Aseq.</th>
                                <th>Imp.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {avgMetricsByClass.map((metric, i) => (
                                <tr key={i} className="hover">
                                    <td className="font-bold text-xs">{metric.name}</td>
                                    <td className="text-success">{metric.crecimiento}%</td>
                                    <td className="text-info">{metric.asequibilidad}</td>
                                    <td className="text-warning">{metric.impulso}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MetricsTable;
