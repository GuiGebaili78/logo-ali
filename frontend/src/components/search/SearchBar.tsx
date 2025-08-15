import { Input } from "../ui/Input";
import { Loading } from "../ui/Loading";
import { formatCep } from "../../utils/validators";
import { ViaCepResponse } from "../../types/location";

interface SearchBarProps {
  cep: string;
  numero: string;
  onCepChange: (cep: string) => void;
  onNumeroChange: (numero: string) => void;
  endereco: ViaCepResponse | null;
  isLoading: boolean;
}

export function SearchBar({
  cep,
  numero,
  onCepChange,
  onNumeroChange,
  endereco,
  isLoading,
}: SearchBarProps) {
  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    onCepChange(formatted);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
          📮 CEP
        </label>
        <div className="relative">
          <Input
            id="cep"
            type="text"
            placeholder="12345-678"
            value={cep}
            onChange={(e) => handleCepChange(e.target.value)}
            maxLength={9}
            className="w-full"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loading size="sm" />
            </div>
          )}
        </div>
      </div>

      {endereco && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-1">
            ✅ Endereço encontrado:
          </p>
          <p className="text-sm text-green-700">
            {endereco.logradouro}
            {endereco.complemento && `, ${endereco.complemento}`}
          </p>
          <p className="text-sm text-green-700">
            {endereco.bairro}, {endereco.localidade}/{endereco.uf}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
          🏠 Número da residência
        </label>
        <Input
          id="numero"
          type="text"
          placeholder="Ex: 123, 456-A, etc."
          value={numero}
          onChange={(e) => onNumeroChange(e.target.value)}
          disabled={!endereco}
          className="w-full"
        />
      </div>

      {endereco && numero && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800">
            📍 Endereço completo:
          </p>
          <p className="text-sm text-blue-700">
            {endereco.logradouro}, {numero} - {endereco.bairro}, {endereco.localidade}/{endereco.uf}
          </p>
        </div>
      )}
    </div>
  );
}