// Caminho: frontend/src/context/AppContext.tsx

import React, { createContext, useContext, useState } from "react";
import { Service, ServiceSearchParams } from "../types/services";
import { Coordinates } from "../types/location";
import * as api from "../services/api";

interface AppContextType {
  services: Service[];
  isLoading: boolean;
  userLocation: Coordinates | null;
  searchParams: ServiceSearchParams;
  performSearch: (params: ServiceSearchParams) => Promise<void>;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setUserLocation: React.Dispatch<React.SetStateAction<Coordinates | null>>;
  setSearchParams: React.Dispatch<React.SetStateAction<ServiceSearchParams>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [searchParams, setSearchParams] = useState<ServiceSearchParams>({});

  const performSearch = async (params: ServiceSearchParams) => {
    setIsLoading(true);
    setSearchParams(params);
    setServices([]);
    setUserLocation(null);

    try {
      const result = await api.searchServices(params);

      // ⚠️ ATENÇÃO: a linha abaixo estava gerando o erro de tipo
      // A correção na API (`api.ts`) resolveu o problema
      setServices(result.services ?? []);

      // Lógica para definir a localização do usuário com segurança
      const cepData = result.services[0]?.cepData;
      if (cepData && cepData.lat && cepData.lng) {
        setUserLocation({
          lat: parseFloat(cepData.lat),
          lng: parseFloat(cepData.lng),
        });
      }
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    services,
    isLoading,
    userLocation,
    searchParams,
    performSearch,
    setServices,
    setUserLocation,
    setSearchParams,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
