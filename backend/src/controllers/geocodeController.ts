// --- Caminho: backend/src/controllers/geocodeController.ts ---
import { Request, Response } from "express";
import { GeocodeService } from "../services/geocodeService";

export class GeocodeController {
  private geocodeService = new GeocodeService();

  public search = async (req: Request, res: Response): Promise<void> => {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ success: false, message: "Parâmetro de busca 'q' é obrigatório." });
      return;
    }

    try {
      const results = await this.geocodeService.getCoordinatesFromAddress(q);
      res.status(200).json({ success: true, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Erro interno ao buscar coordenadas." });
    }
  };
}