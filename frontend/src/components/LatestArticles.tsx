import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles, type Article } from "../services/articleService";
import ArticleCard from "./ArticleCard";

const formatDate = (value?: string | null) => {
  if (!value) return "Recently";

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
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
    <section className="bg-[#fbf8f1] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
              Library
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
              Latest health information
            </h2>

            <p className="mt-4 text-base leading-7 text-stone-600">
              Explore practical guidance from our published health library.
            </p>
          </div>

          <Link
            to="/articles"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-emerald-950 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
          >
            All articles
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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