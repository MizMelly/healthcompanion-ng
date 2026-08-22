import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getArticle, type ArticleDetails } from "../services/articleService.ts";

type Language = "en" | "pcm";

export default function ArticleDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [article, setArticle] = useState<ArticleDetails | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticle() {
      if (!slug) return;

      try {
        setLoading(true);
        setError("");

        const data = await getArticle(slug, language);

        setArticle(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this article.");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug, language]);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value as Language);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8faf8]">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="text-sm text-slate-500">
            Loading article...
          </p>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-[#f8faf8]">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Article not found
          </h1>

          <p className="mt-2 text-slate-500">
            {error || "We couldn't find this article."}
          </p>

          <Link
            to="/articles"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={17} />
            Back to articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf8]">
      <article>
        {/* Header */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <ArrowLeft size={17} />
              Back to articles
            </Link>

            <div className="mt-8">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                {article.topic}
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                {article.title}
              </h1>

              {article.summary && (
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  {article.summary}
                </p>
              )}

              {/* Meta */}
              <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{article.author}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  <span>
                    {new Date(article.lastUpdated).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
          {/* Language selector */}
          <div className="mb-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Language
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {language === "pcm"
                  ? article.translationAvailable
                    ? "Pidgin translation"
                    : "Pidgin unavailable — showing English"
                  : "English"}
              </p>
            </div>

            <select
              value={language}
              onChange={handleLanguageChange}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="en">English</option>
              <option value="pcm">Pidgin</option>
            </select>
          </div>

          {/* Article body */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-line text-base leading-8 text-slate-700">
                {article.body}
              </p>
            </div>
          </div>

          {/* Translation notice */}
          {language === "pcm" && article.translationAvailable && (
            <p className="mt-4 text-center text-xs text-slate-500">
              This article is available in Nigerian Pidgin.
            </p>
          )}
        </section>
      </article>
    </main>
  );
}