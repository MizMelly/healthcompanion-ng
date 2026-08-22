import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  title: string;
  topic: string;
  summary: string;
  date: string;
  slug: string;
}

export default function ArticleCard({
  title,
  topic,
  summary,
  date,
  slug,
}: ArticleCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
          {topic}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold leading-7 text-slate-900">
        {title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
        {summary}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <CalendarDays size={14} />
          {date}
        </div>

        <Link
          to={`/articles/${slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-800"
        >
          Read article
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}