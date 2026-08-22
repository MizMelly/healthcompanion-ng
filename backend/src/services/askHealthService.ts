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

      const normalizedTitle =
        normalize(articleTitle);

      const normalizedTopic =
        normalize(article.topic);

      let score = 0;

      for (const word of questionWords) {
        // Match in the article content.
        if (searchableText.includes(word)) {
          score += 1;
        }

        // Give title matches more importance.
        if (normalizedTitle.includes(word)) {
          score += 3;
        }

        // Give topic matches extra importance.
        if (normalizedTopic.includes(word)) {
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
 *
 * Primary model:
 *   gemini-3.1-flash-lite
 *
 * Fallback model:
 *   gemini-2.5-flash
 *
 * Temporary Gemini errors are retried automatically.
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

Title:
${article.title ?? "Untitled"}

Topic:
${article.topic}

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

  /*
   * Try the primary model first.
   * If it is temporarily unavailable,
   * automatically try the fallback model.
   */
  const models = [
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
  ];

  /*
   * Temporary errors that are safe to retry:
   *
   * 429 = Too many requests / rate limit
   * 500 = Internal server error
   * 503 = Service unavailable / high demand
   */
  const retryableStatuses = new Set([
    429,
    500,
    503,
  ]);

  for (const model of models) {
    const maxRetries = 2;

    for (
      let attempt = 1;
      attempt <= maxRetries;
      attempt++
    ) {
      try {
        console.log(
          `Trying Gemini model: ${model} (attempt ${attempt}/${maxRetries})`
        );

        const response =
          await ai.models.generateContent({
            model,
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

        console.log(
          `Gemini response successful using ${model}`
        );

        return answer;
      } catch (error: unknown) {
        const status =
          typeof error === "object" &&
          error !== null &&
          "status" in error
            ? (error as { status?: number }).status
            : undefined;

        console.error(
          `Gemini ${model} failed (attempt ${attempt}/${maxRetries}):`,
          error
        );

        /*
         * Retry temporary Gemini errors.
         */
        if (
          status !== undefined &&
          retryableStatuses.has(status) &&
          attempt < maxRetries
        ) {
          const delay = attempt * 2000;

          console.log(
            `Retrying ${model} in ${delay}ms...`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, delay)
          );

          continue;
        }

        /*
         * If this model has failed after all retries,
         * move to the next model.
         */
        console.error(
          `Model ${model} is unavailable.`
        );

        break;
      }
    }
  }

  /*
   * Both models failed.
   */
  throw new Error(
    "All Gemini models are temporarily unavailable. Please try again later."
  );
}

/**
 * Main HealthCompanion question handler.
 */
export async function askHealthQuestion(
  question: string
) {
  /*
   * Clean the question before searching.
   */
  const cleanQuestion = question.trim();

  if (!cleanQuestion) {
    return {
      answer:
        "Please enter a health question so I can help you.",
      sources: [],
    };
  }

  /*
   * Find relevant published articles.
   */
  const matches = await findRelevantArticles(
    cleanQuestion
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

  /*
   * Extract the actual articles.
   */
  const articles = matches.map(
    ({ article }) => article
  );

  /*
   * Generate the answer using Gemini.
   */
  const answer = await generateHealthAnswer(
    cleanQuestion,
    articles
  );

  /*
   * Return article references to the frontend.
   */
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