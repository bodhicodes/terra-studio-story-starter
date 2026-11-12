import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terra Studio Story Starter",
  description: "A small, editable kit for climate and impact stories with reusable components, charts, and sourced data.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-background focus:p-3" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
