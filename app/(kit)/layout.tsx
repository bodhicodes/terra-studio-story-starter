import { LibraryShell } from "@/components/library-shell";

// Kit pages: home, components and data. Readers of your story never see this shell.
export default function KitLayout({ children }: { children: React.ReactNode }) {
  return <LibraryShell>{children}</LibraryShell>;
}
