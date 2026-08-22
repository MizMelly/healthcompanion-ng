import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles, type Article } from "../services/articleService";
import ArticleCard from "./ArticleCard";

const formatDate = (value?: string | null) => {
  if (!value) return "Recently";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function LatestArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await getArticles();
        setArticles(data.slice(0, 6));
      } catch {
        setArticles([]);
      }
    };

    loadArticles();
  }, []);

  return (
    <section className="bg-[#f8faf8] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
              Health library
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Latest health information
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Explore practical guidance from our published health library.
            </p>
          </div>

          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View all articles
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              title={article.title ?? "Untitled article"}
              topic={article.topic}
              summary={article.summary ?? "Read more about this health topic."}
              date={formatDate(article.lastUpdated)}
              slug={article.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}