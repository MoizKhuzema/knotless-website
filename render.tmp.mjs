import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const jobs = JSON.parse(process.argv[2]);
for (const [file, out, size] of jobs) {
  const p = await b.newPage({ viewport: { width: size, height: size } });
  await p.goto('file://' + file); await p.waitForTimeout(100);
  await p.screenshot({ path: out, omitBackground: true }); await p.close();
}
await b.close();
