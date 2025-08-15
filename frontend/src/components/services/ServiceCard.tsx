import { useState } from "react";
import { CataBagulhoResult } from "../../types/cataBagulho";
import { ServiceDetailsModal } from "./ServiceDatailsModal";

interface ServiceCardProps {
  result: CataBagulhoResult;
  serviceType: string;
}

export function ServiceCard({ result, serviceType }: ServiceCardProps) {
  const [showModal, setShowModal] = useState(false);

  const formatDates = (dates: string[]) => {
    if (!dates || dates.length === 0) return "Datas não informadas";
    return dates.slice(0, 3).join(", ") + (dates.length > 3 ? "..." : "");
  };

  return (
    <>
      <div 
        className="service-card bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:border-blue-300 transition-all"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🛣️ {result.street}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              {result.startStretch && (
                <p><span className="font-medium">Início:</span> {result.startStretch}</p>
              )}
              {result.endStretch && (
                <p><span className="font-medium">Fim:</span> {result.endStretch}</p>
              )}
            </div>
          </div>
          <div className="text-2xl">🚛</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-1">📅 Próximas datas:</p>
            <p className="text-gray-600">{formatDates(result.dates)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">⏰ Horário:</p>
            <p className="text-gray-600">{result.schedule || "Não informado"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">🔄 Frequência:</p>
            <p className="text-gray-600">{result.frequency || "Não informada"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">🌅 Turno:</p>
            <p className="text-gray-600">{result.shift || "Não informado"}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-blue-600 font-medium">
            👆 Clique para ver mais detalhes
          </p>
        </div>
      </div>

      <ServiceDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        result={result}
        serviceType={serviceType}
      />
    </>
  );
}