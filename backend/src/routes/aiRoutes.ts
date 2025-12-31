// backend/src/routes/aiRoutes.ts
import { Router } from "express";
import { chatWithAi } from "../controller/aiController";

const airouter = Router();

// POST http://localhost:3001/api/ai/chat
airouter.post("/chat", chatWithAi);

export default airouter;