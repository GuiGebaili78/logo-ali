import React from "react";
import type { Service } from "../../types/services";

interface Props {
  open: boolean;
  service?: Service | null;
  onClose: () => void;
}

export default function ServiceDatailsModal({ open, service, onClose }: Props) {
  if (!open || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full z-10 p-6">
        <header className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{service.name}</h2>
            <p className="text-sm text-gray-600">
              {service.type} — {service.date} {service.time}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </header>

        <main className="mt-4 space-y-3">
          <div>
            <strong>Endereço:</strong>
            <div className="text-sm">{service.address}</div>
          </div>

          {service.description && (
            <div>
              <strong>Descrição:</strong>
              <div className="text-sm">{service.description}</div>
            </div>
          )}

          {service.additionalInfo && (
            <div>
              <strong>Informações adicionais:</strong>
              <pre className="text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify(service.additionalInfo, null, 2)}
              </pre>
            </div>
          )}
        </main>

        <footer className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}
