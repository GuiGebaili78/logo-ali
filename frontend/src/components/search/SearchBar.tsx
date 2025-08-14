import React, { useState, useEffect } from "react";
import { fetchCep } from "../../services/viacep";
import { geocodeAddress } from "../../services/nominatim";
import { SERVICE_TYPES } from "../../utils/constants";
import { formatCep } from "../../utils/formatters";
import type { ViaCepResponse } from "../../types/location";

interface SearchBarProps {
  onSearch: (data: {
    cep: string;
    address: ViaCepResponse;
    coordinates: { lat: number; lng: number };
    serviceType: string;
  }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [cepValue, setCepValue] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [serviceType, setServiceType] = useState("cata-bagulho");
  const [addressData, setAddressData] = useState<ViaCepResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"cep" | "address" | "service">("cep");

  // Auto-busca CEP quando completar 8 dígitos
  useEffect(() => {
    if (cepValue.replace(/\D/g, "").length === 8) {
      handleCepLookup();
    }
  }, [cepValue]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCepValue(formatted);
    setError("");
    
    if (formatted.length < 9) {
      setStep("cep");
      setAddressData(null);
    }
  };

  const handleCepLookup = async () => {
    const cleanCep = cepValue.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setLoading(true);
    setError("");

    try {
      const data = await fetchCep(cleanCep);
      setAddressData(data);
      setStep("address");
      
      // Foca no campo de número automaticamente
      setTimeout(() => {
        const numberInput = document.getElementById("number-input");
        if (numberInput) numberInput.focus();
      }, 100);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar CEP");
      setStep("cep");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!addressData || !numberValue.trim()) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Monta o endereço completo para geocodificação
      const fullAddress = `${addressData.logradouro}, ${numberValue}, ${addressData.localidade}, ${addressData.uf}, Brasil`;
      
      const geocodeResults = await geocodeAddress(fullAddress);
      
      if (geocodeResults.length === 0) {
        throw new Error("Não foi possível encontrar as coordenadas deste endereço");
      }

      const coordinates = {
        lat: parseFloat(geocodeResults[0].lat),
        lng: parseFloat(geocodeResults[0].lon),
      };

      // Chama o callback com todos os dados necessários
      onSearch({
        cep: cepValue,
        address: addressData,
        coordinates,
        serviceType,
      });

    } catch (err: any) {
      setError(err.message || "Erro ao processar endereço");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto transform transition-all duration-300 hover:shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Encontre Serviços Públicos
        </h2>
        <p className="text-gray-600">
          Digite seu CEP para localizar serviços próximos a você
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Campo CEP */}
        <div className="relative">
          <label htmlFor="cep-input" className="block text-sm font-semibold text-gray-700 mb-2">
            CEP *
          </label>
          <div className="relative">
            <input
              id="cep-input"
              type="text"
              value={cepValue}
              onChange={handleCepChange}
              onKeyPress={(e) => handleKeyPress(e, handleCepLookup)}
              placeholder="00000-000"
              maxLength={9}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
              disabled={loading}
            />
            {loading && step === "cep" && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Informações do Endereço */}
        {addressData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Logradouro</label>
              <p className="text-sm font-semibold text-gray-900">{addressData.logradouro}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Bairro</label>
              <p className="text-sm font-semibold text-gray-900">{addressData.bairro}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cidade</label>
              <p className="text-sm font-semibold text-gray-900">{addressData.localidade}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
              <p className="text-sm font-semibold text-gray-900">{addressData.uf}</p>
            </div>
          </div>
        )}

        {/* Campo Número */}
        {step !== "cep" && (
          <div>
            <label htmlFor="number-input" className="block text-sm font-semibold text-gray-700 mb-2">
              Número *
            </label>
            <input
              id="number-input"
              type="text"
              value={numberValue}
              onChange={(e) => setNumberValue(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleSearch)}
              placeholder="Ex: 123"
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
              disabled={loading}
            />
          </div>
        )}

        {/* Seletor de Serviço */}
        {step !== "cep" && (
          <div>
            <label htmlFor="service-select" className="block text-sm font-semibold text-gray-700 mb-2">
              Serviço Desejado *
            </label>
            <select
              id="service-select"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
              disabled={loading}
            >
              {SERVICE_TYPES.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botão de Busca */}
        {step !== "cep" && (
          <button
            onClick={handleSearch}
            disabled={loading || !addressData || !numberValue.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Buscando...
              </div>
            ) : (
              "🔍 Buscar Serviços"
            )}
          </button>
        )}
      </div>
    </div>
  );
}