"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/today", label: "今日" },
  { href: "/ask", label: "问事" },
  { href: "/adjust", label: "调局" },
  { href: "/life", label: "一生命局" },
  { href: "/cases", label: "案卷" },
  { href: "/my", label: "我的" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-gold-soft/50 bg-paper/72 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3">
        <Link
          href="/"
          className="grid shrink-0 gap-0.5 text-ink transition hover:-translate-y-0.5"
        >
          <span className="font-song text-xl font-semibold tracking-[0.08em] sm:text-2xl">知己APP</span>
          <span className="hidden text-[11px] tracking-[0.08em] text-smoke/80 sm:block">身边的命理助手</span>
        </Link>
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-gold-soft/50 bg-white/28 p-1 text-xs text-smoke shadow-sm sm:text-sm">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                className={`relative whitespace-nowrap rounded-full px-3 py-1.5 transition hover:-translate-y-0.5 hover:bg-white/70 hover:text-ink sm:px-3.5 sm:py-2 ${
                  active
                    ? "bg-gold-soft/48 font-medium text-ink shadow-sm"
                    : "text-smoke"
                }`}
                href={item.href}
                key={item.href}
              >
                {active ? (
                  <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cinnabar" />
                ) : null}
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
