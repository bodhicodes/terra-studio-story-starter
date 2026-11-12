# Terra Studio Story Starter

One command gives you a story site with charts, real climate data, and a Claude Code setup that already knows how to tell a story.

`npx create-next-app@latest my-story -e https://github.com/YOUR_OWNER/YOUR_REPO`

Set the repository URL in `lib/project.ts` and replace `YOUR_OWNER/YOUR_REPO` below before publishing. GitHub and deploy links stay hidden until configured.

## Quick start

Install Node 20+ from [nodejs.org](https://nodejs.org/) and Git. Then run:

```sh
npx create-next-app@latest my-story -e https://github.com/YOUR_OWNER/YOUR_REPO
cd my-story
npm run dev
```

Open the local address printed by Next.js. The demo uses public climate and energy datasets. Review `data/SOURCES.md` for publishers, methods, licences, and caveats.

Once the repository is published, import it at [Vercel](https://vercel.com/new).

## Explore the routes

Kit pages (they keep the kit's navigation):

- `/` explains the starter kit.
- `/components` is the component gallery, grouped by the beat each component serves.
- `/data` describes each dataset, its licence and its caveats.

Story pages (a wide reading layout with compact links back to the kit):

- `/blank` is a structured starting point: a brief, six beats and a publish checklist. In `npm run dev` it shows placeholders; in a build they render nothing.
- `/story` is the example climate story.

Story pages live in `app/(story)/`. Kit pages live in `app/(kit)/`. The folder names in brackets don't appear in the URL.

## Make your own story in five steps

1. Open `app/(story)/blank/page.tsx` and fill in the `brief` object: audience, action, frame, messenger.
2. Replace each `<Placeholder>` with the component it suggests, one beat at a time.
3. Register your sources with `defineSources` and cite every number with `<Cite id="..." />`.
4. Pick a `layout` for each `Section`: `text`, `text-chart`, `chart-text` or `full`.
5. Work through the publish checklist at the bottom of the page, then run `npm run build`.

## What's inside

```text
app/(kit)/            Kit home, component gallery, data library
app/(story)/          Blank canvas and example story, with compact navigation
components/story/     Story sections, BigNumber, ScrollSteps, Cite and Sources, draft helpers
components/charts/    Line, bar, and stacked area charts
data/                 Dataset files and source register
lib/data.ts           Build-time CSV loader
scripts/              Dataset refresh script
```

## Data and deploy

Read `CLAUDE.md` to add a dataset. The site uses static export. Run `npm run build` and deploy the generated `out/` folder to Vercel, Netlify, or GitHub Pages.

## Troubleshooting

- **Node version:** use Node 20 or later.
- **Port already in use:** Next.js prints another local port when the default is busy.
- **Static export errors:** server-only features and runtime data fetches need to be removed. Load local data at build time.
- **"Placeholder still on the page" in the build output:** a beat on a story page hasn't been written yet. The build still finishes; the placeholder renders nothing.
- **Type error on `Cite`:** the `id` isn't registered in `defineSources`. Add the source or fix the key.
- **Refresh data:** run `npm run data:fetch` and review `data/SOURCES.md` before publishing updated figures.

## Credits

Created by Bodhi Debnath for Terra Studio. Data credits and licences are listed in `data/SOURCES.md`. Code is MIT licensed.
