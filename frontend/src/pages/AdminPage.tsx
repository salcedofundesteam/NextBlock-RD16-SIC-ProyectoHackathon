import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, PieChart, Users, Settings, Menu, X } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import MapSection from '../components/dashboard/MapSection';
import AnalyticsSection from '../components/dashboard/AnalyticsSection';
import ZoneComparator from '../components/dashboard/ZoneComparator';
import AIInsights from '../components/dashboard/AIInsights';

const AdminPage: React.FC = () => {
   const navigate = useNavigate();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   const handleLogout = () => {
      localStorage.removeItem('isAuthenticated');
      navigate('/');
   };

   return (
      <div className="min-h-screen bg-base-200 flex font-sans text-base-content">
         {/* Mobile Sidebar Overlay */}
         {isSidebarOpen && (
            <div
               className="fixed inset-0 bg-black/50 z-40 lg:hidden"
               onClick={() => setIsSidebarOpen(false)}
            ></div>
         )}

         {/* Sidebar */}
         <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
            <div className="p-6 flex justify-between items-center">
               <h1 className="text-2xl font-bold text-primary">NextBlock</h1>
               <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden btn btn-ghost btn-sm btn-circle">
                  <X size={20} />
               </button>
            </div>
            <ul className="menu p-4 w-full h-full text-base-content space-y-2">
               <li><a className="active font-medium"><LayoutDashboard size={20} /> Tablero</a></li>
               <li><a className="font-medium"><PieChart size={20} /> Análisis</a></li>
               <li><a className="font-medium"><Users size={20} /> Clientes</a></li>
               <li><a className="font-medium"><Settings size={20} /> Configuración</a></li>
            </ul>
            <div className="p-4 border-t border-base-200">
               <button onClick={handleLogout} className="btn btn-outline btn-error w-full gap-2">
                  <LogOut size={18} /> Salir
               </button>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-screen">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
               <div className="flex items-center gap-3">
                  <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden btn btn-square btn-ghost">
                     <Menu size={24} />
                  </button>
                  <div>
                     <h2 className="text-2xl lg:text-3xl font-bold">Panel de Administración</h2>
                     <p className="text-sm lg:text-base text-base-content/70">Bienvenido de nuevo, Administrador.</p>
                  </div>
               </div>

               <div className="hidden lg:block">
                  <div className="badge badge-accent badge-outline p-3 font-medium">v2.0 dashboard</div>
               </div>
            </div>

            {/* New Grid System */}
            <DashboardLayout>

               {/* 1. Stats Cards (Top) */}
               <StatsOverview />

               {/* 2. Map (Left/Center - 8 cols) */}
               <MapSection />

               {/* 3. Small Charts (Right - 4 cols) */}
               <AnalyticsSection />

               {/* 4. Zone Comparator (Bottom Left - 8 cols) */}
               {/* <ZoneComparator /> */}

               {/* <div className="col-span-1 lg:col-span-8 card bg-base-100 shadow-xl border border-base-200">
                  <div className="card-body justify-center text-center">
                     <h3 className="font-bold  mb-4 flex items-center gap-2 text-center text-4xl ">
                        <span>👀</span> Proximante
                     </h3>
                  </div>
               </div> */}


               {/* 5. AI Insights (Bottom Right - 4 cols) */}
               {/* <AIInsights /> */}

            </DashboardLayout>
         </main>
      </div>
   );
};

export default AdminPage;
