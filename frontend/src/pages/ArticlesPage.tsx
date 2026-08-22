import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import { getArticles, type Article } from "../services/articleService";

const topics = [
  "All",
  "Malaria",
  "Maternal Health",
  "Nutrition",
  "Hygiene",
  "Clean Water",
  "First Aid",
  "Immunisation",
  "Family Planning",
];

const formatDate = (value?: string | null) => {
  if (!value) return "Recently";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTopic = searchParams.get("topic") || "All";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await getArticles();
        setArticles(data);
        setError("");
      } catch {
        setError("Unable to load articles right now. Please try again soon.");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesTopic =
        selectedTopic === "All" || article.topic === selectedTopic;
      const matchesSearch =
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.topic.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTopic && matchesSearch;
    });
  }, [articles, searchTerm, selectedTopic]);

  return (
    <main className="min-h-screen bg-[#f8faf8]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
            Health library
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Health Articles
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Browse clear, practical information across everyday health topics.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search health articles..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 lg:hidden">
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => {
                if (topic === "All") {
                  setSearchParams({});
                } else {
                  setSearchParams({ topic });
                }
              }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedTopic === topic
                  ? "bg-emerald-700 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filteredArticles.length}</span>{" "}
            articles
          </p>

          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
            <option>English</option>
            <option>Pidgin</option>
          </select>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Loading articles...
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No articles match your filters.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
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
        )}
      </section>
    </main>
  );
}