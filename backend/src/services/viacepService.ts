import axios from "axios";
import db from "../database/database";
import { ViaCepResponse, CacheStatus } from "../types/viacep";

export class ViaCepService {
  private readonly cacheTTLHours = 24;

  /**
   * Normaliza o CEP removendo caracteres não numéricos
   */
  private normalizeCep(cep: string): string {
    return cep.replace(/\D/g, "");
  }

  /**
   * Método principal que busca CEP com cache no banco de dados
   */
  async buscarEnderecoPorCep(cep: string): Promise<ViaCepResponse> {
    const normalizedCep = this.normalizeCep(cep);
    
    if (normalizedCep.length !== 8) {
      throw new Error("CEP deve conter exatamente 8 dígitos");
    }

    // 1. Tenta buscar do cache (banco de dados)
    const cachedData = await this.getCachedCep(normalizedCep);
    if (cachedData) {
      console.log(`✅ [ViaCEP] Cache HIT para CEP: ${normalizedCep}`);
      return cachedData;
    }

    // 2. Se não houver cache válido, busca na API externa
    console.log(`❌ [ViaCEP] Cache MISS. Buscando na API externa...`);
    const apiData = await this.fetchFromViaCepAPI(normalizedCep);

    // 3. Salva no cache do banco de dados
    await this.saveCachedCep(normalizedCep, apiData);

    return apiData;
  }

  /**
   * Busca CEP no cache do banco de dados
   */
  private async getCachedCep(cep: string): Promise<ViaCepResponse | null> {
    try {
      const query = `
        SELECT 
          cep, logradouro, complemento, unidade, 
          bairro, localidade, uf
        FROM viacep_cache 
        WHERE cep = $1 AND expires_at > NOW()
        LIMIT 1
      `;

      const result = await db.query(query, [this.formatCepWithHyphen(cep)]);

      if (result.rows.length > 0) {
        return result.rows[0] as ViaCepResponse;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar CEP no cache:", error);
      return null; // Em caso de erro, continua para API externa
    }
  }

  /**
   * Busca CEP na API externa do ViaCEP
   */
  private async fetchFromViaCepAPI(cep: string): Promise<ViaCepResponse> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    console.log(`[ViaCEP] Buscando dados em: ${url}`);

    try {
      const { data } = await axios.get<ViaCepResponse>(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'LogoAli-App/1.0.0',
        },
      });

      // Verifica se a API retornou erro (CEP não encontrado)
      if ('erro' in data) {
        throw new Error("CEP não encontrado");
      }

      return data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("CEP não encontrado");
        }
        throw new Error("Falha na conexão com o serviço de CEP");
      }
      throw new Error(error.message || "Erro ao buscar CEP");
    }
  }

  /**
   * Salva CEP no cache do banco de dados
   */
  private async saveCachedCep(cep: string, data: ViaCepResponse): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.cacheTTLHours);

      const formattedCep = this.formatCepWithHyphen(cep);

      const query = `
        INSERT INTO viacep_cache (
          cep, logradouro, complemento, unidade, 
          bairro, localidade, uf, expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (cep) 
        DO UPDATE SET
          logradouro = EXCLUDED.logradouro,
          complemento = EXCLUDED.complemento,
          unidade = EXCLUDED.unidade,
          bairro = EXCLUDED.bairro,
          localidade = EXCLUDED.localidade,
          uf = EXCLUDED.uf,
          cached_at = CURRENT_TIMESTAMP,
          expires_at = EXCLUDED.expires_at,
          updated_at = CURRENT_TIMESTAMP
      `;

      await db.query(query, [
        formattedCep,
        data.logradouro || '',
        data.complemento || '',
        data.unidade || '',
        data.bairro || '',
        data.localidade || '',
        data.uf || '',
        expiresAt,
      ]);

      console.log(`💾 [ViaCEP] CEP ${formattedCep} salvo no cache até ${expiresAt.toLocaleString('pt-BR')}`);
    } catch (error) {
      console.error("Erro ao salvar CEP no cache:", error);
      // Não lança erro para não impedir o retorno dos dados
    }
  }

  /**
   * Formata CEP com hífen (12345678 -> 12345-678)
   */
  private formatCepWithHyphen(cep: string): string {
    const normalized = this.normalizeCep(cep);
    if (normalized.length === 8) {
      return `${normalized.substring(0, 5)}-${normalized.substring(5)}`;
    }
    return normalized;
  }

  /**
   * Obtém estatísticas do cache
   */
  async getCacheStats() {
    try {
      const totalQuery = "SELECT COUNT(*) as total FROM viacep_cache";
      const validQuery = "SELECT COUNT(*) as valid FROM viacep_cache WHERE expires_at > NOW()";
      const expiredQuery = "SELECT COUNT(*) as expired FROM viacep_cache WHERE expires_at <= NOW()";

      const [totalResult, validResult, expiredResult] = await Promise.all([
        db.query(totalQuery),
        db.query(validQuery),
        db.query(expiredQuery),
      ]);

      return {
        total: parseInt(totalResult.rows[0].total),
        valid: parseInt(validResult.rows[0].valid),
        expired: parseInt(expiredResult.rows[0].expired),
        ttlHours: this.cacheTTLHours,
      };
    } catch (error) {
      console.error("Erro ao obter estatísticas do cache:", error);
      return {
        total: 0,
        valid: 0,
        expired: 0,
        ttlHours: this.cacheTTLHours,
        error: "Falha ao obter estatísticas",
      };
    }
  }

  /**
   * Remove entradas expiradas do cache
   */
  async clearExpiredCache() {
    try {
      const query = "DELETE FROM viacep_cache WHERE expires_at <= NOW()";
      const result = await db.query(query);
      
      return {
        removidos: result.rowCount || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Erro ao limpar cache expirado:", error);
      return {
        removidos: 0,
        error: "Falha ao limpar cache expirado",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Método para testes - insere dados fake no cache
   */
  seedCache(cep: string, data: ViaCepResponse) {
    // Para manter compatibilidade com o controller existente
    // mas agora usa o banco de dados
    const normalized = this.normalizeCep(cep);
    return this.saveCachedCep(normalized, data).then(() => ({
      ok: true,
      cep: this.formatCepWithHyphen(normalized),
      message: "Dados inseridos no cache do banco de dados"
    }));
  }
}