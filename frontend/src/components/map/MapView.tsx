"use client";

import { useEffect, useRef } from "react";
import type { Service } from "../../types/services";

interface MapViewProps {
  center: { lat: number; lng: number };
  services: Service[];
}

export default function MapView({ center, services }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const initializeMap = async () => {
      try {
        // Importação dinâmica do Leaflet apenas no cliente
        const [L] = await Promise.all([
          import("leaflet"),
          import("leaflet/dist/leaflet.css"),
        ]);

        // Fix para os ícones do Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Remove mapa existente se houver
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Limpa marcadores existentes
        markersRef.current = [];

        if (!mapRef.current) return;

        // Cria novo mapa
        const map = L.map(mapRef.current).setView([center.lat, center.lng], 15);

        // Adiciona tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Ícone customizado para o endereço do usuário
        const userIcon = L.divIcon({
          className: 'custom-marker user-marker',
          html: `
            <div style="
              background: #3B82F6;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
            ">📍</div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        // Adiciona marcador do endereço do usuário
        const userMarker = L.marker([center.lat, center.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; padding: 8px;">
              <strong>Seu endereço</strong><br>
              <span style="color: #666;">📍 ${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}</span>
            </div>
          `);

        markersRef.current.push(userMarker);

        // Ícone customizado para serviços
        const serviceIcon = L.divIcon({
          className: 'custom-marker service-marker',
          html: `
            <div style="
              background: #10B981;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
            ">🚛</div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        // Adiciona marcadores dos serviços (próximos ao endereço do usuário)
        services.forEach((service, index) => {
          // Como não temos coordenadas específicas dos serviços,
          // vamos distribuí-los em um raio pequeno ao redor do endereço do usuário
          const offset = 0.002; // Aproximadamente 200m
          const angle = (index * (2 * Math.PI)) / services.length;
          const serviceLat = center.lat + offset * Math.cos(angle);
          const serviceLng = center.lng + offset * Math.sin(angle);

          const marker = L.marker([serviceLat, serviceLng], { icon: serviceIcon })
            .addTo(map)
            .bindPopup(`
              <div style="max-width: 250px; padding: 12px;">
                <div style="margin-bottom: 8px;">
                  <strong style="color: #1F2937;">🚛 ${service.name}</strong>
                </div>
                <div style="margin-bottom: 8px; font-size: 13px; color: #6B7280;">
                  ${service.description}
                </div>
                <div style="font-size: 12px; color: #374151;">
                  <div style="margin-bottom: 4px;">
                    <strong>📅 Data:</strong> ${service.date}
                  </div>
                  <div style="margin-bottom: 4px;">
                    <strong>⏰ Horário:</strong> ${service.time}
                  </div>
                </div>
              </div>
            `);

          markersRef.current.push(marker);
        });

        // Ajusta o zoom para mostrar todos os marcadores
        if (services.length > 0) {
          const group = new L.featureGroup(markersRef.current);
          map.fitBounds(group.getBounds().pad(0.1));
        }

        mapInstanceRef.current = map;
      } catch (error) {
        console.error("Erro ao inicializar mapa:", error);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [center.lat, center.lng, services]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Controles personalizados */}
      <div className="absolute top-4 right-4 z-[1000]">
        <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Seu endereço</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Serviços</span>
          </div>
        </div>
      </div>

      {/* Loading fallback */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500 text-sm">Carregando mapa...</div>
      </div>
    </div>
  );
}