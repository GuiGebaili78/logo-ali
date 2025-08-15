"use client";

import { useState } from "react";
import { Layout } from "../components/layout/Layout";
import { SearchBar } from "../components/search/SearchBar";
import { ServiceSelector } from "../components/search/ServiceSelector";
import { ServicesList } from "../components/services/ServicesList";
import { MapView } from "../components/map/MapView";
import { Button } from "../components/ui/Button";
import { Loading } from "../components/ui/Loading";
import { searchCataBagulho } from "../services/api";
import { geocodeAddress } from "../services/nominatim";
import { fetchCep } from "../services/viacep";
import { CataBagulhoResult } from "../types/cataBagulho";
import { ViaCepResponse } from "../types/location";
import { validateCep } from "../utils/validators";

export default function Home() {
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [endereco, setEndereco] = useState<ViaCepResponse | null>(null);
  const [coordenadas, setCoordenadas] = useState<{lat: number, lng: number} | null>(null);
  const [serviceType, setServiceType] = useState("cata-bagulho");
  const [results, setResults] = useState<CataBagulhoResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCompleted, setSearchCompleted] = useState(false);

  const handleCepChange = async (newCep: string) => {
    setCep(newCep);
    setError(null);
    setEndereco(null);
    setCoordenadas(null);
    setResults([]);
    setSearchCompleted(false);

    // Busca dados do CEP quando ele tiver 9 caracteres (formato: 12345-678)
    if (newCep.length === 9 && validateCep(newCep)) {
      setIsLoading(true);
      try {
        const cepData = await fetchCep(newCep);
        setEndereco(cepData);
        // Auto-foco no campo de número
        setTimeout(() => {
          const numeroField = document.querySelector('input[placeholder*="número"]') as HTMLInputElement;
          if (numeroField) {
            numeroField.focus();
          }
        }, 100);
      } catch (error: any) {
        setError(error.message || "Erro ao buscar CEP");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    if (!endereco || !numero.trim()) {
      setError("Por favor, preencha o CEP e o número da residência");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      // Monta o endereço completo para geocodificação
      const enderecoCompleto = `${endereco.logradouro}, ${numero}, ${endereco.bairro}, ${endereco.localidade}, ${endereco.uf}`;
      
      // Busca coordenadas
      console.log("Buscando coordenadas para:", enderecoCompleto);
      const geocodeResults = await geocodeAddress(enderecoCompleto);
      
      if (geocodeResults.length === 0) {
        throw new Error("Não foi possível encontrar as coordenadas para este endereço");
      }

      const coords = {
        lat: parseFloat(geocodeResults[0].lat),
        lng: parseFloat(geocodeResults[0].lon)
      };
      
      setCoordenadas(coords);
      console.log("Coordenadas encontradas:", coords);

      // Busca serviços baseado no tipo selecionado
      if (serviceType === "cata-bagulho") {
        console.log("Buscando dados do Cata-Bagulho...");
        const serviceResults = await searchCataBagulho(coords.lat, coords.lng);
        setResults(serviceResults);
        console.log("Resultados encontrados:", serviceResults.length);
      }

      setSearchCompleted(true);
    } catch (error: any) {
      console.error("Erro na busca:", error);
      setError(error.message || "Erro ao realizar busca");
    } finally {
      setIsLoading(false);
    }
  };

  const canSearch = endereco && numero.trim() && !isLoading;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🏢 Logo Ali
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encontre serviços públicos de São Paulo próximos ao seu endereço
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <SearchBar
                  cep={cep}
                  numero={numero}
                  onCepChange={handleCepChange}
                  onNumeroChange={setNumero}
                  endereco={endereco}
                  isLoading={isLoading}
                />
              </div>
              <div>
                <ServiceSelector
                  selectedService={serviceType}
                  onServiceChange={setServiceType}
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={handleSearch}
                disabled={!canSearch}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Loading size="sm" /> : "🔍 Buscar Serviços"}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {searchCompleted && (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Services List */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    📋 Resultados Encontrados
                  </h2>
                  {results.length > 0 ? (
                    <ServicesList results={results} serviceType={serviceType} />
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <div className="text-6xl mb-4">😔</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Nenhum serviço encontrado
                      </h3>
                      <p className="text-gray-600">
                        Não encontramos serviços de {serviceType} para este endereço.
                        Tente um endereço próximo.
                      </p>
                    </div>
                  )}
                </div>

                {/* Map */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    🗺️ Localização
                  </h2>
                  {coordenadas && (
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <MapView
                        center={[coordenadas.lat, coordenadas.lng]}
                        results={results}
                        userLocation={coordenadas}
                      />
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                        <p>
                          <strong>📍 Endereço:</strong>{" "}
                          {endereco?.logradouro}, {numero} - {endereco?.bairro}, {endereco?.localidade}/{endereco?.uf}
                        </p>
                        <p>
                          <strong>🌐 Coordenadas:</strong>{" "}
                          {coordenadas.lat.toFixed(6)}, {coordenadas.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}