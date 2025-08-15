import { ServiceCard } from "./ServiceCard";
import { CataBagulhoResult } from "../../types/cataBagulho";

interface ServicesListProps {
  results: CataBagulhoResult[];
  serviceType: string;
}

export function ServicesList({ results, serviceType }: ServicesListProps) {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">🤷</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Nenhum resultado encontrado
        </h3>
        <p className="text-gray-600">
          Não encontramos serviços para este endereço. 
          Tente verificar se o endereço está correto ou tente um endereço próximo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <ServiceCard 
          key={`${result.street}-${index}`}
          result={result}
          serviceType={serviceType}
        />
      ))}
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">
          📋 {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
        </h4>
        <p className="text-sm text-blue-700">
          Os horários e datas podem variar. Recomendamos confirmar as informações 
          diretamente com a prefeitura ou deixar os itens disponíveis nos horários indicados.
        </p>
      </div>
    </div>
  );
}