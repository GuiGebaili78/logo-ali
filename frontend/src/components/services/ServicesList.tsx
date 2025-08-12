"use client";

import React, { useState } from "react";
import { Service } from "../../types/services";
import { SERVICE_ICONS } from "../../utils/constants";
import {
  formatDateISO,
  formatTimeISO,
  formatDistanceMetersToKm,
} from "../../utils/formatters";
import Button from "../ui/Button";
import ServiceDetailsModal from "../services/ServiceDatailsModal";
import Loading from "../ui/Loading";

interface ServicesListProps {
  services: Service[];
  loading?: boolean;
  onServiceSelect?: (serviceId: number) => void;
}

export default function ServicesList({
  services,
  loading,
  onServiceSelect,
}: ServicesListProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceDetails = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleViewOnMap = (service: Service) => {
    onServiceSelect?.(service.id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-[var(--primary-color)] mb-4">
          Serviços Disponíveis
        </h2>
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-[var(--primary-color)] mb-4">
        Serviços Disponíveis
        {services.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({services.length} encontrados)
          </span>
        )}
      </h2>

      {services.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">🔍</div>
          <p className="text-gray-500 mb-2">Nenhum serviço encontrado</p>
          <p className="text-sm text-gray-400">
            Tente buscar por um endereço ou CEP para ver os serviços disponíveis
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">
                      {SERVICE_ICONS[
                        service.type as keyof typeof SERVICE_ICONS
                      ] || "📋"}
                    </span>
                    <h3 className="font-semibold text-[var(--primary-color)]">
                      {service.name}
                    </h3>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>{service.address}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span>📅</span>
                        <span>{formatDateISO(service.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>⏰</span>
                        <span>{formatTimeISO(service.time)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>📏</span>
                        <span>
                          {formatDistanceMetersToKm(service.distance)}
                        </span>
                      </div>
                    </div>

                    {service.description && (
                      <p className="text-gray-500 text-xs mt-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => handleServiceDetails(service)}
                >
                  Saiba Mais
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleViewOnMap(service)}
                >
                  Ver no Mapa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalhes */}
      {selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}
