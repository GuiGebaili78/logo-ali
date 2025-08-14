import { Router } from "express";
import { CataBagulhoController } from "../controllers/cataBagulhoController";

const router = Router();
const controller = new CataBagulhoController();

router.get("/cata-bagulho", controller.search);

export default router;