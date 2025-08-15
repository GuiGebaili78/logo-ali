// --- Caminho: backend/src/services/geocodeService.ts ---
import axios from "axios";

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

export class GeocodeService {
  private readonly NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

  public async getCoordinatesFromAddress(query: string): Promise<NominatimResult[]> {
    console.log(`[GeocodeService] Buscando coordenadas para: "${query}"`);
    try {
      const { data } = await axios.get<NominatimResult[]>(this.NOMINATIM_URL, {
        params: {
          q: query,
          format: "json",
          limit: 5, // Aumentar o limite pode ajudar a encontrar o endereço correto
          addressdetails: 1,
          "accept-language": "pt-BR",
        },
        headers: {
          // É uma boa prática definir um User-Agent
          "User-Agent": "LogoAli-App/1.0.0 (https://github.com/seu-usuario/seu-repo)",
        },
        timeout: 10000,
      });

      if (!data || data.length === 0) {
        throw new Error("Endereço não encontrado ou não foi possível geocodificar.");
      }

      console.log(`[GeocodeService] Coordenadas encontradas para: "${query}"`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`[GeocodeService] Erro na API do Nominatim: ${error.response?.status} ${error.message}`);
        throw new Error("Erro de comunicação com o serviço de geolocalização.");
      }
      console.error("[GeocodeService] Erro ao buscar coordenadas:", error);
      throw error;
    }
  }
}