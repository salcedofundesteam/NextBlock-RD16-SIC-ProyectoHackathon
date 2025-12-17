import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Bot, Menu, X, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import MapSection from '../components/dashboard/MapSection';
import AnalyticsSection from '../components/dashboard/AnalyticsSection';
import MetricsTable from '../components/dashboard/MetricsTable';
import TopZonesTable from '../components/dashboard/TopZonesTable';
import TopCitiesChart from '../components/dashboard/TopCitiesChart';
import StateSelector from '../components/dashboard/StateSelector';
import { useAllData } from '../context/AllDataContext';

const AdminPage: React.FC = () => {
   const navigate = useNavigate();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const { loading } = useAllData();

   const handleLogout = () => {
      localStorage.removeItem('isAuthenticated');
      navigate('/');
   };

   // Loading Screen
   if (loading) {
      return (
         <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <div className="text-center">
               <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                     <Loader2 size={64} className="animate-spin text-primary" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-primary/20 rounded-full animate-ping"></div>
                     </div>
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold text-primary mb-2">NextBlock</h2>
                     <p className="text-base-content/70">Cargando datos del mercado...</p>
                  </div>
                  <div className="flex gap-1 mt-2">
                     <span className="loading loading-dots loading-md text-primary"></span>
                  </div>
               </div>
            </div>
         </div>
      );
   }

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
               <li>
                  <a className="active font-medium bg-primary/10 text-primary">
                     <LayoutDashboard size={20} /> Dashboard
                  </a>
               </li>
               <li>
                  <a onClick={() => navigate('/agent')} className="font-medium cursor-pointer hover:bg-base-200">
                     <Bot size={20} /> Agente IA
                  </a>
               </li>
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
                     <h2 className="text-2xl lg:text-3xl font-bold">Estados Unidos</h2>
                     <p className="text-sm lg:text-base text-base-content/70">Encuentra la zona ideal para tus inversiones.</p>
                  </div>
               </div>

               <div className="hidden lg:block">
                  <div className="badge badge-accent badge-outline p-3 font-medium">v2.0 dashboard</div>
               </div>
            </div>

            {/* New Grid System */}
            <DashboardLayout>

               {/* 0. State Selector */}
               <StateSelector />

               {/* 1. Stats Cards (Top) */}
               <StatsOverview />

               {/* 2. Map (Left/Center - 8 cols) */}
               <MapSection />

               {/* 3. Small Charts (Right - 4 cols) - Positioned alongside map */}
               <AnalyticsSection />

               {/* 4. Metrics Tables (Below Map - 4 cols each in left column area) */}
               <TopCitiesChart />
               <MetricsTable />
               <TopZonesTable />

            </DashboardLayout>
         </main>
      </div>
   );
};

export default AdminPage;
