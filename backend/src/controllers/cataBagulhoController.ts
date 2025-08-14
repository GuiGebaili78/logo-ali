import { Request, Response } from "express";
import { CataBagulhoService } from "../services/cataBagulhoService";

export class CataBagulhoController {
  private cataBagulhoService: CataBagulhoService;

  constructor() {
    this.cataBagulhoService = new CataBagulhoService();
  }

  public search = async (req: Request, res: Response): Promise<void> => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      res.status(400).json({ error: "Latitude (lat) e Longitude (lng) são obrigatórias." });
      return;
    }

    try {
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const results = await this.cataBagulhoService.search(latitude, longitude);
      res.status(200).json({ data: results });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}