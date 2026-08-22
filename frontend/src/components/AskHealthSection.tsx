import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const exampleQuestions = [
  "How can I prevent malaria?",
  "What should I do if my child has a fever?",
  "What should I do for a minor burn?",
];

export default function AskHealthSection() {
  return (
    <section className="bg-[#f3f8f4] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-4xl bg-emerald-800">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            
            {/* Content */}
            <div className="px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-emerald-100">
                <Sparkles size={23} />
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-emerald-200">
                Health information assistant
              </p>

              <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Have a health question?
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-emerald-100">
                Ask a question about the health topics in our library and get a
                simple answer based on published HealthCompanion content.
              </p>

              <Link
                to="/ask"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                <MessageCircle size={18} />
                Ask HealthCompanion
                <ArrowRight size={17} />
              </Link>

              <p className="mt-5 max-w-lg text-xs leading-5 text-emerald-200">
                HealthCompanion provides health education based on its
                published content. It does not replace professional medical
                care.
              </p>
            </div>

            {/* Question preview */}
            <div className="relative flex items-center bg-emerald-900/40 px-6 py-10 sm:px-10 lg:px-12">
              <div className="w-full rounded-2xl border border-white/10 bg-white p-5 shadow-2xl">
                
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <MessageCircle size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Ask a question
                    </p>

                    <p className="text-xs text-slate-500">
                      Get information from our health library
                    </p>
                  </div>
                </div>

                {/* Input preview */}
                <div className="mt-5 rounded-xl border border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-400">
                    e.g. How can I prevent malaria?
                  </p>
                </div>

                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white">
                  Ask question
                  <ArrowRight size={16} />
                </button>

                {/* Example questions */}
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Try asking
                  </p>

                  <div className="mt-3 space-y-2">
                    {exampleQuestions.map((question) => (
                      <div
                        key={question}
                        className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600"
                      >
                        {question}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}