export type Source = { label: string; url: string; retrieved?: string };

export function SourceNote({ label, url, retrieved }: Source) {
  return (
    <p className="text-sm text-muted-foreground">
      Source: <a className="underline underline-offset-4 hover:text-foreground" href={url} target="_blank" rel="noopener noreferrer">{label}</a>
      {retrieved && ` · Retrieved ${retrieved}`}
    </p>
  );
}
