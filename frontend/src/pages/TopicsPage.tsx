import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { getArticles, type Article } from "../services/articleService";

export default function TopicsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getArticles();
        setArticles(data);
      } catch (err) {
        console.error("Failed to load topics:", err);
        setError("Failed to load health topics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const topics = useMemo(() => {
    const topicMap = new Map<string, number>();

    articles.forEach((article) => {
      if (!article.topic) return;

      topicMap.set(
        article.topic,
        (topicMap.get(article.topic) || 0) + 1
      );
    });

    return Array.from(topicMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [articles]);

  return (
    <main className="min-h-screen bg-[#f8faf8]">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
            Health library
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Health Topics
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Explore health information by topic and find practical guidance
            for you and your family.
          </p>
        </div>
      </section>

      {/* Topics */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Loading topics...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            {error}
          </div>
        ) : topics.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No topics available.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map(([topic, count]) => (
              <Link
                key={topic}
                to={`/articles?topic=${encodeURIComponent(topic)}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <BookOpen size={20} />
                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:text-emerald-700"
                  />
                </div>

                <h2 className="mt-6 text-xl font-bold text-slate-900">
                  {topic}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {count} {count === 1 ? "article" : "articles"}
                </p>

                <p className="mt-4 text-sm font-semibold text-emerald-700">
                  Explore topic
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}