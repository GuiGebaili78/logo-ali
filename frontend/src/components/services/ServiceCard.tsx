import React from "react";
import type { Service } from "../../types/services";

interface Props {
  service: Service;
  onOpenDetails?: (service: Service) => void;
  onViewOnMap?: (service: Service) => void;
}

export default function ServiceCard({
  service,
  onOpenDetails,
  onViewOnMap,
}: Props) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{service.name}</h3>
          <div className="text-sm text-gray-600">{service.type}</div>
        </div>
        <div className="text-right text-sm">
          <div className="font-medium">{service.distance ?? "—"}</div>
          <div className="text-xs text-gray-500">
            {service.date} {service.time}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-700">{service.address}</div>

      {service.description && (
        <div className="text-sm text-gray-600">{service.description}</div>
      )}

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onOpenDetails && onOpenDetails(service)}
          className="flex-1 bg-accent-color hover:opacity-90 text-white py-2 rounded-md text-sm"
          style={{ backgroundColor: "var(--accent-color)" }}
        >
          Saiba Mais
        </button>

        <button
          onClick={() => onViewOnMap && onViewOnMap(service)}
          className="px-4 py-2 border rounded-md text-sm"
        >
          Ver no Mapa
        </button>
      </div>
    </div>
  );
}
