import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f3f8f4]">
      <div className="mx-auto grid min-h-155 max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-20">
        
        {/* Text */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            HEALTH INFORMATION FOR EVERYDAY LIFE
          </div>

          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Health information,
            <span className="block text-emerald-700">
              made simple.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Find clear, practical health information you can understand —
            created to help Nigerian communities make informed everyday health
            decisions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/ask"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              <MessageCircle size={18} />
              Ask a health question
            </Link>

            <Link
              to="/articles"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Explore articles
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <span>✓ Plain-language information</span>
            <span>✓ English & Pidgin</span>
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-200/50 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-lime-200/40 blur-3xl" />

          <div className="relative rounded-4xl border border-white bg-white p-5 shadow-xl shadow-emerald-950/5">
            
            <div className="rounded-3xl bg-emerald-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    Health Library
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    What would you like to learn?
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  ❤️
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-lg">
                    🦟
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">Malaria</p>
                    <p className="text-xs text-slate-500">
                      Prevention & warning signs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-lg">
                    🥗
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">Nutrition</p>
                    <p className="text-xs text-slate-500">
                      Simple healthy eating
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg">
                    💧
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Clean Water
                    </p>
                    <p className="text-xs text-slate-500">
                      Keeping drinking water safe
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-emerald-700 p-4 text-white">
                <p className="text-xs font-medium text-emerald-100">
                  ASK HEALTHCOMPANION
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Have a health question?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}