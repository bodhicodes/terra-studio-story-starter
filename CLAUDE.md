# Story Starter guidance

This repository is a small static story site with reusable story sections and charts. Run `npm install`, then `npm run dev`.

## Before writing story copy

Ask who the audience is, what they should do, who the messenger is, and which values frame fits the audience. Do not draft copy until those four are known.

## Ground Truth

Draft claims only from `data/`, `data/SOURCES.md`, and source files the user adds. If a needed fact is missing, say so and ask. Never add a number, quote, or source from memory.

## Story structure

Use the Story Spine. Connect sections with “because of that,” not “and then.” End with an action the reader can take.

## Synthetic content

Never write words for a real person. Quotes must be real and sourced. Mark illustrative or generated content with `SyntheticLabel`.

## Story pages

Story pages live in `app/(story)/` and keep compact links back to the kit. Kit pages live in `app/(kit)/`. A new story goes in `app/(story)/<name>/page.tsx`.

Build stories from the components in `components/story/`: `Hero`, `Section` (layouts `text`, `text-chart`, `chart-text`, `full`; pass charts as `visual`), `BigNumber`, `ScrollSteps`, `CallToAction`. Register sources once with `defineSources` and put `<Cite id="..." />` after every number in text. Never leave a number without a `Cite` or a chart `source`.

On the blank canvas, replace one `<Placeholder>` at a time with the component it names, and update `PLACEHOLDERS_LEFT`. Fill in the `brief` object before drafting any beat.

## Code conventions

Reuse components first. Use Tailwind tokens, flex and grid, and small typed components. Add each new component to `app/(kit)/components/page.tsx`. Chart colours come from `components/charts/theme.ts`; add a fixed colour for any new series. Keep the site a static export.

## Writing rules

Use plain, specific sentences. Do not use em dashes, “not X, but Y” constructions, or hype words such as leverage, unlock, empower, harness, cutting-edge, game-changing, or revolutionize.

## Skills

`/aislop` cleans copy that sounds machine-written. Run it on new copy before calling a section done.

## Adding data

Save the file in `data/`, add all required provenance and caveats to `data/SOURCES.md`, add a typed loader in `lib/data.ts`, add a card to `app/(kit)/data/page.tsx`, and add redownload support to `scripts/fetch-data.mjs` when possible.

## Deploying

Run `npm run build`, then deploy `out/`, or push to GitHub and import the repository in Vercel.
