// --- Caminho: backend/src/routes/geocodeRoutes.ts ---
import { Router } from "express";
import { GeocodeController } from "../controllers/geocodeController";

const router = Router();
const controller = new GeocodeController();

// Rota para geocodificação, ex: /api/geocode?q=Avenida Paulista, 1500
router.get("/geocode", controller.search);

export default router;