// Render /samples/render page and screenshot each sample-{creator}-{template} div
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
  await page.setViewport({ width: 2400, height: 2400, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 120000 });

  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('[id^="sample-"] img, [id^="slide-"] img'));
    await Promise.all(
      imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; }))
    );
  });

  const ids = await page.$$eval('[id^="sample-"]', els => els.map(e => e.id));
  console.log(`Found ${ids.length} sample divs`);

  for (const id of ids) {
    const el = await page.$(`#${id}`);
    if (!el) { console.warn(`Missing: ${id}`); continue; }
    const buf = await el.screenshot({ type: 'jpeg', quality: 85, omitBackground: false });
    const path = join(OUT_DIR, `${id}.jpg`);
    writeFileSync(path, buf);
    process.stdout.write(`.`);
  }
  console.log(`\n✓ ${ids.length} samples rendered`);
} finally {
  await browser.close();
}
