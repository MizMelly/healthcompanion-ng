import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  askHealth,
  type HealthAnswer,
} from "../services/askHealthService";

const exampleQuestions = [
  "How can I prevent malaria?",
  "What should I do if my child has a fever?",
  "What should I do for a minor burn?",
];

export default function AskHealthPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<HealthAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    try {
      setLoading(true);
      setError("");
      setAnswer(null);

      const result = await askHealth(trimmedQuestion);

      setAnswer(result);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to get an answer right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
    setAnswer(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#f8faf8]">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft size={17} />
            Back home
          </Link>

          <div className="mt-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Sparkles size={23} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
              Health information assistant
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Ask HealthCompanion
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Ask a health question and get simple information based on
              HealthCompanion's published health content.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="health-question"
              className="text-sm font-semibold text-slate-900"
            >
              What would you like to know?
            </label>

            <textarea
              id="health-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. How can I prevent malaria?"
              rows={5}
              disabled={loading}
              className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                "Finding an answer..."
              ) : (
                <>
                  <Send size={17} />
                  Ask question
                </>
              )}
            </button>
          </form>

          {/* Examples */}
          {!answer && !loading && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Try asking
              </p>

              <div className="mt-3 space-y-2">
                {exampleQuestions.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => handleExampleClick(example)}
                    className="block w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-left text-sm text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="mt-8 rounded-xl bg-emerald-50 p-5">
              <p className="text-sm font-medium text-emerald-800">
                Searching the HealthCompanion library...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Answer */}
          {answer && !loading && (
            <div className="mt-8">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={18}
                    className="text-emerald-700"
                  />

                  <h2 className="text-lg font-bold text-slate-900">
                    HealthCompanion answer
                  </h2>
                </div>

                <div className="mt-5 space-y-4">
                  {answer.answer
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-base leading-8 text-slate-700"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>

              {/* Sources */}
              {answer.sources.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-slate-900">
                    Based on these HealthCompanion articles
                  </h3>

                  <div className="mt-3 space-y-2">
                    {answer.sources.map((source) => (
                      <Link
                        key={source.id}
                        to={`/articles/${source.slug}`}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {source.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {source.topic}
                          </p>
                        </div>

                        <ArrowRight
                          size={17}
                          className="text-emerald-700"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs leading-5 text-amber-800">
            HealthCompanion provides health education based on its
            published content. It does not replace professional medical
            care.
          </p>
        </div>
      </section>
    </main>
  );
}