// Minimal WebDriver BiDi driver for headless Firefox: navigate, wait, eval, element screenshots, console errors.
// usage: node scripts/qa/bidi.mjs <url> <outPrefix> [--dark] [--click <selector>] [--eval <js>] [selector ...]   (serve out/ first: npm run preview)
// Prints rendered Mermaid SVG sizes (or ERROR), takes a viewport screenshot per selector after scrolling to it, and lists console errors.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); if (i < 0) return undefined; const v = argv[i + 1]; argv.splice(i, 2); return v; };
const dark = argv.includes('--dark') && (argv.splice(argv.indexOf('--dark'), 1), true);
const click = flag('--click');
const evalExpr = flag('--eval');
const [url, out, ...selectors] = argv;
const port = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(process.env.TMPDIR ?? tmpdir(), 'ffp-'));
const ff = spawn('firefox', ['--headless', '--no-remote', '--profile', profile, '--remote-debugging-port', String(port), '--window-size', '1400,1000'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws;
for (let i = 0; i < 50; i++) {
  try {
    ws = new WebSocket(`ws://127.0.0.1:${port}/session`);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    break;
  } catch { await sleep(300); }
}
let id = 0;
const pending = new Map();
const logs = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  else if (msg.method === 'log.entryAdded') logs.push(`${msg.params.level}: ${msg.params.text}`);
};
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id; pending.set(i, (m) => (m.type === 'error' ? rej(new Error(`${method}: ${m.message ?? m.error}`)) : res(m.result)));
  ws.send(JSON.stringify({ id: i, method, params }));
});

try {
  await send('session.new', { capabilities: {} });
  await send('session.subscribe', { events: ['log.entryAdded'] });
  const { contexts } = await send('browsingContext.getTree', {});
  const context = contexts[0].context;
  const evalJs = async (expr) => (await send('script.evaluate', { expression: expr, target: { context }, awaitPromise: true })).result;
  await send('browsingContext.navigate', { context, url, wait: 'complete' });
  if (dark) {
    // next-themes stores the light/dark choice under `theme`.
    await evalJs(`localStorage.setItem('theme', 'dark')`);
    await send('browsingContext.navigate', { context, url, wait: 'complete' });
  }
  await sleep(4000);
  if (click) {
    // Real pointer input (Headless UI ignores synthetic .click() for menus).
    const r = await evalJs(`(() => { const e = document.querySelector(${JSON.stringify(click)}); if (!e) return null; e.scrollIntoView({block:'center'}); const b = e.getBoundingClientRect(); return JSON.stringify([Math.round(b.x + b.width / 2), Math.round(b.y + b.height / 2)]) })()`);
    if (r.type === 'null') console.log('click target not found:', click);
    else {
      const [x, y] = JSON.parse(r.value);
      await send('input.performActions', { context, actions: [{ type: 'pointer', id: 'mouse', actions: [{ type: 'pointerMove', x, y }, { type: 'pointerDown', button: 0 }, { type: 'pointerUp', button: 0 }] }] });
      await sleep(800);
    }
  }
  if (evalExpr) console.log('eval:', JSON.stringify((await evalJs(evalExpr)).value));
  const info = await evalJs(`JSON.stringify([...document.querySelectorAll('.fd-mermaid')].map(e => /Syntax error|Parse error/i.test(e.textContent) ? 'ERROR' : e.innerHTML.length))`);
  console.log('mermaid svg lengths:', info.value);
  if (!selectors.length) {
    const { data } = await send('browsingContext.captureScreenshot', { context });
    writeFileSync(`${out}.png`, Buffer.from(data, 'base64'));
    console.log('shot', `${out}.png`);
  }
  for (const [i, sel] of selectors.entries()) {
    const node = await evalJs(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; e.scrollIntoView({block:'start'}); return true })()`);
    if (node.type === 'null') { console.log('not found:', sel); continue; }
    await sleep(500);
    const { data } = await send('browsingContext.captureScreenshot', { context });
    writeFileSync(`${out}-${i}.png`, Buffer.from(data, 'base64'));
    console.log('shot', `${out}-${i}.png`, sel);
  }
  console.log('console:', logs.filter((l) => !l.startsWith('debug')).slice(0, 15).join('\n') || 'clean');
} catch (e) {
  console.error(e.message);
} finally {
  ws?.close();
  ff.kill();
  // Each run uses a throwaway Firefox profile (~10 MB+); remove it once Firefox has exited.
  await new Promise((r) => (ff.exitCode !== null ? r() : ff.once('exit', r)));
  rmSync(profile, { recursive: true, force: true });
}
