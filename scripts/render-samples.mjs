// Render /samples/render page and screenshot each slide-N-M div to public/samples/slide-N-M.jpg
import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { join } from 'path';

const URL = 'http://localhost:3000/samples/render';
const OUT_DIR = join(process.cwd(), 'public', 'samples');

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 2400, height: 2400, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for all <img> in slides to load
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('[id^="slide-"] img'));
    await Promise.all(
      imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; }))
    );
  });

  // Find all slide divs
  const ids = await page.$$eval('[id^="slide-"]', els => els.map(e => e.id));
  console.log(`Found ${ids.length} slide divs: ${ids.join(', ')}`);

  for (const id of ids) {
    const el = await page.$(`#${id}`);
    if (!el) { console.warn(`Missing: ${id}`); continue; }
    const buf = await el.screenshot({ type: 'jpeg', quality: 90, omitBackground: false });
    const path = join(OUT_DIR, `${id}.jpg`);
    writeFileSync(path, buf);
    console.log(`✓ ${id}.jpg (${buf.length} bytes)`);
  }
} finally {
  await browser.close();
}
