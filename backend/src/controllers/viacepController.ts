import { Request, Response } from "express";
import { ViaCepService } from "../services/viacepService";
import { ViaCepResponse } from "../types/viacep";

export class ViaCepController {
  private viaCepService = new ViaCepService();

  public getCep = async (req: Request, res: Response) => {
    try {
      const { cep } = req.params;
      if (!cep) {
        return res.status(400).json({ success: false, message: "CEP é obrigatório" });
      }
      const data = await this.viaCepService.buscarEnderecoPorCep(cep);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("[ViaCepController:getCep] Erro:", error?.message || error);
      return res.status(500).json({ success: false, message: "Erro ao buscar CEP" });
    }
  };

  public getCacheStats = (_req: Request, res: Response) => {
    const stats = this.viaCepService.getCacheStats();
    return res.status(200).json({ success: true, data: stats });
  };

  public clearExpiredCache = (_req: Request, res: Response) => {
    const result = this.viaCepService.clearExpiredCache();
    return res.status(200).json({ success: true, data: result });
  };

  /**
   * Endpoint de teste para popular o cache com dados fake.
   * POST /api/cep/test/fake
   * body: { cep: "01001000", data?: ViaCepResponse }
   */
  public testWithFakeData = (req: Request, res: Response) => {
    try {
      const { cep, data } = req.body as { cep?: string; data?: ViaCepResponse };
      if (!cep) {
        return res.status(400).json({ success: false, message: "Informe um CEP no corpo da requisição." });
      }

      // Dados padrão se não enviar "data"
      const fake: ViaCepResponse =
        data || {
          cep: "01001-000",
          logradouro: "Praça da Sé",
          complemento: "lado ímpar",
          unidade: "",
          bairro: "Sé",
          localidade: "São Paulo",
          uf: "SP",
        };

      const r = this.viaCepService.seedCache(cep, fake);
      return res.status(200).json({ success: true, data: { ...r, fake } });
    } catch (error: any) {
      console.error("[ViaCepController:testWithFakeData] Erro:", error?.message || error);
      return res.status(500).json({ success: false, message: "Erro ao inserir dados fake no cache" });
    }
  };
}
