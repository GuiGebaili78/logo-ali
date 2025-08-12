// Caminho: frontend/src/components/map/MapView.tsx
"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ⚠️ CORREÇÃO: Importe as imagens do Leaflet aqui
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Importações do projeto...
import { Service } from "@/types/services";
import { Coordinates } from "@/types/location";

// ⚠️ CORREÇÃO: Remova a linha que causava o erro.
// Apenas o código abaixo é necessário.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// Resto do seu componente permanece o mesmo...

interface MapViewProps {
  center: Coordinates | null;
  services: Service[];
  onServiceSelect: (serviceId: number) => void;
}

export default function MapView({
  center,
  services,
  onServiceSelect,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Inicialização do mapa
    if (typeof window !== "undefined" && !mapRef.current) {
      mapRef.current = L.map("map", {
        center: [-23.5505, -46.6333],
        zoom: 13,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Atualiza a visualização do mapa quando o centro muda
    if (mapRef.current && center) {
      mapRef.current.setView(L.latLng(center.lat, center.lng), 15);
    }
  }, [center]);

  // (O resto do código para adicionar marcadores e etc.)

  return <div id="map" style={{ height: "100%", minHeight: "500px" }}></div>;
}
