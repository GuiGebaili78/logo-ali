import { Request, Response } from "express";
import { ViaCepService } from "../services/viacepService";
export class ViaCepController {
  private viaCepService: ViaCepService;

  constructor() {
    this.viaCepService = new ViaCepService();
  }

  /**
   * GET /api/cep/:cep
   * Busca informações de um CEP
   */
  public getCep = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cep } = req.params;

      if (!cep) {
        res.status(400).json({
          error: "CEP é obrigatório",
          message: "Informe um CEP válido na URL",
        });
        return;
      }

      const startTime = Date.now();
      const result = await this.viaCepService.getCep(cep);
      const responseTime = Date.now() - startTime;

      res.status(200).json({
        success: true,
        data: {
          cep: result.cep,
          logradouro: result.logradouro,
          complemento: result.complemento,
          unidade: result.unidade,
          bairro: result.bairro,
          localidade: result.localidade,
          uf: result.uf,
        },
        meta: {
          cache: result.cacheStatus,
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("Erro no controller ViaCEP:", error);

      res.status(400).json({
        success: false,
        error: "Erro ao buscar CEP",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * GET /api/cep/cache/stats
   * Retorna estatísticas do cache
   */
  public getCacheStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.viaCepService.getCacheStats();

      res.status(200).json({
        success: true,
        data: {
          cache_stats: stats,
          cache_ttl_hours: 24,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("Erro ao obter estatísticas do cache:", error);

      res.status(500).json({
        success: false,
        error: "Erro ao obter estatísticas do cache",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * DELETE /api/cep/cache/expired
   * Remove registros expirados do cache
   */
  public clearExpiredCache = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const deletedCount = await this.viaCepService.clearExpiredCache();

      res.status(200).json({
        success: true,
        message: `${deletedCount} registros expirados removidos do cache`,
        data: {
          deleted_records: deletedCount,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("Erro ao limpar cache:", error);

      res.status(500).json({
        success: false,
        error: "Erro ao limpar cache expirado",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * POST /api/cep/test/fake
   * Endpoint para testar com dados fake (sem frontend)
   */
  public testWithFakeData = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const testCeps = [
        "01001-000", // Praça da Sé
        "04038-001", // Vila Olímpia
        "01310-100", // Av. Paulista
        "08540-226", // Ferraz de Vasconcelos
        "01234-567", // CEP fake para testar erro
      ];

      const results = [];

      for (const testCep of testCeps) {
        try {
          const startTime = Date.now();
          const result = await this.viaCepService.getCep(testCep);
          const responseTime = Date.now() - startTime;

          results.push({
            cep: testCep,
            success: true,
            data: result,
            responseTime: `${responseTime}ms`,
          });
        } catch (error: any) {
          results.push({
            cep: testCep,
            success: false,
            error: error.message,
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Teste com dados fake concluído",
        data: {
          total_tests: testCeps.length,
          results: results,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("Erro no teste fake:", error);

      res.status(500).json({
        success: false,
        error: "Erro ao executar teste fake",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}
