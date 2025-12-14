import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback, useMemo } from 'react';
import { getAllData, type IAllData } from '../api';

interface AllDataContextType {
  data: IAllData[];
  filteredData: IAllData[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  selectedState: string;
  setSelectedState: (state: string) => void;
  availableStates: string[];
}

const AllDataContext = createContext<AllDataContextType | undefined>(undefined);

export const useAllData = (): AllDataContextType => {
  const context = useContext(AllDataContext);
  if (!context) {
    throw new Error('useAllData must be used within an AllDataProvider');
  }
  return context;
};

interface AllDataProviderProps {
  children: ReactNode;
}

export const AllDataProvider: React.FC<AllDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<IAllData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('TX');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllData();
      setData(result);

      // Auto-seleccionar TX o el primer estado disponible
      const states = new Set<string>();
      result.forEach(item => {
        const state = item.State || item.Estado;
        if (state) states.add(state);
      });
      const sortedStates = Array.from(states).sort();
      if (sortedStates.length > 0) {
        // Si TX está disponible, seleccionarlo, sino el primero
        if (sortedStates.includes('TX')) {
          setSelectedState('TX');
        } else {
          setSelectedState(sortedStates[0]);
        }
      }
    } catch (err) {
      setError('Error al cargar datos del servidor. Asegúrese que el backend esté activo.');
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Extraer estados únicos de los datos
  const availableStates = useMemo(() => {
    const states = new Set<string>();
    data.forEach(item => {
      const state = item.State || item.Estado;
      if (state) states.add(state);
    });
    return Array.from(states).sort();
  }, [data]);

  // Filtrar datos por estado seleccionado
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const state = item.State || item.Estado;
      return state === selectedState;
    });
  }, [data, selectedState]);

  return (
    <AllDataContext.Provider value={{
      data,
      filteredData,
      loading,
      error,
      refreshData: fetchData,
      selectedState,
      setSelectedState,
      availableStates
    }}>
      {children}
    </AllDataContext.Provider>
  );
};
