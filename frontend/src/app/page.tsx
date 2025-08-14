"use client"

import SearchBar from "@/components/search/SearchBar";
import { useAppContext } from "@/context/AppContext";
import { ViaCepResponse } from "@/types/location";

// Criamos um client component para poder usar o hook useAppContext
function HomePageClient() {
  const { isLoading, error } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center w-full">
        <h1 className="text-4xl font-bold mb-2 text-[var(--light-color)]">Encontre o que precisa, bem aí.</h1>
        <p className="mb-8 text-lg text-gray-300">Seu guia de serviços públicos em São Paulo.</p>
        <SearchBar onSearch={function (data: { cep: string; address: ViaCepResponse; coordinates: { lat: number; lng: number; }; serviceType: string; }): void {
          throw new Error("Function not implemented.");
        } } />
        {isLoading && <p className="mt-4 animate-pulse">Buscando...</p>}
        {error && <div className="mt-4 p-3 bg-red-900 border border-red-700 text-white rounded-lg">{error}</div>}
      </div>
    </div>
  );
}

export default function Home() {
  return <HomePageClient />;
}