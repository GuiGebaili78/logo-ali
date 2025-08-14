import { Router } from "express";
import { ViaCepController } from "../controllers/viacepController";

const router = Router();
const viaCepController = new ViaCepController();

router.post("/cep/test/fake", viaCepController.testWithFakeData);
router.get("/cep/cache/stats", viaCepController.getCacheStats);
router.delete("/cep/cache/expired", viaCepController.clearExpiredCache);
router.get("/cep/:cep", viaCepController.getCep);

export default router;
