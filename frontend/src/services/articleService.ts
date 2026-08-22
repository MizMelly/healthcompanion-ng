const API_URL = "http://localhost:5000/api";

export interface Article {
  id: number;
  slug: string;
  title: string;
  topic: string;
  summary: string | null;
  author: string | null;
  lastUpdated: string;
}

export interface ArticleDetails extends Article {
  body: string;
  language: string;
  translationAvailable: boolean;
  publishedAt: string | null;
}

interface ArticlesResponse {
  success: boolean;
  data: Article[];
}

interface ArticleResponse {
  success: boolean;
  data: ArticleDetails;
}

export async function getArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/articles`);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  const result: ArticlesResponse = await response.json();

  return result.data;
}

export async function getArticle(
  slug: string,
  language = "en"
): Promise<ArticleDetails> {
  const response = await fetch(
    `${API_URL}/articles/${slug}?language=${language}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  const result: ArticleResponse = await response.json();

  return result.data;
}