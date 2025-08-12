import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";

/**
 * Funções próximas à prefeitura / APILIB
 * Observação: aqui fazemos chamadas para um endpoint backend hipotético /prefecture/*
 * Caso seu backend implemente rotas específicas, adapte os paths abaixo.
 */

const BACKEND = API_ENDPOINTS.BACKEND_BASE;
const client = axios.create({ baseURL: BACKEND, timeout: 15000 });

export async function fetchServicesFromPrefecture(
  lat: number,
  lng: number,
  serviceType?: string
) {
  try {
    const resp = await client.get("/prefecture/services", {
      params: { lat, lng, serviceType },
    });
    return resp.data;
  } catch (error) {
    // se backend não tiver, repassar erro para tratamento
    throw error;
  }
}
