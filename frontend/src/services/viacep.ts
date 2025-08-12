// Caminho: frontend/src/services/viacep.ts
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";

// Defina a URL do seu backend
const BACKEND_API_URL = API_ENDPOINTS.BACKEND_BASE;

/**
 * Busca o CEP no backend. O backend irá usar o cache ou chamar o ViaCEP.
 */
export async function fetchCep(cep: string) {
  // normaliza
  const normalized = cep.replace(/\D/g, "");

  if (!normalized) {
    throw new Error("O CEP não pode estar vazio.");
  }

  try {
    const resp = await axios.get(`${BACKEND_API_URL}/cep/${normalized}`);
    return resp.data.data; // Retorna apenas a parte de dados da resposta
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Repassa a mensagem de erro do backend para o frontend
      throw new Error(error.response.data.message || "Erro ao buscar CEP.");
    }
    throw new Error("Erro de conexão com o servidor.");
  }
}
