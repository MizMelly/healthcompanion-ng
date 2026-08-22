import { ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

const exampleQuestions = [
  "How can I prevent malaria?",
  "What should I do if my child has a fever?",
  "How should I treat a minor burn?",
];

export default function AskHealthSection() {
  return (
    <section className="bg-[#fbf8f1] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-4xl border border-emerald-100 bg-emerald-50 px-5 py-12 text-center sm:rounded-[2.5rem] sm:px-8 sm:py-16 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
            Ask HealthCompanion
          </p>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
            Have a health question?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600">
            Ask about the health topics in our library and get a simple answer
            based on published HealthCompanion content.
          </p>

          <div className="mx-auto mt-9 flex max-w-3xl flex-col gap-3 rounded-[1.6rem] bg-white p-2 shadow-lg shadow-emerald-950/10 sm:flex-row sm:items-center sm:rounded-full">
            <div className="flex min-h-14 flex-1 items-center px-5 text-left text-sm text-stone-500 sm:text-base">
              e.g. How can I prevent malaria?
            </div>

            <Link
              to="/ask"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-emerald-800 sm:shrink-0"
            >
              Ask HealthCompanion
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
            {exampleQuestions.map((question) => (
              <Link
                key={question}
                to="/ask"
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-800"
              >
                {question}
              </Link>
            ))}
          </div>

          <div className="mx-auto mt-8 flex max-w-xl items-start gap-3 rounded-2xl border border-stone-200/80 bg-[#fbfaf5] px-4 py-4 text-left text-sm leading-6 text-stone-600 sm:px-5">
            <Info
              size={17}
              className="mt-0.5 shrink-0 text-emerald-600"
            />
            <p>
              HealthCompanion provides health education and does not replace
              professional medical care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}