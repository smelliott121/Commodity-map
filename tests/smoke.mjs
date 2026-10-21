// Site check: opens the map at phone and desktop sizes, exercises the main panels,
// and fails if the page throws any JavaScript error. Run by .github/workflows/site-check.yml
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";

const PORT = 8123, ROOT = process.argv[2] || "site";
const srv = spawn("python3", ["-m", "http.server", String(PORT), "-d", ROOT], { stdio: "ignore" });
await new Promise(r => setTimeout(r, 1200));
mkdirSync("shots", { recursive: true });
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const problems = [];
const steps = [
  ["brief", "openBrief()"],
  ["risk", "openRisk()"],
  ["markets", "MKTAB='px';mkOpen(true)"],
  ["cocoa", "mkOpen(false);show(R.findIndex(r=>r.n=='Cocoa'))"],
  ["hormuz", "showChoke(MK.find(m=>m.n=='Strait of Hormuz'))"],
  ["uk", "showUK()"],
  ["refining", "showRef()"],
  ["news", "openNews('all')"],
  ["search", "openCmd()"],
];
for (const [name, vp, mobile] of [["phone", { width: 412, height: 860 }, true], ["desktop", { width: 1600, height: 900 }, false]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, serviceWorkers: "block" });
  const page = await ctx.newPage();
  page.on("pageerror", e => problems.push(`${name}: ${e.message}`));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(`http://localhost:${PORT}/index.html`);
  await page.waitForTimeout(7000);
  await page.screenshot({ path: `shots/${name}-map.png` });
  for (const [s, js] of steps) {
    try { await page.evaluate(js) } catch (e) { problems.push(`${name} ${s}: ${e.message}`) }
    await page.waitForTimeout(900);
    await page.screenshot({ path: `shots/${name}-${s}.png` });
    await page.keyboard.press("Escape");
  }
  const pins = await page.locator(".pin").count();
  if (pins < 15) problems.push(`${name}: only ${pins} commodity pins on the map`);
  await ctx.close();
}
await browser.close();
srv.kill();
if (problems.length) { console.error("Site check found problems:\n" + problems.join("\n")); process.exit(1) }
console.log("Site check passed: no page errors at phone or desktop size.");
