"use client";
import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })}
      className="min-h-10 shrink-0 rounded-md border border-border-strong bg-card px-3 py-1.5 hover:border-foreground"
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
