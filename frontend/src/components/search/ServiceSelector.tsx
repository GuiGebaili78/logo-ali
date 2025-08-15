import { SERVICE_TYPES, SERVICE_ICONS } from "../../utils/constants";

interface ServiceSelectorProps {
  selectedService: string;
  onServiceChange: (service: string) => void;
}

export function ServiceSelector({
  selectedService,
  onServiceChange,
}: ServiceSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
          🔍 Tipo de serviço
        </label>
        <select
          id="service"
          value={selectedService}
          onChange={(e) => onServiceChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {SERVICE_TYPES.map((service) => (
            <option key={service.value} value={service.value}>
              {SERVICE_ICONS[service.value as keyof typeof SERVICE_ICONS]} {service.label}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">
          {SERVICE_ICONS[selectedService as keyof typeof SERVICE_ICONS]} Sobre este serviço:
        </h4>
        <div className="text-sm text-gray-600">
          {selectedService === "cata-bagulho" && (
            <div>
              <p className="mb-2">
                <strong>Cata-Bagulho:</strong> Coleta de móveis velhos, eletrodomésticos e objetos grandes.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Agendamento necessário</li>
                <li>Horários específicos por região</li>
                <li>Limite de volume por coleta</li>
                <li>Não recolhe lixo comum</li>
              </ul>
            </div>
          )}
          {selectedService === "coleta-lixo" && (
            <p>Horários regulares de coleta de lixo doméstico e reciclagem.</p>
          )}
          {selectedService === "saude" && (
            <p>Unidades básicas de saúde, hospitais e centros médicos.</p>
          )}
          {selectedService === "vacinacao" && (
            <p>Postos de vacinação e campanhas de imunização.</p>
          )}
        </div>
      </div>
    </div>
  );
}