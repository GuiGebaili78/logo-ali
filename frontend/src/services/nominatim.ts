import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";

export async function geocodeAddress(query: string) {
  // Usa Nominatim diretamente
  const url = API_ENDPOINTS.NOMINATIM;
  try {
    const resp = await axios.get(url, {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 5,
      },
      headers: {
        "Accept-Language": "pt-BR",
        "User-Agent": "logo-ali-app/1.0 (contato: )",
      },
    });

    return resp.data; // array de resultados
  } catch (error) {
    throw error;
  }
}
