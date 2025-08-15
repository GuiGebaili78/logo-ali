// --- Caminho: frontend/src/services/nominatim.ts ---
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";
import { NominatimResult } from "../types/api";

const instance = axios.create({
  baseURL: API_ENDPOINTS.BACKEND_BASE,
  timeout: 15000,
});

export async function geocodeAddress(query: string): Promise<NominatimResult[]> {
  console.log(`[Frontend] Chamando backend para geocodificar: "${query}"`);
  try {
    // A requisição agora é para o nosso backend, que fará o proxy
    const { data } = await instance.get('/geocode', {
      params: { q: query }
    });

    if (data && data.success) {
        // A resposta do backend já vem com { success: true, data: [...] }
        return data.data || [];
    } else {
        throw new Error(data.message || "Erro retornado pelo backend de geocodificação.");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Erro na geocodificação (resposta do backend):", error.response.data);
      throw new Error(error.response.data.message || "Não foi possível converter o endereço em coordenadas.");
    }
    console.error("Erro de conexão na geocodificação:", error);
    throw new Error("Erro de conexão com o servidor para obter coordenadas.");
  }
}