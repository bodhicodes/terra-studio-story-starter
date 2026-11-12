import { DraftBar } from "@/components/story";
import Link from "next/link";

// Story pages keep a compact way back to the kit. The draft bar shows only in dev.
export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav aria-label="Story navigation" className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 border-b border-border px-6 py-4 sm:px-10">
        <Link className="mr-auto font-semibold" href="/">← Story Starter</Link>
        <Link href="/blank">Blank canvas</Link>
        <Link href="/story">Example story</Link>
        <Link href="/components">Components</Link>
        <Link href="/data">Data</Link>
      </nav>
      <DraftBar />
      <main id="main">{children}</main>
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">Built with the Terra Studio Story Starter</footer>
    </>
  );
}
