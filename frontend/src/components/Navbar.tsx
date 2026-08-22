import { useState } from "react";
import { Menu, X, Leaf, Globe2, ChevronDown } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Articles", path: "/articles" },
  { label: "Topics", path: "/topics" },
  { label: "Ask a Question", path: "/ask" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e2d6] bg-[#fbf8f1]">
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-white">
            <Leaf size={21} strokeWidth={2.2} />
          </div>

          <p className="text-lg font-extrabold tracking-tight text-emerald-950">
            HealthCompanion<span className="text-emerald-500">NG</span>
          </p>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-emerald-900"
                    : "text-stone-500 hover:text-emerald-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Language */}
        <button className="hidden items-center gap-2 rounded-full border border-[#e8e2d6] bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-stone-50 md:flex">
          <Globe2 size={16} className="text-emerald-700" />
          English
          <ChevronDown size={15} />
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-full border border-[#e8e2d6] bg-white p-2 text-emerald-950 shadow-sm md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-[#e8e2d6] bg-[#fbf8f1] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-900 text-white"
                      : "text-stone-600 hover:bg-white hover:text-emerald-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button className="mt-4 flex w-full items-center justify-between rounded-full border border-[#e8e2d6] bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <span className="flex items-center gap-2">
              <Globe2 size={16} className="text-emerald-700" />
              English
            </span>
            <ChevronDown size={15} />
          </button>
        </div>
      )}
    </header>
  );
}