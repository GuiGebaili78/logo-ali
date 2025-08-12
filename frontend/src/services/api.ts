// Caminho: frontend/src/services/api.ts
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";
import type { ServiceSearchParams, Service } from "../types/services";
import { fetchCep } from "./viacep";

const BACKEND = API_ENDPOINTS.BACKEND_BASE;

const instance = axios.create({
  baseURL: BACKEND,
  timeout: 15000,
});

/**
 * Busca por serviços com base nos parâmetros.
 */
export async function searchServices(params: ServiceSearchParams) {
  if (params.cep) {
    try {
      const cepData = await fetchCep(params.cep);

      // ⚠️ CORREÇÃO: Cria um objeto Service que cumpre a interface completa
      const serviceResult: Service[] = [
        {
          id: 1, // ID fixo para o exemplo, você pode usar uma lógica diferente
          type: "viacep",
          name: "Informações de Endereço",
          address: `${cepData.logradouro}, ${cepData.bairro}, ${cepData.localidade} - ${cepData.uf}`,
          description: "Dados de endereço obtidos do ViaCEP",
          // Adicionando as propriedades que faltavam, com valores padrão ou nulos
          date: null,
          time: null,
          distance: null,
          coordinates: [parseFloat(cepData.lat), parseFloat(cepData.lng)],
          // Você pode manter o cepData aqui para uso posterior se precisar
          cepData: cepData,
        },
      ];

      return {
        services: serviceResult,
        message: "Busca por CEP concluída",
      };
    } catch (error) {
      console.error("Erro na busca de CEP:", error);
      throw new Error("Erro ao buscar dados do CEP.");
    }
  }

  throw new Error("Por favor, forneça um CEP para a busca.");
}

export async function getServiceDetails(id: number) {
  try {
    const resp = await instance.get(`/services/${id}`);
    return resp.data;
  } catch (error) {
    throw error;
  }
}
