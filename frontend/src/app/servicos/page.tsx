"use client";

import { Layout } from "../../components/layout/Layout";
import { SERVICE_TYPES, SERVICE_ICONS } from "../../utils/constants";
import Link from "next/link";

export default function ServicosPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔍 Serviços Disponíveis
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça todos os serviços públicos que você pode consultar através do Logo Ali
            </p>
          </div>

          {/* Services Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {SERVICE_TYPES.map((service) => (
                <div
                  key={service.value}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">
                      {SERVICE_ICONS[service.value as keyof typeof SERVICE_ICONS]}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.label}
                    </h3>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    {service.value === "cata-bagulho" && (
                      <p>
                        Coleta de móveis velhos, eletrodomésticos e objetos grandes.
                        Consulte horários e datas por região.
                      </p>
                    )}
                    {service.value === "coleta-lixo" && (
                      <p>
                        Horários regulares de coleta de lixo doméstico e reciclagem
                        para sua região.
                      </p>
                    )}
                    {service.value === "saude" && (
                      <p>
                        Localização de unidades básicas de saúde, hospitais e centros
                        médicos próximos.
                      </p>
                    )}
                    {service.value === "vacinacao" && (
                      <p>
                        Postos de vacinação disponíveis e campanhas de imunização
                        em andamento.
                      </p>
                    )}
                    {service.value === "bem-estar-animal" && (
                      <p>
                        Serviços veterinários públicos, castração e cuidados com
                        animais abandonados.
                      </p>
                    )}
                    {service.value === "zeladoria" && (
                      <p>
                        Manutenção urbana, limpeza de ruas, reparos em calçadas
                        e infraestrutura.
                      </p>
                    )}
                    {service.value === "iluminacao" && (
                      <p>
                        Manutenção e instalação de iluminação pública em vias
                        e logradouros.
                      </p>
                    )}
                    {service.value === "poda-arvores" && (
                      <p>
                        Serviços de poda e manutenção de árvores urbanas por
                        região e agendamento.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {service.value === "cata-bagulho" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          ✅ Disponível
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          🚧 Em breve
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📋 Como Funciona
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl mb-4">1️⃣</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Informe seu CEP
                  </h3>
                  <p className="text-sm text-gray-600">
                    Digite o CEP e número da sua residência para localizarmos
                    sua região exata.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl mb-4">2️⃣</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Escolha o serviço
                  </h3>
                  <p className="text-sm text-gray-600">
                    Selecione qual serviço público você deseja consultar
                    na sua região.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl mb-4">3️⃣</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Veja os resultados
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visualize horários, datas e informações detalhadas
                    sobre o serviço na sua área.
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔍 Começar Busca
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                💡 Informações Importantes
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Os dados são obtidos diretamente dos sistemas oficiais da
                    Prefeitura de São Paulo
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    As informações são atualizadas regularmente, mas podem
                    sofrer alterações operacionais
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Em caso de dúvidas específicas, recomendamos contato
                    direto com a prefeitura pelo 156
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    O Logo Ali é um projeto independente para facilitar o
                    acesso às informações públicas
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}