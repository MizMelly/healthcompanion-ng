import {
  Bug,
  Baby,
  Apple,
  Hand,
  Droplets,
  BriefcaseMedical,
  Syringe,
  UsersRound,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const topics = [
  {
    name: "Malaria",
    description: "Prevent malaria and recognise important warning signs.",
    icon: Bug,
    slug: "malaria",
  },
  {
    name: "Maternal Health",
    description: "Information for pregnancy, childbirth and breastfeeding.",
    icon: Baby,
    slug: "maternal-health",
  },
  {
    name: "Nutrition",
    description: "Simple guidance for healthier everyday meals.",
    icon: Apple,
    slug: "nutrition",
  },
  {
    name: "Hygiene",
    description: "Practical ways to prevent infections and stay healthy.",
    icon: Hand,
    slug: "hygiene",
  },
  {
    name: "Clean Water",
    description: "Learn how to keep drinking water safe.",
    icon: Droplets,
    slug: "clean-water",
  },
  {
    name: "First Aid",
    description: "Simple first-aid information for common emergencies.",
    icon: BriefcaseMedical,
    slug: "first-aid",
  },
  {
    name: "Immunisation",
    description: "Learn about routine childhood immunisation.",
    icon: Syringe,
    slug: "immunisation",
  },
  {
    name: "Family Planning",
    description: "Information about safe options for spacing children.",
    icon: UsersRound,
    slug: "family-planning",
  },
];

export default function TopicsSection() {
  return (
    <section className="bg-[#fbf8f1] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
            Topics
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
            Explore health topics
          </h2>

          <p className="mt-4 text-base leading-7 text-stone-600">
            Find practical information about everyday health and wellbeing.
          </p>
        </div>

        {/* Topic cards */}
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <Link
                key={topic.name}
                to={`/articles?topic=${encodeURIComponent(topic.name)}`}
                className="group flex min-h-47.5 flex-col rounded-[1.35rem] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-900/5 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-stone-900/8 sm:min-h-51.25"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
                  <Icon size={20} strokeWidth={2} />
                </div>

                <h3 className="mt-6 text-base font-extrabold text-emerald-950">
                  {topic.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  {topic.description}
                </p>

                <ArrowRight
                  size={17}
                  className="mt-auto text-emerald-600 transition group-hover:translate-x-1"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}