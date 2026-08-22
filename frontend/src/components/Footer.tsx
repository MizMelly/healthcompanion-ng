import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "Articles", path: "/articles" },
  { label: "Topics", path: "/topics" },
  { label: "Ask a Question", path: "/ask" },
  { label: "Design system", path: "/design-system" },
];

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-white">
                <Leaf size={21} strokeWidth={2.2} />
              </div>

              <p className="text-lg font-extrabold tracking-tight text-emerald-950">
                HealthCompanion<span className="text-emerald-500">NG</span>
              </p>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-6 text-stone-500">
              Simple health information you can understand.
            </p>
          </div>

          <div className="md:justify-self-end">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
              Explore
            </p>

            <nav className="mt-5 grid gap-x-20 gap-y-3 sm:grid-cols-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-stone-700 transition hover:text-emerald-700"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-sm text-stone-500 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>
            Health information is for educational purposes and does not replace
            professional medical advice.
          </p>

          <p className="shrink-0">© 2026 HealthCompanion NG</p>
        </div>
      </div>
    </footer>
  );
}