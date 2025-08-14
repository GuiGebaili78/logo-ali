import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";
import { NominatimResult } from "../types/api";

export async function geocodeAddress(query: string): Promise<NominatimResult[]> {
  const url = API_ENDPOINTS.NOMINATIM;
  try {
    const { data } = await axios.get(url, {
      params: {
        q: query,
        format: "json",
        limit: 1, // Queremos apenas o resultado mais provável
      },
      headers: { 'Accept-Language': 'pt-BR' },
    });
    return data;
  } catch (error) {
    console.error("Erro na geocodificação:", error);
    throw new Error("Não foi possível converter o endereço em coordenadas.");
  }
}