import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getArticles = async (_req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        lastUpdated: "desc",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        topic: true,
        summary: true,
        author: true,
        lastUpdated: true,
      },
    });

    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
    });
  }
};

export const getArticleBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    const language =
      typeof req.query.language === "string"
        ? req.query.language.toLowerCase()
        : "en";

    const article = await prisma.article.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: {
        translations: {
          where: {
            language,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    const translation = article.translations[0];

    res.json({
      success: true,
      data: {
        id: article.id,
        slug: article.slug,
        title: translation?.title ?? article.title,
        topic: article.topic,
        summary: article.summary,
        body: translation?.body ?? article.body,
        author: article.author,
        language: translation ? language : "en",
        translationAvailable: Boolean(translation),
        lastUpdated: article.lastUpdated,
        publishedAt: article.publishedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching article:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
    });
  }
};