import { BriefCard, ChartSlot, Placeholder, PublishChecklist, StoryShell, type Brief } from "@/components/story";

// Step 1: fill this in before writing anything. Claude Code reads it first.
const brief: Brief = {
  audience: "",
  action: "",
  frame: "",
  messenger: "",
};

// Step 2: replace each <Placeholder> with the component it suggests, one beat at a time.
// Placeholders never render in a build, and `npm run build` prints any that are left.
const PLACEHOLDERS_LEFT = 6;

export default function BlankPage() {
  return (
    <StoryShell>
      <BriefCard brief={brief} />

      <section aria-labelledby="beats-title" className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-sm uppercase tracking-widest text-primary">Step 2 · The story</p>
          <h2 id="beats-title" className="font-display text-3xl font-semibold tracking-tight">Six beats, in Story Spine order.</h2>
          <p className="max-w-2xl text-muted-foreground">Each slot suggests a component. Replace the placeholder with it when you write that beat.</p>
        </div>

        <Placeholder step={1} beat="Once upon a time" hint="The world before the change, as this audience sees it." use="<Hero>" />
        <Placeholder step={2} beat="Every day" hint="What happens now: a routine, a cost or a pattern the reader knows." use={'<Section layout="text">'} />
        <Placeholder step={3} beat="One day" hint="The new finding. Use your hero metric." use="<BigNumber>">
          <span className="font-display text-7xl font-bold leading-none text-muted">00.0%</span>
          <span className="text-muted-foreground">Needs a value, a label and a source.</span>
        </Placeholder>
        <Placeholder step={4} beat="Because of that" hint="The first consequence, with the evidence beside it." use={'<Section layout="text-chart">'}>
          <ChartSlot />
        </Placeholder>
        <Placeholder step={5} beat="Because of that" hint="The next consequence. Use scroll steps when a chart needs explaining in stages." use="<ScrollSteps>" />
        <Placeholder step={6} beat="Until finally" hint="One action, matching the brief." use="<CallToAction>" />
      </section>

      <PublishChecklist brief={brief} placeholders={PLACEHOLDERS_LEFT} />
    </StoryShell>
  );
}
