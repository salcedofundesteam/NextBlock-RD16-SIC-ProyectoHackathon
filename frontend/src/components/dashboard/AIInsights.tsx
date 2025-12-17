import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

const AIInsights: React.FC = () => {
  return (
    <div className="col-span-1 lg:col-span-4 card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border border-base-200">
      <div className="card-body">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-primary">
            <Sparkles size={20} /> Insights de IA
         </h3>
         <p className="text-xs text-base-content/60 mb-4">
            Generado hace 5 min • Modelo v4.2
         </p>
         
         <div className="space-y-4">
            <div className="p-3 bg-base-100 rounded-lg border border-base-200 shadow-sm">
                <div className="flex items-start gap-3">
                    <TrendingUp className="text-success mt-1" size={18}/>
                    <div>
                        <h4 className="font-bold text-sm">Oportunidad de Inversión</h4>
                        <p className="text-xs mt-1 opacity-80">La zona "Sur" muestra un incremento del 8% en demanda de alquileres en el último trimestre. Se recomienda compra para reforma.</p>
                    </div>
                </div>
            </div>

             <div className="p-3 bg-base-100 rounded-lg border border-base-200 shadow-sm">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-warning mt-1" size={18}/>
                    <div>
                        <h4 className="font-bold text-sm">Alerta de Precio</h4>
                        <p className="text-xs mt-1 opacity-80">Volatilidad detectada en "Zona Norte". Los precios podrían ajustarse a la baja en los próximos 15 días.</p>
                    </div>
                </div>
            </div>
         </div>
         
         <div className="mt-4 pt-4 border-t border-base-300">
             <button className="btn btn-primary btn-sm w-full btn-outline gap-2">
                <Sparkles size={16}/> Generar Nuevo Reporte
             </button>
         </div>
      </div>
    </div>
  );
};

export default AIInsights;
