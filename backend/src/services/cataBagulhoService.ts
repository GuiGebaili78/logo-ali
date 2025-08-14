import axios from "axios";
import * as cheerio from "cheerio";
import db from "../database/database";
import { CataBagulhoResult, CataBagulhoCacheData } from "../types/cataBagulho";

export class CataBagulhoService {
  private readonly BASE_URL = "https://locatsp.saclimpeza2.com.br/mapa/resultados/";
  private readonly CACHE_TTL_HOURS = 24;

  /**
   * Método principal que orquestra a busca, utilizando cache.
   */
  public async search(lat: number, lng: number): Promise<CataBagulhoResult[]> {
    // 1. Tenta buscar do cache
    const cachedResults = await this.getCachedResults(lat, lng);
    if (cachedResults) {
      console.log(`✅ [Cata-Bagulho] Cache HIT para coordenadas: ${lat}, ${lng}`);
      return cachedResults;
    }

    // 2. Se não houver cache, busca na fonte original (web scraping)
    console.log(`❌ [Cata-Bagulho] Cache MISS. Buscando na fonte externa...`);
    const liveResults = await this.fetchFromSource(lat, lng);

    // 3. Salva os novos resultados no cache
    if (liveResults.length > 0) {
      await this.cacheResults(lat, lng, liveResults);
    }

    return liveResults;
  }

  /**
   * Busca resultados no cache do banco de dados que não tenham expirado.
   */
  private async getCachedResults(lat: number, lng: number): Promise<CataBagulhoResult[] | null> {
    try {
      const query = `
        SELECT results FROM catabagulho_cache
        WHERE latitude = $1 AND longitude = $2 AND expires_at > NOW()
        LIMIT 1;
      `;
      // Arredondar para evitar problemas de precisão com float
      const result = await db.query(query, [lat.toFixed(8), lng.toFixed(8)]);

      if (result.rows.length > 0) {
        return result.rows[0].results as CataBagulhoResult[];
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar resultados do cache Cata-Bagulho:", error);
      return null; // Em caso de erro, continua para a busca externa
    }
  }

  /**
   * Salva os resultados da busca no banco de dados.
   */
  private async cacheResults(lat: number, lng: number, results: CataBagulhoResult[]): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.CACHE_TTL_HOURS);

      const query = `
        INSERT INTO catabagulho_cache (latitude, longitude, results, expires_at)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (latitude, longitude)
        DO UPDATE SET
          results = EXCLUDED.results,
          cached_at = CURRENT_TIMESTAMP,
          expires_at = EXCLUDED.expires_at;
      `;

      await db.query(query, [lat.toFixed(8), lng.toFixed(8), JSON.stringify(results), expiresAt]);
      console.log(`💾 [Cata-Bagulho] Resultados para ${lat}, ${lng} salvos no cache.`);
    } catch (error) {
      console.error("Erro ao salvar resultados no cache Cata-Bagulho:", error);
    }
  }

  /**
   * Lógica de web scraping original.
   */
  private async fetchFromSource(lat: number, lng: number): Promise<CataBagulhoResult[]> {
    const url = `${this.BASE_URL}?servico=grandes-objetos&lat=${lat}&lng=${lng}`;
    console.log(`[Cata-Bagulho] Buscando dados em: ${url}`);

    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 15000,
      });

      return this.parseHTML(data);
    } catch (error: any) {
      console.error("[Cata-Bagulho] Erro no serviço de scraping:", error.message);
      throw new Error("Não foi possível obter os dados do serviço Cata-Bagulho.");
    }
  }

  private parseHTML(html: string): CataBagulhoResult[] {
    const $ = cheerio.load(html);
    const results: CataBagulhoResult[] = [];

    const resultItems = $("body").find("div[style='padding:10px']");

    if (resultItems.length === 0) {
      console.log("[Cata-Bagulho] Nenhum item de resultado encontrado no HTML.");
      return [];
    }

    resultItems.each((_, element) => {
      const street = $(element).find("b").first().text().trim();
      if (!street) return; // Pula se não encontrar o nome da rua

      const infoText = $(element).text();
      const extractInfo = (regex: RegExp): string => {
        const match = infoText.match(regex);
        return match ? match[1].trim() : "Não informado";
      };

      results.push({
        street: street,
        startStretch: extractInfo(/Trecho de Coleta: Início em (.*?)(?= Fim)/),
        endStretch: extractInfo(/Fim em (.*?)\n/),
        dates: [extractInfo(/Datas: (.*?)\n/)],
        frequency: extractInfo(/Frequência: (.*?)\n/),
        shift: extractInfo(/Turno: (.*?)\n/),
        schedule: extractInfo(/Horário: (.*?)\n/),
      });
    });

    return results;
  }
}