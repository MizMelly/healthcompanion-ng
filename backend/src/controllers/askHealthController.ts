import { Request, Response } from "express";
import { askHealthQuestion } from "../services/askHealthService";
export const askHealth = async (
  req: Request,
  res: Response
) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a health question.",
      });
    }
    const cleanedQuestion = question.trim();
    if (cleanedQuestion.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Please enter a more detailed question.",
      });
    }
    const result = await askHealthQuestion(cleanedQuestion);
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Ask Health error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to process your health question right now.",
    });
  }
};