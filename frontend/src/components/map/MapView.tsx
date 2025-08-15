"use client";

import { useEffect, useRef } from "react";
import { CataBagulhoResult } from "../../types/cataBagulho";

interface MapViewProps {
  center: [number, number];
  results: CataBagulhoResult[];
  userLocation?: { lat: number; lng: number };
}

export function MapView({ center, results, userLocation }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamic import para evitar SSR issues
    import("leaflet").then((L) => {
      // Limpa mapa anterior se existir
      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      // Cria o mapa
      const map = L.map(mapRef.current).setView(center, 15);

      // Adiciona tiles do OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Ícone customizado para localização do usuário
      const userIcon = L.divIcon({
        html: `<div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #3B82F6;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        className: "user-location-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      // Adiciona marcador da localização do usuário
      if (userLocation) {
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <strong>📍 Sua localização</strong><br/>
              <small>Lat: ${userLocation.lat.toFixed(6)}<br/>
              Lng: ${userLocation.lng.toFixed(6)}</small>
            </div>
          `);
      }

      // Ícone para serviços
      const serviceIcon = L.divIcon({
        html: `<div style="
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #10B981;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        ">🚛</div>`,
        className: "service-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      // Adiciona marcadores para cada resultado de serviço
      // Como não temos coordenadas específicas dos serviços, 
      // vamos mostrar apenas a área geral
      if (results.length > 0) {
        // Adiciona um marcador central para a área de serviço
        const serviceMarker = L.marker(center, { icon: serviceIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-3 max-w-xs">
              <strong>🚛 Área de Serviço</strong><br/>
              <small class="text-gray-600">
                ${results.length} serviço${results.length !== 1 ? 's' : ''} disponível${results.length !== 1 ? 'eis' : ''} nesta região
              </small><br/>
              <div class="mt-2 text-sm">
                ${results.slice(0, 2).map(r => `
                  <div class="mt-1 p-1 bg-gray-100 rounded">
                    <strong>${r.street}</strong><br/>
                    <small>${r.schedule || 'Horário não informado'}</small>
                  </div>
                `).join('')}
                ${results.length > 2 ? `<small class="text-gray-500">...e mais ${results.length - 2}</small>` : ''}
              </div>
            </div>
          `);

        // Adiciona círculo mostrando a área de cobertura
        L.circle(center, {
          radius: 500, // 500 metros
          fillColor: "#10B981",
          color: "#059669",
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.2,
        }).addTo(map);
      }

      mapInstance.current = map;
    });

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, results, userLocation]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}