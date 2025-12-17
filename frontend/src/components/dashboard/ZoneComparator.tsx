import React, { useState } from 'react';

const mockZoneData: Record<string, { roi: string; price: string; growth: string; score: number }> = {
  'A': { roi: '12%', price: '2,400 usd/m²', growth: '+5%', score: 8.5 },
  'B': { roi: '8.5%', price: '1,900 usd/m²', growth: '+2%', score: 7.2 },
  'C': { roi: '15%', price: '3,100 usd/m²', growth: '+8%', score: 9.1 },
};

const ZoneComparator: React.FC = () => {
  const [zoneA, setZoneA] = useState('A');
  const [zoneB, setZoneB] = useState('B');

  const dataA = mockZoneData[zoneA];
  const dataB = mockZoneData[zoneB];

  return (
    <div className="col-span-1 lg:col-span-8 card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body">
         <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>🔍</span> Comparador de Zonas
         </h3>
         
         <div className="grid grid-cols-2 gap-4 mb-4">
            <select 
              className="select select-bordered w-full max-w-xs"
              value={zoneA}
              onChange={(e) => setZoneA(e.target.value)}
            >
              <option value="A">Zona Centro</option>
              <option value="B">Zona Norte</option>
              <option value="C">Zona Sur</option>
            </select>
            
             <select 
              className="select select-bordered w-full max-w-xs"
              value={zoneB}
              onChange={(e) => setZoneB(e.target.value)}
            >
              <option value="A">Zona Centro</option>
              <option value="B">Zona Norte</option>
              <option value="C">Zona Sur</option>
            </select>
         </div>

         <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                   <th>Métrica</th>
                   <th className="text-primary font-bold">Zona {zoneA === 'A' ? 'Centro' : zoneA === 'B' ? 'Norte' : 'Sur'}</th>
                   <th className="text-secondary font-bold">Zona {zoneB === 'A' ? 'Centro' : zoneB === 'B' ? 'Norte' : 'Sur'}</th>
                   <th>Diferencia</th>
                </tr>
              </thead>
              <tbody>
                 <tr className="hover">
                    <td>ROI Estimado</td>
                    <td className="font-medium">{dataA.roi}</td>
                    <td className="font-medium">{dataB.roi}</td>
                    <td>
                        {parseFloat(dataA.roi) > parseFloat(dataB.roi) ? 
                          <span className="text-success text-xs font-bold">Zona A gana</span> : 
                          <span className="text-error text-xs font-bold">Zona B gana</span>
                        }
                    </td>
                 </tr>
                 <tr className="hover">
                    <td>Precio Promedio</td>
                    <td>{dataA.price}</td>
                    <td>{dataB.price}</td>
                    <td>-</td>
                 </tr>
                 <tr className="hover">
                    <td>Crecimiento Anual</td>
                    <td>{dataA.growth}</td>
                    <td>{dataB.growth}</td>
                    <td>-</td>
                 </tr>
                 <tr className="hover">
                    <td>Puntuación IA</td>
                    <td><progress className="progress progress-primary w-20" value={dataA.score} max="10"></progress> {dataA.score}</td>
                    <td><progress className="progress progress-secondary w-20" value={dataB.score} max="10"></progress> {dataB.score}</td>
                    <td>-</td>
                 </tr>
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default ZoneComparator;
