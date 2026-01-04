// backend/src/routes/aiRoutes.ts
import { Router } from "express";
import { chatWithAi } from "../controller/aiController";
import { authenticate } from "../middlewares/auth";

const airouter = Router();


airouter.post("/chat",authenticate, chatWithAi);

export default airouter;