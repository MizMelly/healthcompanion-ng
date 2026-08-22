import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type ArticleCardProps = {
  title: string;
  topic?: string | null;
  summary: string;
  date: string;
  slug: string;
};

export default function ArticleCard({
  title,
  topic,
  summary,
  date,
  slug,
}: ArticleCardProps) {
  return (
    <Link
      to={`/articles/${slug}`}
      className="group flex min-h-57.5 flex-col rounded-[1.35rem] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-900/5 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
    >
      <div className="rounded-full bg-emerald-100 px-3 py-1">
        <p className="truncate text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-900">
          {topic ?? "Health"}
        </p>
      </div>

      <h3 className="mt-5 text-lg font-extrabold leading-6 text-emerald-950">
        {title}
      </h3>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-500">
        {summary}
      </p>

      <div className="mt-auto border-t border-stone-200 pt-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-stone-500">Published {date}</p>

          <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-emerald-600">
            Read article
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}