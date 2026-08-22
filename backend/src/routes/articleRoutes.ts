import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET /api/articles
 * Returns all published articles.
 */
router.get("/", async (_req, res) => {
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
    console.error("Failed to fetch articles:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch articles",
    });
  }
});

/**
 * GET /api/articles/:slug
 * Returns one published article.
 *
 * Optional:
 * ?language=pcm
 */
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
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
    console.error("Failed to fetch article:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch article",
    });
  }
});

export default router;