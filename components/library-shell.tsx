"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { repositoryUrl } from "@/lib/project";

const groups = [
  { label: "Start", links: [{ href: "/", label: "Introduction" }, { href: "/blank", label: "Blank canvas" }, { href: "/story", label: "Example story" }] },
  { label: "Library", links: [{ href: "/components", label: "Components" }, { href: "/data", label: "Data and sources" }] },
];

export function LibraryShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border bg-card px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-white">s.</span>
          <span className="font-display text-lg font-bold">Story Starter</span>
          <span className="hidden border-l border-border pl-3 text-muted-foreground sm:inline">Terra Studio</span>
        </Link>
        {repositoryUrl && <nav aria-label="Project" className="flex gap-5">
          <a className="hover:text-primary" href={`${repositoryUrl}#readme`} target="_blank" rel="noopener noreferrer">README</a>
          <a className="hover:text-primary" href={repositoryUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </nav>} 
      </header>
      <div className="mx-auto flex max-w-screen-2xl flex-col lg:flex-row">
        <aside className="border-b border-border px-5 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0 lg:py-8">
          <nav aria-label="Kit" className="flex flex-wrap gap-x-6 gap-y-4 lg:flex-col">
            {groups.map((group) => (
              <div key={group.label} className="flex flex-col gap-0.5">
                <p className="px-3 pb-1.5 font-mono text-sm uppercase tracking-widest text-muted-foreground">{group.label}</p>
                <div className="flex flex-wrap gap-1 lg:flex-col">
                  {group.links.map((link) => {
                    const current = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={current ? "page" : undefined}
                        className={`rounded-md px-3 py-2 transition-colors ${current ? "bg-primary-soft font-semibold text-primary" : "text-foreground hover:bg-surface"}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <main id="main" className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
