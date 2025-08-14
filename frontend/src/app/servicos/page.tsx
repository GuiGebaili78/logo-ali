"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "../../components/layout/Layout";
import ServicesList from "../../components/services/ServicesList";
import MapView from "../../components/map/MapView";
import Loading from "../../components/ui/Loading";
import { searchCataBagulho } from "../../services/api";
import type { CataBagulhoResult } from "../../types/cataBagulho";

function ServicesContent() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<CataBagulhoResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [addressInfo, setAddressInfo] = useState<{
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
    cep: string;
  } | null>(null);

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const cep = searchParams.get("cep");
    const logradouro = searchParams.get("logradouro");
    const bairro = searchParams.get("bairro");
    const localidade = searchParams.get("localidade");
    const uf = searchParams.get("uf");
    const service = searchParams.get("service");

    if (!lat || !lng || !service) {
      setError("Parâmetros de busca inválidos");
      setLoading(false);
      return;
    }

    // Define as informações do endereço
    setAddressInfo({
      logradouro: logradouro || "",
      bairro: bairro || "",
      localidade: localidade || "",
      uf: uf || "",
      cep: cep || "",
    });

    setCoordinates({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });

    // Busca os serviços baseado no tipo selecionado
    if (service === "cata-bagulho") {
      searchCataBagulhoServices(parseFloat(lat), parseFloat(lng));
    } else {
      setError("Tipo de serviço ainda não implementado");
      setLoading(false);
    }
  }, [searchParams]);

  const searchCataBagulhoServices = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      setError("");
      
      const results = await searchCataBagulho(lat, lng);
      setServices(results);
      
      if (results.length === 0) {
        setError("Nenhum serviço encontrado para esta localização");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Erro ao buscar serviços");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ops! Algo deu errado</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.history.back()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header com informações do endereço */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Serviços Encontrados
                </h1>
                {addressInfo && (
                  <p className="text-gray-600">
                    📍 {addressInfo.logradouro}, {addressInfo.bairro} - {addressInfo.localidade}/{addressInfo.uf}
                    {addressInfo.cep && ` - CEP: ${addressInfo.cep}`}
                  </p>
                )}
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  🚛 Cata-Bagulho
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lista de Serviços */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Resultados ({services.length})
                </h2>
                {services.length > 0 ? (
                  <ServicesList services={services} />
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-gray-500">
                      Nenhum serviço encontrado para esta localização
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mapa */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-96 lg:h-[600px]">
                  {coordinates ? (
                    <MapView
                      center={coordinates}
                      services={services.map((service, index) => ({
                        id: index,
                        type: 'cata-bagulho',
                        name: service.street,
                        address: `${service.street} - ${service.startStretch || 'Trecho não especificado'}`,
                        date: service.dates?.[0] || 'Data não informada',
                        time: service.schedule || 'Horário não informado',
                        distance: '0m',
                        description: `${service.frequency} - ${service.shift}`,
                        coordinates: [coordinates.lat, coordinates.lng],
                        cepData: undefined,
                        additionalInfo: {
                          startStretch: service.startStretch,
                          endStretch: service.endStretch,
                          frequency: service.frequency,
                          shift: service.shift,
                          schedule: service.schedule,
                        },
                      }))}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100">
                      <p className="text-gray-500">Carregando mapa...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ServicesContent />
    </Suspense>
  );
}