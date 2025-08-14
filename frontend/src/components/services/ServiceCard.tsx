import { CataBagulhoResult } from "@/types/cataBagulho";

interface ServiceCardProps {
  service: CataBagulhoResult;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-[var(--secondary-color)] p-4 rounded-lg shadow-md transition-transform hover:scale-105">
      <h3 className="text-lg font-bold text-[var(--accent-color)] mb-2">{service.street}</h3>
      <div className="text-sm space-y-1">
          <p><strong>Trecho Início:</strong> {service.startStretch}</p>
          <p><strong>Trecho Fim:</strong> {service.endStretch}</p>
          <p><strong>Datas:</strong> {service.dates.join(', ')}</p>
          <p><strong>Frequência:</strong> {service.frequency}</p>
          <p><strong>Turno:</strong> {service.shift}</p>
          <p><strong>Horário:</strong> {service.schedule}</p>
      </div>
    </div>
  );
}