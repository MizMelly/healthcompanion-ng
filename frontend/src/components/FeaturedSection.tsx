import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Featured from "../assets/featured.jpg";

export default function FeaturedSection() {
  return (
    <section className="bg-[#fbf8f1] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
            Featured
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
            Start with something useful
          </h2>
        </div>

        <div className="mt-9 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm shadow-stone-900/5 lg:grid lg:grid-cols-2">
          <div className="min-h-65#f2dfb6] sm:min-h-85 lg:min-h-97.5">
            <img
              src={Featured}
              alt="Child sleeping under a treated mosquito net"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center p-6 sm:p-8 lg:p-10">
            <div className="max-w-xl">
              <div className="rounded-full bg-emerald-100 px-3 py-1">
                <p className="truncate text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-900">
                  Malaria
                </p>
              </div>

              <h3 className="mt-5 text-2xl font-extrabold leading-tight text-emerald-950 sm:text-3xl">
                Sleeping under a treated net
              </h3>

              <p className="mt-4 text-base leading-7 text-stone-600">
                Sleep under an insecticide-treated net every night to help
                prevent malaria.
              </p>

              <Link
                to="/articles/sleeping-under-a-treated-net"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Read article
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}