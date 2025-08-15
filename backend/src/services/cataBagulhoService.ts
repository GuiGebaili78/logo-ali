// --- Caminho: backend/src/services/cataBagulhoService.ts ---
import axios from "axios";
import * as cheerio from "cheerio";
import db from "../database/database";
import { CataBagulhoResult } from "../types/cataBagulho";

export class CataBagulhoService {
  private readonly BASE_URL = "https://locatsp.saclimpeza2.com.br/mapa/resultados/";
  private readonly CACHE_TTL_HOURS = 24;

  public async search(lat: number, lng: number): Promise<CataBagulhoResult[]> {
    const cachedResults = await this.getCachedResults(lat, lng);
    if (cachedResults) {
      console.log(`✅ [Cata-Bagulho] Cache HIT para coordenadas: ${lat}, ${lng}`);
      return cachedResults;
    }

    console.log(`❌ [Cata-Bagulho] Cache MISS. Buscando na fonte externa...`);
    const liveResults = await this.fetchFromSource(lat, lng);

    if (liveResults.length > 0) {
      await this.cacheResults(lat, lng, liveResults);
    }

    return liveResults;
  }

  private async getCachedResults(lat: number, lng: number): Promise<CataBagulhoResult[] | null> {
    try {
      const query = `
        SELECT results FROM catabagulho_cache
        WHERE latitude = $1 AND longitude = $2 AND expires_at > NOW()
        LIMIT 1;
      `;
      const result = await db.query(query, [lat.toFixed(8), lng.toFixed(8)]);
      if (result.rows.length > 0) {
        return result.rows[0].results as CataBagulhoResult[];
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar resultados do cache Cata-Bagulho:", error);
      return null;
    }
  }

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

    // O seletor correto para cada bloco de resultado
    $('.panel.panel-default').each((_, element) => {
      const logradouroDiv = $(element).find('.logradouro');
      const street = logradouroDiv.find('strong').text().trim();
      
      if (!street) return; // Pula se não encontrar o nome da rua

      // Extrai o conteúdo de texto do div e remove o nome da rua para pegar os trechos
      const logradouroHtml = logradouroDiv.html() || '';
      const parts = logradouroHtml.split('<br>').map(part => cheerio.load(part).text().trim());
      
      const startStretch = parts.find(p => p.startsWith('Início:'))?.replace('Início:', '').trim() || 'Não informado';
      const endStretch = parts.find(p => p.startsWith('Fim:'))?.replace('Fim:', '').trim() || 'Não informado';

      const detailsDiv = $(element).find('.detalhes');
      
      const extractDetail = (label: string): string => {
        return detailsDiv.find('.row').filter(function() {
          return $(this).find('.col-xs-3, .col-xs-4, .col-xs-5').text().trim() === label;
        }).find('.col-xs-9, .col-xs-8, .col-xs-7').text().trim() || 'Não informado';
      };

      const datesText = extractDetail('Dias:');
      const dates = datesText.split(';').map(d => d.trim()).filter(d => d);

      results.push({
        street: street,
        startStretch: startStretch,
        endStretch: endStretch,
        dates: dates,
        frequency: extractDetail('Freq.:'),
        shift: extractDetail('Turno:'),
        schedule: extractDetail('Horário:'),
      });
    });

    if (results.length === 0) {
        console.log("[Cata-Bagulho] Nenhum item de resultado encontrado no HTML com os seletores esperados.");
    }

    return results;
  }
}