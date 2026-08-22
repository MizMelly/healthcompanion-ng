import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import slugify from "slugify";
import sanitizeHtml from "sanitize-html";
import { ContentStatus } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

interface HealthRow {
  id: string;
  title: string;
  topic: string;
  summary: string;
  body: string;
  last_updated: string;
  author: string;
  status: string;
}

interface TranslationRow {
  article_id: string;
  language: string;
  title: string;
  body: string;
}

const DATA_DIR = path.resolve(process.cwd(), "../data");

function cleanText(value?: string): string {
  if (!value) return "";

  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTopic(topic?: string): string {
  const value = cleanText(topic).toLowerCase();

  const topics: Record<string, string> = {
    malaria: "Malaria",
    "malaria prevention": "Malaria",
    "maternal health": "Maternal Health",
    nutrition: "Nutrition",
    nutriton: "Nutrition",
    hygiene: "Hygiene",
    "clean water": "Clean Water",
    "first aid": "First Aid",
    immunisation: "Immunisation",
    immunization: "Immunisation",
    "family planning": "Family Planning",
  };

  return topics[value] ?? capitalizeWords(value);
}

function capitalizeWords(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeStatus(status?: string): ContentStatus {
  const value = cleanText(status).toLowerCase();

  if (
    value === "published" ||
    value === "true" ||
    value === "yes"
  ) {
    return ContentStatus.PUBLISHED;
  }

  return ContentStatus.DRAFT;
}

function parseDate(value?: string): Date | null {
  if (!value?.trim()) return null;

  const raw = value.trim();

  // ISO: 2025-01-04
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const date = new Date(`${raw}T00:00:00Z`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // ISO datetime
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // DD/MM/YYYY
  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (slashMatch) {
    const [, day, month, year] = slashMatch;

    const date = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day))
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  // "2nd April 2025"
  const ordinalCleaned = raw.replace(
    /(\d+)(st|nd|rd|th)/i,
    "$1"
  );

  const parsed = new Date(ordinalCleaned);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  // "Jan 2025"
  const monthYear = raw.match(
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})$/i
  );

  if (monthYear) {
    const [, month, year] = monthYear;

    const date = new Date(`${month} 1, ${year}`);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function createSlug(title: string, id: string): string {
  const base = slugify(title || `health-article-${id}`, {
    lower: true,
    strict: true,
    trim: true,
  });

  return base || `health-article-${id}`;
}

function normalizeTitle(title?: string): string {
  return cleanText(title);
}

function normalizeBody(body?: string): string {
  return cleanText(body);
}

function normalizeSummary(summary?: string): string | null {
  const cleaned = cleanText(summary);

  return cleaned || null;
}

async function loadCsv<T>(filename: string): Promise<T[]> {
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    trim: true,
  }) as T[];
}

async function importContent() {
  console.log("Starting HealthCompanion content import...");

  const healthRows = await loadCsv<HealthRow>(
    "health-content.csv"
  );

  const translationRows = await loadCsv<TranslationRow>(
    "pidgin-translations.csv"
  );

  console.log(`Found ${healthRows.length} health content rows.`);
  console.log(
    `Found ${translationRows.length} translation rows.`
  );

  const articleIdMap = new Map<number, number>();

  /*
   * We use a normalized content signature to detect obvious
   * duplicates while keeping genuinely different articles.
   */
  const seen = new Map<string, number>();

  for (const row of healthRows) {
    const title = normalizeTitle(row.title);
    const topic = normalizeTopic(row.topic);
    const summary = normalizeSummary(row.summary);
    const body = normalizeBody(row.body);

    // Skip completely empty rows.
    if (!title && !body && !summary) {
      console.log(
        `Skipping empty row with source ID ${row.id}`
      );
      continue;
    }

    const status = normalizeStatus(row.status);
    const lastUpdated =
      parseDate(row.last_updated) ?? new Date();

    /*
     * Duplicate signature:
     * topic + normalized body.
     *
     * Body is more reliable than title because titles vary:
     * "Antenatal visits"
     * "Antenatal care"
     */
    const signature = `${topic.toLowerCase()}|${body
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()}`;

    if (seen.has(signature)) {
      const existingArticleId = seen.get(signature)!;

      articleIdMap.set(Number(row.id), existingArticleId);

      console.log(
        `Duplicate detected: source ID ${row.id} → article ${existingArticleId}`
      );

      continue;
    }

    const slug = createSlug(title, row.id);

    const article = await prisma.article.upsert({
      where: {
        slug,
      },
      update: {
        title,
        topic,
        summary,
        body,
        author: cleanText(row.author) || null,
        status,
        publishedAt:
          status === ContentStatus.PUBLISHED
            ? lastUpdated
            : null,
        lastUpdated,
      },
      create: {
        slug,
        title,
        topic,
        summary,
        body,
        author: cleanText(row.author) || null,
        status,
        publishedAt:
          status === ContentStatus.PUBLISHED
            ? lastUpdated
            : null,
        lastUpdated,
      },
    });

    seen.set(signature, article.id);
    articleIdMap.set(Number(row.id), article.id);

    console.log(
      `Imported article ${row.id}: ${article.title ?? title}`
    );
  }

  /*
   * Import translations after articles exist.
   */
  for (const row of translationRows) {
    const sourceArticleId = Number(row.article_id);

    const articleId = articleIdMap.get(sourceArticleId);

    if (!articleId) {
      console.log(
        `Skipping translation for unknown article ${sourceArticleId}`
      );
      continue;
    }

    const language = cleanText(row.language).toLowerCase();
    const title = cleanText(row.title);
    const body = cleanText(row.body);

    if (!language || !title || !body) {
      console.log(
        `Skipping incomplete translation for article ${sourceArticleId}`
      );
      continue;
    }

    await prisma.translation.upsert({
      where: {
        articleId_language: {
          articleId,
          language,
        },
      },
      update: {
        title,
        body,
      },
      create: {
        articleId,
        language,
        title,
        body,
      },
    });

    console.log(
      `Imported ${language} translation for article ${sourceArticleId}`
    );
  }

  console.log("Import completed successfully.");
}

importContent()
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });