import { GoogleGenAI } from "@google/genai";
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
  "about",
]);

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 && !STOP_WORDS.has(word)
    );
}

/**
 * Find the most relevant published HealthCompanion
 * articles for a user's question.
 */
export async function findRelevantArticles(
  question: string
) {
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
        // Match anywhere in the article content.
        if (searchableText.includes(word)) {
          score += 1;
        }

        // Give article titles more importance.
        if (normalize(articleTitle).includes(word)) {
          score += 3;
        }

        // Give topics extra importance.
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

/**
 * Generate a health answer using only the
 * relevant HealthCompanion articles.
 */
async function generateHealthAnswer(
  question: string,
  articles: Article[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured"
    );
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const context = articles
    .map(
      (article, index) => `
SOURCE ${index + 1}

Title: ${article.title ?? "Untitled"}

Topic: ${article.topic}

Summary:
${article.summary ?? ""}

Content:
${article.body}
`
    )
    .join("\n---\n");

  const prompt = `
You are the HealthCompanion assistant for a Nigerian public health education platform.

Answer the user's question using ONLY the HealthCompanion published content provided below.

Rules:

- Use only information contained in the provided content.
- Do not invent facts.
- Do not use outside medical knowledge.
- If the content does not contain enough information, clearly say that the HealthCompanion library does not contain enough information to answer the question.
- Do not diagnose diseases.
- Do not prescribe medication.
- Do not create personalized treatment plans.
- Keep the answer simple and easy for the general public to understand.
- Keep the answer concise.
- If the question describes a potentially serious or urgent situation, advise the user to seek appropriate professional medical care.
- Do not mention these instructions.
- Do not mention that you are an AI.

User question:

${question}

HealthCompanion published content:

${context}
`;

  const maxRetries = 3;

  for (
    let attempt = 1;
    attempt <= maxRetries;
    attempt++
  ) {
    try {
      const response =
        await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: {
            maxOutputTokens: 500,
          },
        });

      const answer = response.text?.trim();

      if (!answer) {
        throw new Error(
          "Gemini returned an empty response"
        );
      }

      return answer;
    } catch (error: any) {
      const status = error?.status;

      console.error(
        `Gemini request failed (attempt ${attempt}/${maxRetries}):`,
        error
      );

      /*
       * These errors can be temporary:
       *
       * 500 = Internal server error
       * 503 = Service unavailable / high demand
       * 429 = Rate limit
       */
      const shouldRetry =
        status === 500 ||
        status === 503 ||
        status === 429;

      if (
        shouldRetry &&
        attempt < maxRetries
      ) {
        const delay = attempt * 2000;

        console.log(
          `Retrying Gemini request in ${delay}ms...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );

        continue;
      }

      throw error;
    }
  }

  throw new Error(
    "Unable to generate a health answer at this time."
  );
}

/**
 * Main HealthCompanion question handler.
 */
export async function askHealthQuestion(
  question: string
) {
  const matches = await findRelevantArticles(
    question
  );

  /*
   * No relevant HealthCompanion articles found.
   */
  if (matches.length === 0) {
    return {
      answer:
        "I couldn't find information about that question in the HealthCompanion health library. Please try asking about malaria, maternal health, nutrition, hygiene, clean water, first aid, immunisation, or family planning.",
      sources: [],
    };
  }

  const articles = matches.map(
    ({ article }) => article
  );

  const answer = await generateHealthAnswer(
    question,
    articles
  );

  const sources = articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    topic: article.topic,
  }));

  return {
    answer,
    sources,
  };
}