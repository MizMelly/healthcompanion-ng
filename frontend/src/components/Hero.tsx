import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Languages,
} from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg"; // adjust path if needed

const features = [
  {
    icon: Sparkles,
    title: "Plain language",
    text: "Health information that's easy to understand.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted content",
    text: "Based on the published HealthCompanion library.",
  },
  {
    icon: Smartphone,
    title: "Made for everyone",
    text: "Accessible on phones, tablets and computers.",
  },
  {
    icon: Languages,
    title: "Multiple languages",
    text: "English and Nigerian Pidgin, with more languages in the future.",
  },
];

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[#fbf8f1]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          {/* Text */}
          <div className="max-w-2xl text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">
              Health information for everyday life
            </p>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
              Health information,
              <span className="block">made simple.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-stone-600 sm:text-lg lg:mx-0">
              Clear, practical health information you can understand created
              to help Nigerian communities make informed everyday health
              decisions.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/ask"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-900 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-800 sm:w-auto"
              >
                Ask a health question
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/articles"
                className="inline-flex w-full items-center justify-center rounded-full border border-stone-200 bg-white px-7 py-4 text-sm font-bold text-emerald-950 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 sm:w-auto"
              >
                Explore articles
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative overflow-hidden rounded-4xl border border-stone-200 bg-[#f7efdf] shadow-xl shadow-stone-900/10">
              <img
                src={hero}
                alt="Nigerian family learning about health information"
                className="aspect-4/3 w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-1/2 flex w-[82%] max-w-xs -translate-x-1/2 items-center gap-3 rounded-3xl border border-stone-200 bg-white px-4 py-3 shadow-xl shadow-stone-900/12 sm:left-8 sm:w-auto sm:translate-x-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                <MessageCircle size={19} />
              </div>

              <div>
                <p className="text-sm font-extrabold text-emerald-950">
                  Ask HealthCompanion
                </p>
                <p className="text-xs text-stone-500">
                  Answers from published content
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Bar */}
        <div className="mt-20 rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-7 lg:mt-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                    <Icon size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-emerald-950">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-stone-500">
                      {feature.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}