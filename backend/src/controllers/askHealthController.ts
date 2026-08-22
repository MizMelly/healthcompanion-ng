import { Request, Response } from "express";
import { findRelevantArticles } from "../services/askHealthService";

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

    const matches = await findRelevantArticles(cleanedQuestion);

    if (matches.length === 0) {
      return res.json({
        success: true,
        data: {
          answer:
            "I couldn't find information about that question in the HealthCompanion health library. Please try asking about malaria, maternal health, nutrition, hygiene, clean water, first aid, immunisation, or family planning.",
          sources: [],
        },
      });
    }

    const answer = matches
      .map(({ article }) => article.body)
      .join("\n\n");

    const sources = matches.map(({ article }) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      topic: article.topic,
    }));

    return res.json({
      success: true,
      data: {
        answer,
        sources,
      },
    });
  } catch (error) {
    console.error("Ask Health error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process your health question.",
    });
  }
};