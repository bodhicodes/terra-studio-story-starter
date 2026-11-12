"use client";
import { Area, AreaChart, Bar, BarChart as RechartsBar, CartesianGrid, Cell, Line, LineChart as RechartsLine, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReactElement, ReactNode } from "react";
import { colorFor, highlightColor, labelFor, mutedBarColor } from "./theme";
import { SourceNote, type Source } from "../story/source-note";

type Props = {
  data: Record<string, string | number>[];
  xKey: string;
  yKeys: string[];
  title: string;
  unit: string;
  summary: string;
  source: Source;
  annotation?: { x: string | number; label: string };
};

const axis = { stroke: "#737373", fontSize: 13 };

function Legend({ keys, reverse, vertical, focus }: { keys: string[]; reverse?: boolean; vertical?: boolean; focus?: string[] }) {
  if (keys.length < 2) return null;
  const ordered = reverse ? [...keys].reverse() : keys;
  return (
    <ul className={vertical ? "flex shrink-0 flex-col justify-between gap-2 text-sm" : "flex flex-wrap gap-x-4 gap-y-1.5 text-sm"}>
      {ordered.map((key) => (
        <li key={key} className={`flex items-center gap-2 ${focus ? (focus.includes(key) ? "font-semibold text-foreground" : "text-muted-foreground") : ""}`}>
          <span aria-hidden="true" className="size-3 shrink-0" style={{ background: colorFor(key, keys.indexOf(key)) }} />
          {labelFor(key)}
        </li>
      ))}
    </ul>
  );
}

type Extra = {
  /** Series to emphasise. The rest are dimmed. */
  focus?: string[];
  /** Short version for ScrollSteps: legend beside the plot, no visible caption, fits in one screen. */
  compact?: boolean;
};

function Frame({ title, summary, source, yKeys, children, reverseLegend, compact, focus, tag }: Props & Extra & { children: ReactNode; reverseLegend?: boolean; tag?: string }) {
  const chart = <ResponsiveContainer width="100%" height="100%">{children as ReactElement}</ResponsiveContainer>;
  return (
    <figure className="flex min-w-0 flex-col gap-4 border border-border bg-card p-5 sm:p-6">
      <h3 className="font-semibold text-foreground">{title}</h3>
      {compact ? (
        <div className="flex flex-col gap-2">
          <div className="flex h-8 justify-end">{tag && <span className="bg-foreground px-3 py-1 text-sm font-medium text-background">{tag}</span>}</div>
          <div className="flex gap-4">
            <div className="h-[min(22rem,46vh)] min-w-0 flex-1" role="img" aria-label={`${title}. ${summary}`}>{chart}</div>
            <Legend keys={yKeys} reverse={reverseLegend} vertical focus={focus} />
          </div>
        </div>
      ) : (
        <>
          <Legend keys={yKeys} reverse={reverseLegend} />
          <div className="h-72 w-full sm:h-80" role="img" aria-label={`${title}. ${summary}`}>{chart}</div>
        </>
      )}
      <figcaption className={compact ? "sr-only" : "text-sm leading-6 text-muted-foreground"}>{summary}</figcaption>
      <SourceNote {...source} />
    </figure>
  );
}

function Annotation({ annotation }: { annotation?: Props["annotation"] }) {
  if (!annotation) return null;
  return <ReferenceLine x={annotation.x} stroke="#0a0a0a" strokeDasharray="4 4" label={{ value: annotation.label, position: "insideTopRight", fill: "#0a0a0a", fontSize: 13 }} />;
}

export function LineChart(props: Props) {
  return (
    <Frame {...props}>
      <RechartsLine data={props.data} margin={{ top: 12, right: 12, bottom: 8, left: 4 }}>
        <CartesianGrid stroke="#e5e5e5" vertical={false} />
        <XAxis dataKey={props.xKey} tick={axis} />
        <YAxis unit={props.unit} tick={axis} width={72} domain={["auto", "auto"]} />
        <Tooltip />
        {props.yKeys.map((key, i) => <Line key={key} name={labelFor(key)} dataKey={key} stroke={colorFor(key, i)} dot={false} strokeWidth={3} />)}
        {Annotation({ annotation: props.annotation })}
      </RechartsLine>
    </Frame>
  );
}

export function BarChart(props: Props & { highlight?: string }) {
  const key = props.yKeys[0];
  return (
    <Frame {...props}>
      <RechartsBar data={props.data} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 16 }}>
        <CartesianGrid stroke="#e5e5e5" horizontal={false} />
        <XAxis type="number" unit={props.unit} tick={axis} />
        <YAxis type="category" dataKey={props.xKey} width={120} tick={axis} interval={0} />
        <Tooltip />
        <Bar dataKey={key} name={labelFor(key)} fill={colorFor(key, 0)}>
          {props.highlight && props.data.map((row) => <Cell key={String(row[props.xKey])} fill={row[props.xKey] === props.highlight ? highlightColor : mutedBarColor} />)}
        </Bar>
      </RechartsBar>
    </Frame>
  );
}

export function StackedArea(props: Props & Extra) {
  const { focus, compact, annotation } = props;
  const dimmed = (key: string) => Boolean(focus) && !focus?.includes(key);
  return (
    <Frame {...props} reverseLegend tag={compact ? annotation?.label : undefined}>
      <AreaChart data={props.data} margin={{ top: 12, right: 12, bottom: 8, left: 4 }}>
        <CartesianGrid stroke="#e5e5e5" vertical={false} />
        <XAxis dataKey={props.xKey} tick={axis} minTickGap={compact ? 36 : 5} />
        <YAxis unit={props.unit} tick={axis} width={56} domain={[0, 100]} allowDataOverflow />
        <Tooltip />
        {props.yKeys.map((key, i) => (
          <Area key={key} name={labelFor(key)} dataKey={key} stackId="1" type="monotone" isAnimationActive={false} stroke={colorFor(key, i)} fill={colorFor(key, i)} fillOpacity={dimmed(key) ? 0.28 : 0.95} strokeOpacity={dimmed(key) ? 0.28 : 1} />
        ))}
        {compact
          ? annotation && <ReferenceLine x={annotation.x} stroke="#ffffff" strokeWidth={2} strokeDasharray="5 4" />
          : Annotation({ annotation })}
      </AreaChart>
    </Frame>
  );
}
