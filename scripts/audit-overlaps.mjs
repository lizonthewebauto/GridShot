// Audit all rendered samples for text-on-text overlaps.
// Loads /samples/render, walks each [id^="sample-"] div, collects every leaf
// text element's bounding rect, then flags pairs whose rects intersect by more
// than MIN_OVERLAP_AREA pixels². Writes a report to audit-overlaps.json.
import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { join } from 'path';

const URL = 'http://localhost:3000/samples/render';
const OUT_PATH = join(process.cwd(), 'audit-overlaps.json');
const MIN_OVERLAP_AREA = 50; // pixels² — anything smaller is noise

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 2400, height: 2400, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);

  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('[id^="sample-"] img'));
    await Promise.all(
      imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; }))
    );
  });

  const overlaps = await page.evaluate((MIN) => {
    function rectsIntersect(a, b) {
      const x = Math.max(a.left, b.left);
      const y = Math.max(a.top, b.top);
      const r = Math.min(a.right, b.right);
      const btm = Math.min(a.bottom, b.bottom);
      if (x >= r || y >= btm) return 0;
      return (r - x) * (btm - y);
    }

    function collectTextElements(root) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const set = new Set();
      let n;
      while ((n = walker.nextNode())) {
        const txt = (n.textContent || '').trim();
        if (txt.length === 0) continue;
        const el = n.parentElement;
        if (!el) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        // Skip intentionally decorative/faint elements (e.g. huge opening quote
        // mark at opacity 0.18 behind testimonial copy).
        if (parseFloat(cs.opacity || '1') < 0.3) continue;
        set.add(el);
      }
      return [...set];
    }

    // Returns true if `a` and `b` live in the same inline-flow line of text —
    // their bounding rects touch but the overlap is just the natural
    // line-box adjacency of adjacent <span>s (e.g. coloured-first-letter).
    function isInlineSiblings(a, b) {
      const ap = a.el.parentElement;
      const bp = b.el.parentElement;
      if (!ap || ap !== bp) return false;
      const apCs = getComputedStyle(ap);
      // same inline container (h1, p, span) with adjacent inline spans
      return apCs.display !== 'block' || Array.from(ap.children).includes(a.el) && Array.from(ap.children).includes(b.el);
    }

    const result = [];
    const samples = document.querySelectorAll('[id^="sample-"]');
    for (const sample of samples) {
      const sampleRect = sample.getBoundingClientRect();
      const textEls = collectTextElements(sample).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          // normalize rect to sample-local coords
          rect: {
            left: r.left - sampleRect.left,
            top: r.top - sampleRect.top,
            right: r.right - sampleRect.left,
            bottom: r.bottom - sampleRect.top,
          },
          text: (el.innerText || el.textContent || '').trim().slice(0, 60),
        };
      });

      const sampleOverlaps = [];
      for (let i = 0; i < textEls.length; i++) {
        for (let j = i + 1; j < textEls.length; j++) {
          const a = textEls[i];
          const b = textEls[j];
          // skip if one contains the other (parent-child shared text region)
          if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
          // skip adjacent inline siblings (e.g. coloured first-letter spans)
          if (isInlineSiblings(a, b)) continue;
          const area = rectsIntersect(a.rect, b.rect);
          if (area >= MIN) {
            sampleOverlaps.push({ area: Math.round(area), a: a.text, b: b.text });
          }
        }
      }

      if (sampleOverlaps.length > 0) {
        result.push({ id: sample.id, overlaps: sampleOverlaps });
      }
    }
    return result;
  }, MIN_OVERLAP_AREA);

  writeFileSync(OUT_PATH, JSON.stringify(overlaps, null, 2));

  // Summary: which templates cause overlaps most often?
  const templateCounts = {};
  for (const s of overlaps) {
    const parts = s.id.match(/^sample-([a-z]+)-(.+)$/);
    if (!parts) continue;
    const tpl = parts[2];
    templateCounts[tpl] = (templateCounts[tpl] || 0) + 1;
  }
  const sorted = Object.entries(templateCounts).sort((a, b) => b[1] - a[1]);

  console.log(`\n${overlaps.length} samples with overlaps.`);
  console.log(`\nTemplates ranked by overlap frequency:`);
  for (const [tpl, n] of sorted) {
    console.log(`  ${n.toString().padStart(3)}  ${tpl}`);
  }
  console.log(`\nFull report: ${OUT_PATH}`);
} finally {
  await browser.close();
}
