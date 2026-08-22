import { prisma } from "../lib/prisma";

type Article = {
  id: number;
  slug: string;
  title: string | null;
  topic: string;
  summary: string | null;
  body: string;
};

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "am",
  "i",
  "me",
  "my",
  "to",
  "for",
  "of",
  "and",
  "or",
  "in",
  "on",
  "with",
  "what",
  "how",
  "can",
  "do",
  "should",
  "if",
  "my",
  "about",
]);

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

export async function findRelevantArticles(question: string) {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      topic: true,
      summary: true,
      body: true,
    },
  });

  const questionWords = normalize(question);

  const scoredArticles = articles
    .map((article: Article) => {
      const articleTitle = article.title ?? "";
      const searchableText = normalize(
        [
          articleTitle,
          article.topic,
          article.summary ?? "",
          article.body,
        ].join(" ")
      );

      let score = 0;

      for (const word of questionWords) {
        if (searchableText.includes(word)) {
          score += 1;
        }

        if (normalize(articleTitle).includes(word)) {
          score += 3;
        }

        if (normalize(article.topic).includes(word)) {
          score += 2;
        }
      }

      return {
        article,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scoredArticles;
}