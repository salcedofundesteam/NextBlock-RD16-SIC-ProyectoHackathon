import  { useMemo,useState } from 'react';
import { useAllData } from '../../context/AllDataContext';
import { div } from 'framer-motion/client';

const TopZonesTable: React.FC = () => {
    const { filteredData, data } = useAllData();

    const [viewState, setViewState] = useState<boolean>(false);

    const handleViewState = () => {
        setViewState(!viewState);
    };

    // Top 5 zonas por confianza
    const topConfidenceZones = useMemo(() => {
        return [...filteredData]
            .sort((a, b) => parseFloat(b["Confianza_%"] || '0') - parseFloat(a["Confianza_%"] || '0'))
            .slice(0, 5);
    }, [filteredData]);

    // Top 5 estados por promedio de confianza y crecimiento
    const topStates = useMemo(() => {
        if (data.length === 0) return [];

        // Agrupar por estado
        const stateMap = new Map<string, Array<{ confianza: number; crecimiento: number }>>();
        
        data.forEach(item => {
            const state = item.State || item.Estado;
            if (state) {
                const confianza = parseFloat(item["Confianza_%"] || '0');
                const crecimiento = parseFloat(item["Crecimiento_2025_%"] || '0');
                
                if (!stateMap.has(state)) {
                    stateMap.set(state, []);
                }
                stateMap.get(state)!.push({ confianza, crecimiento });
            }
        });

        // Calcular promedios y crear array de estados
        const statesData = Array.from(stateMap.entries()).map(([state, values]) => {
            const avgConfianza = values.reduce((sum, v) => sum + v.confianza, 0) / values.length;
            const avgCrecimiento = values.reduce((sum, v) => sum + v.crecimiento, 0) / values.length;
            
            return {
                State: state,
                AvgConfianza: avgConfianza,
                AvgCrecimiento: avgCrecimiento,
                Count: values.length
            };
        });

        // Ordenar por promedio de confianza (y crecimiento como criterio de desempate)
        return statesData
            .sort((a, b) => {
                const confDiff = b.AvgConfianza - a.AvgConfianza;
                return confDiff !== 0 ? confDiff : b.AvgCrecimiento - a.AvgCrecimiento;
            })
            .slice(0, 5);
    }, [data]);

    return (
        <div className="col-span-1 lg:col-span-4 card bg-base-100 shadow-xl border border-base-200 h-full">
            <div className="card-body p-4">
                <h3 className="card-title text-lg opacity-70  flex justify-around ">
                    {/* <b>Top 5 Zonas por Confianza</b> */}
                    <b>{viewState ? 'Top 5 Estados de Confianza' : 'Top 5 Zonas por Confianzas'}</b>

                    <button className="btn btn-xs btn-outline" onClick={handleViewState}> {viewState ? 'Ver zonas' : 'Ver Estados'}</button>
                </h3>


                {viewState ? (
                    <div className="overflow-x-auto ">
                    <table className="table table-xs">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Prom. Conf.</th>
                                <th>Prom. Crec.</th>
                                <th>Zonas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topStates.map((state, i) => (
                                <tr key={i} className="hover">
                                    <td className="font-mono text-xs font-bold">{state.State}</td>
                                    <td>
                                        <span className="badge badge-success badge-xs">
                                            {state.AvgConfianza.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="text-success font-bold">
                                        {state.AvgCrecimiento.toFixed(1)}%
                                    </td>
                                    <td className="text-xs">{state.Count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                ) : (

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
                )}
            </div>
        </div>
    );
};
export default TopZonesTable;