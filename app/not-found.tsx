import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-4 px-6 py-16">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="font-display text-4xl font-bold leading-tight tracking-tight">This page isn&apos;t part of the story</h1>
      <Link className="w-fit font-semibold text-primary underline underline-offset-4" href="/story">Read the story from the start</Link>
    </main>
  );
}
