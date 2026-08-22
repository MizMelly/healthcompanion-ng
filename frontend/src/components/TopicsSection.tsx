import {
  Bug,
  Baby,
  Apple,
  Hand,
  Droplets,
  BriefcaseMedical,
  Syringe,
  UsersRound,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const topics = [
  {
    name: "Malaria",
    description: "Learn how to prevent malaria and recognise warning signs.",
    icon: Bug,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    slug: "malaria",
  },
  {
    name: "Maternal Health",
    description: "Practical information for pregnancy and breastfeeding.",
    icon: Baby,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    slug: "maternal-health",
  },
  {
    name: "Nutrition",
    description: "Simple guidance for healthier everyday meals.",
    icon: Apple,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    slug: "nutrition",
  },
  {
    name: "Hygiene",
    description: "Practical ways to prevent infections and stay healthy.",
    icon: Hand,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    slug: "hygiene",
  },
  {
    name: "Clean Water",
    description: "Learn how to keep your drinking water safe.",
    icon: Droplets,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    slug: "clean-water",
  },
  {
    name: "First Aid",
    description: "Simple information for common first-aid situations.",
    icon: BriefcaseMedical,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    slug: "first-aid",
  },
  {
    name: "Immunisation",
    description: "Learn about routine childhood immunisation.",
    icon: Syringe,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    slug: "immunisation",
  },
  {
    name: "Family Planning",
    description: "Information about safe options for spacing children.",
    icon: UsersRound,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    slug: "family-planning",
  },
];

export default function TopicsSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
            Health library
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Explore health topics
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Find practical information about everyday health and wellbeing.
          </p>
        </div>

        {/* Topic cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <Link
                key={topic.name}
                to={`/articles?topic=${topic.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${topic.iconBg}`}
                  >
                    <Icon
                      size={21}
                      strokeWidth={2}
                      className={topic.iconColor}
                    />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-slate-300 transition group-hover:text-emerald-600"
                  />
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  {topic.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {topic.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}