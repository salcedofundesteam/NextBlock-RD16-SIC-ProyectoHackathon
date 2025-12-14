import React from 'react';
import { MapPin } from 'lucide-react';
import { useAllData } from '../../context/AllDataContext';

// Mapa de códigos de estado a nombres completos
const STATE_NAMES: Record<string, string> = {
    'TX': 'Texas',
    'CA': 'California',
    'NY': 'Nueva York',
    'FL': 'Florida',
    'IL': 'Illinois',
    'PA': 'Pensilvania',
    'OH': 'Ohio',
    'GA': 'Georgia',
    'NC': 'Carolina del Norte',
    'MI': 'Michigan',
    'NJ': 'Nueva Jersey',
    'VA': 'Virginia',
    'WA': 'Washington',
    'AZ': 'Arizona',
    'MA': 'Massachusetts',
    'TN': 'Tennessee',
    'IN': 'Indiana',
    'MO': 'Misuri',
    'MD': 'Maryland',
    'WI': 'Wisconsin',
    'CO': 'Colorado',
    'MN': 'Minnesota',
    'SC': 'Carolina del Sur',
    'AL': 'Alabama',
    'LA': 'Luisiana',
    'KY': 'Kentucky',
    'OR': 'Oregón',
    'OK': 'Oklahoma',
    'CT': 'Connecticut',
    'UT': 'Utah',
    'IA': 'Iowa',
    'NV': 'Nevada',
    'AR': 'Arkansas',
    'MS': 'Misisipi',
    'KS': 'Kansas',
    'NM': 'Nuevo México',
    'NE': 'Nebraska',
    'ID': 'Idaho',
    'WV': 'Virginia Occidental',
    'HI': 'Hawái',
    'NH': 'Nueva Hampshire',
    'ME': 'Maine',
    'MT': 'Montana',
    'RI': 'Rhode Island',
    'DE': 'Delaware',
    'SD': 'Dakota del Sur',
    'ND': 'Dakota del Norte',
    'AK': 'Alaska',
    'VT': 'Vermont',
    'WY': 'Wyoming',
    'DC': 'Washington D.C.'
};

const StateSelector: React.FC = () => {
    const { selectedState, setSelectedState, availableStates, filteredData, data, loading } = useAllData();

    const getStateName = (code: string) => STATE_NAMES[code] || code;

    if (loading) {
        return (
            <div className="col-span-1 lg:col-span-12">
                <div className="card bg-base-100 shadow-xl border border-base-200 animate-pulse">
                    <div className="card-body p-4 flex-row items-center gap-4">
                        <div className="h-10 bg-base-300 rounded w-48"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="col-span-1 lg:col-span-12">
            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Selector */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2 text-primary">
                            <MapPin size={24} />
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <select
                                className="select select-bordered select-sm w-full"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                            >
                                {availableStates.map(state => {
                                    const count = data.filter(d => (d.State || d.Estado) === state).length;
                                    return (
                                        <option key={state} value={state}>
                                            📍 {getStateName(state)} ({count} zonas)
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    {/* Info del estado seleccionado */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="badge badge-primary badge-lg gap-2">
                            <span className="font-bold">{filteredData.length}</span> zonas
                        </div>
                        <div className="badge badge-outline badge-lg">
                            {getStateName(selectedState)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StateSelector;
