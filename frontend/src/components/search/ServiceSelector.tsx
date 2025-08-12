import { SERVICE_TYPES } from "@/utils/constants";

interface ServiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ServiceSelector({
  value,
  onChange,
}: ServiceSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-primary">Serviços</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
      >
        <option value="">Todos os serviços</option>
        {SERVICE_TYPES.map((service) => (
          <option key={service.value} value={service.value}>
            {service.label}
          </option>
        ))}
      </select>
    </div>
  );
}
