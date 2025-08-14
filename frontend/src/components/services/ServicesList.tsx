import React from "react";
import type { CataBagulhoResult } from "../../types/cataBagulho";

interface ServicesListProps {
  services: CataBagulhoResult[];
}

export default function ServicesList({ services }: ServicesListProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-gray-500">Nenhum serviço encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 bg-white"
        >
          {/* Cabeçalho do Card */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                📍 {service.street}
              </h3>
              {(service.startStretch || service.endStretch) && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Trecho:</strong>{" "}
                  {service.startStretch && `Início: ${service.startStretch}`}
                  {service.startStretch && service.endStretch && " • "}
                  {service.endStretch && `Fim: ${service.endStretch}`}
                </p>
              )}
            </div>
            <div className="ml-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🚛 Cata-Bagulho
              </span>
            </div>
          </div>

          {/* Informações do Serviço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Datas */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-sm">📅</span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Datas
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {service.dates && service.dates.length > 0 
                    ? service.dates.join(", ") 
                    : "Não informado"}
                </p>
              </div>
            </div>

            {/* Frequência */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 text-sm">🔄</span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Frequência
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {service.frequency || "Não informado"}
                </p>
              </div>
            </div>

            {/* Turno */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 text-sm">🌅</span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Turno
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {service.shift || "Não informado"}
                </p>
              </div>
            </div>

            {/* Horário */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-sm">⏰</span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Horário
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {service.schedule || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          {/* Linha de separação e informação adicional */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                ✨ Deixe objetos grandes na calçada no horário indicado
              </p>
              <button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Ver no mapa →
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Informações importantes */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">
          ⚠️ Instruções importantes:
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Deixe os objetos na calçada, próximo ao meio-fio</li>
          <li>• Não deixe objetos em esquinas ou em frente a garagens</li>
          <li>• Objetos eletrônicos podem ser coletados separadamente</li>
          <li>• Respeite os horários e datas indicados</li>
        </ul>
      </div>
    </div>
  );
}