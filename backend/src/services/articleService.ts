import { prisma } from "../lib/prisma";

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      lastUpdated: "desc",
    },
    select: {
      id: true,
      slug: true,
      topic: true,
      summary: true,
      body: true,
      author: true,
      lastUpdated: true,
      publishedAt: true,
    },
  });
}

export async function getArticleBySlug(
  slug: string,
  language = "en"
) {
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
    return null;
  }

  const translation = article.translations[0];

  return {
    id: article.id,
    slug: article.slug,
    topic: article.topic,
    summary: article.summary,
    title: translation?.title ?? getEnglishTitle(article),
    body: translation?.body ?? article.body,
    author: article.author,
    language: translation ? language : "en",
    translationAvailable: Boolean(translation),
    lastUpdated: article.lastUpdated,
    publishedAt: article.publishedAt,
  };
}

function getEnglishTitle(article: {
  slug: string;
}) {
  return article.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}