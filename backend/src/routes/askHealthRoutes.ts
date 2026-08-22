import { Router } from "express";
import { askHealth } from "../controllers/askHealthController";

const router = Router();

router.post("/", askHealth);

export default router;