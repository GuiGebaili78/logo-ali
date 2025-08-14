"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ViaCepResponse } from '../types/location';
import { CataBagulhoResult } from '../types/cataBagulho';

interface AppContextType {
  address: ViaCepResponse | null;
  setAddress: (address: ViaCepResponse | null) => void;
  searchResults: CataBagulhoResult[];
  setSearchResults: (results: CataBagulhoResult[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<ViaCepResponse | null>(null);
  const [searchResults, setSearchResults] = useState<CataBagulhoResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = {
    address,
    setAddress,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};