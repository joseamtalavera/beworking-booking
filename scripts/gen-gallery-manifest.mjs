#!/usr/bin/env node
/**
 * Generates public/gallery/manifest.json by scanning the gallery folders.
 *
 * This is what makes the gallery "dynamic": to add/remove a photo you drop
 * (or delete) the .webp in public/gallery/full + public/gallery/thumb and
 * rebuild — no code edit in galeria.js is needed. Runs automatically on
 * `npm run build` via the `prebuild` hook.
 *
 *   spaces  -> public/gallery/full/*.webp        (paired with thumb/)
 *   events  -> public/gallery/events/full/*.webp (paired with events/thumb/)
 *   videos  -> public/gallery/videos.json        (config; src/poster/shape/title)
 *
 * EVENTS_DROPPED: a few legacy event frames are catering/kitchen shots with
 * no attendees. Until the events batch is re-triaged (issue #191 Phase E),
 * they are excluded here by basename so the live Events tab is unchanged.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const GALLERY = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'gallery');

const EVENTS_DROPPED = new Set(['026', '031', '050', '058']);

const webps = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith('.webp')).sort()
    : [];

function pairs(fullDir, thumbDir, urlBase, skip = () => false) {
  const thumbs = new Set(webps(thumbDir));
  return webps(fullDir)
    .filter((f) => !skip(f.replace('.webp', '')))
    .filter((f) => thumbs.has(f))
    .map((f) => ({ full: `${urlBase}/full/${f}`, thumb: `${urlBase}/thumb/${f}` }));
}

const spaces = pairs(
  join(GALLERY, 'full'),
  join(GALLERY, 'thumb'),
  '/gallery',
);

const events = pairs(
  join(GALLERY, 'events', 'full'),
  join(GALLERY, 'events', 'thumb'),
  '/gallery/events',
  (name) => EVENTS_DROPPED.has(name),
);

const videosPath = join(GALLERY, 'videos.json');
const videos = existsSync(videosPath)
  ? JSON.parse(readFileSync(videosPath, 'utf8'))
  : [];

const manifest = {
  generatedAt: new Date().toISOString(),
  spaces,
  events,
  videos,
};

writeFileSync(
  join(GALLERY, 'manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
);

console.log(
  `gallery manifest: ${spaces.length} spaces, ${events.length} events, ${videos.length} videos`,
);
