import db from "../database/database";
import {
  ViaCepResponse,
  ViaCepCacheData,
  ViaCepApiResponse,
  CacheStatus,
} from "../types/viacep";

export class ViaCepService {
  private readonly CACHE_TTL_HOURS = 24; // TTL de 24 horas
  private readonly VIACEP_BASE_URL = "https://viacep.com.br/ws";

  /**
   * Normaliza o CEP removendo caracteres especiais
   */
  private normalizeCep(cep: string): string {
    return cep.replace(/\D/g, "");
  }

  /**
   * Formata o CEP para o padrão 00000-000
   */
  private formatCep(cep: string): string {
    const normalized = this.normalizeCep(cep);
    if (normalized.length === 8) {
      return `${normalized.substring(0, 5)}-${normalized.substring(5)}`;
    }
    return normalized;
  }

  /**
   * Valida se o CEP tem formato válido
   */
  private isValidCep(cep: string): boolean {
    const normalized = this.normalizeCep(cep);
    return /^\d{8}$/.test(normalized);
  }

  /**
   * Busca CEP no cache do banco de dados
   */
  private async getCachedCep(cep: string): Promise<ViaCepCacheData | null> {
    try {
      const formattedCep = this.formatCep(cep);

      const query = `
        SELECT * FROM viacep_cache 
        WHERE cep = $1 AND expires_at > NOW()
        ORDER BY cached_at DESC 
        LIMIT 1
      `;

      const result = await db.query(query, [formattedCep]);

      if (result.rows.length > 0) {
        console.log(`✅ Cache HIT para CEP: ${formattedCep}`);
        return result.rows[0] as ViaCepCacheData;
      }

      console.log(`❌ Cache MISS para CEP: ${formattedCep}`);
      return null;
    } catch (error) {
      console.error("Erro ao buscar CEP no cache:", error);
      return null;
    }
  }

  /**
   * Salva CEP no cache
   */
  private async cacheCep(cepData: ViaCepResponse): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.CACHE_TTL_HOURS);

      const query = `
        INSERT INTO viacep_cache (cep, logradouro, complemento, unidade, bairro, localidade, uf, expires_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (cep) 
        DO UPDATE SET 
          logradouro = EXCLUDED.logradouro,
          complemento = EXCLUDED.complemento,
          unidade = EXCLUDED.unidade,
          bairro = EXCLUDED.bairro,
          localidade = EXCLUDED.localidade,
          uf = EXCLUDED.uf,
          expires_at = EXCLUDED.expires_at,
          cached_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      `;

      await db.query(query, [
        cepData.cep,
        cepData.logradouro,
        cepData.complemento,
        cepData.unidade,
        cepData.bairro,
        cepData.localidade,
        cepData.uf,
        expiresAt.toISOString(),
      ]);

      console.log(
        `💾 CEP ${cepData.cep} salvo no cache até ${expiresAt.toISOString()}`
      );
    } catch (error) {
      console.error("Erro ao salvar CEP no cache:", error);
      throw error;
    }
  }

  /**
   * Busca CEP na API do ViaCEP
   */
  private async fetchFromViaCepApi(cep: string): Promise<ViaCepResponse> {
    try {
      const normalizedCep = this.normalizeCep(cep);
      const url = `${this.VIACEP_BASE_URL}/${normalizedCep}/json/`;

      console.log(`🌐 Buscando CEP ${normalizedCep} na API ViaCEP...`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error(`CEP ${normalizedCep} não encontrado`);
      }

      // Retorna apenas os campos que queremos usar
      const result: ViaCepResponse = {
        cep: this.formatCep(data.cep),
        logradouro: data.logradouro || "",
        complemento: data.complemento || "",
        unidade: data.unidade || "",
        bairro: data.bairro || "",
        localidade: data.localidade || "",
        uf: data.uf || "",
      };

      console.log(`✅ CEP ${result.cep} encontrado na API`);
      return result;
    } catch (error) {
      console.error(`Erro ao buscar CEP na API:`, error);
      throw error;
    }
  }

  /**
   * Método principal para buscar CEP (com cache)
   */
  public async getCep(cep: string): Promise<ViaCepApiResponse> {
    // Validação do CEP
    if (!this.isValidCep(cep)) {
      throw new Error("CEP inválido. Use o formato 00000000 ou 00000-000");
    }

    let cacheStatus: CacheStatus = {
      hit: false,
      expired: false,
      source: "api",
    };

    try {
      // 1. Tentar buscar no cache primeiro
      const cachedData = await this.getCachedCep(cep);

      if (cachedData) {
        cacheStatus = {
          hit: true,
          expired: false,
          source: "cache",
        };

        return {
          cep: cachedData.cep,
          logradouro: cachedData.logradouro || "",
          complemento: cachedData.complemento || "",
          unidade: cachedData.unidade || "",
          bairro: cachedData.bairro || "",
          localidade: cachedData.localidade || "",
          uf: cachedData.uf || "",
          cacheStatus,
        };
      }

      // 2. Se não estiver no cache, buscar na API
      const apiData = await this.fetchFromViaCepApi(cep);

      // 3. Salvar no cache
      await this.cacheCep(apiData);

      cacheStatus = {
        hit: false,
        expired: false,
        source: "api",
      };

      return {
        ...apiData,
        cacheStatus,
      };
    } catch (error) {
      console.error("Erro no serviço ViaCEP:", error);
      throw error;
    }
  }

  /**
   * Limpa cache expirado (método utilitário)
   */
  public async clearExpiredCache(): Promise<number> {
    try {
      const query = "DELETE FROM viacep_cache WHERE expires_at <= NOW()";
      const result = await db.query(query, []);

      console.log(
        `🧹 Removidos ${result.rowCount || 0} registros expirados do cache`
      );
      return result.rowCount || 0;
    } catch (error) {
      console.error("Erro ao limpar cache expirado:", error);
      throw error;
    }
  }

  /**
   * Estatísticas do cache
   */
  public async getCacheStats(): Promise<any> {
    try {
      const queries = [
        { sql: "SELECT COUNT(*) as total FROM viacep_cache", params: [] },
        {
          sql: "SELECT COUNT(*) as valid FROM viacep_cache WHERE expires_at > NOW()",
          params: [],
        },
        {
          sql: "SELECT COUNT(*) as expired FROM viacep_cache WHERE expires_at <= NOW()",
          params: [],
        },
      ];

      const [totalResult, validResult, expiredResult] = await Promise.all(
        queries.map(({ sql, params }) => db.query(sql, params))
      );

      return {
        total: parseInt(totalResult.rows[0].total),
        valid: parseInt(validResult.rows[0].valid),
        expired: parseInt(expiredResult.rows[0].expired),
      };
    } catch (error) {
      console.error("Erro ao obter estatísticas do cache:", error);
      throw error;
    }
  }
}
