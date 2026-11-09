import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const expected = 'https://victorsodre.github.io/oleoduto/';
const html = readFileSync('dist/index.html', 'utf8');
assert.ok(html.includes(`rel="canonical" href="${expected}"`), 'Canonical must match the project URL');
assert.ok(html.includes(`content="${expected}share.jpg"`), 'Share image must use the public URL');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const value = match[1];
  if (/^https?:/.test(value)) continue;
  assert.ok(!value.startsWith('/'), `Root-relative asset breaks project Pages: ${value}`);
  assert.ok(existsSync(resolve('dist', value.split(/[?#]/)[0])), `Missing asset: ${value}`);
}
for (const file of ['404.html', 'share.jpg', 'sitemap.xml', 'icon.svg']) {
  assert.ok(existsSync(`dist/${file}`), `Missing public file: ${file}`);
}
assert.ok(readFileSync('dist/404.html', 'utf8').includes(`href="${expected}"`), '404 must return to the project root');
assert.ok(html.includes('<noscript>'), 'Keep an accessible no-JavaScript fallback');
const videoId = readFileSync('src/content/video.ts', 'utf8').match(/"id":\s*"([\w-]{11})"/)?.[1];
assert.ok(videoId, 'Video ID not found in src/content/video.ts');
const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? 'null');
assert.equal(ld?.['@type'], 'VideoObject', 'Keep a VideoObject JSON-LD for the lab video');
assert.ok(ld.embedUrl?.endsWith(videoId) && ld.url?.endsWith(videoId) && ld.thumbnailUrl?.[0]?.includes(videoId), 'JSON-LD must describe the lab video');
assert.ok(ld.name && ld.description && ld.uploadDate && ld.duration, 'JSON-LD VideoObject needs name, description, uploadDate and duration');
assert.ok(/<div id="root"><article class="prerender">[\s\S]*<h1>/.test(html), 'Keep the indexable summary with a heading inside #root');
for (const term of ['gasolina', 'diesel']) assert.ok(html.match(/<title>([^<]*)<\/title>/)?.[1].includes(term), `Title must carry the search term: ${term}`);
console.log('Pages: caminhos em subpasta, metadados e arquivos públicos conferidos.');
