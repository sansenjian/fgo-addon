// Plan B：无头浏览器登录 kejifuwu 获取 JWT
// 适用场景：上游改版加密/接口导致服务端（server/upstream）密码登录失效时兜底。
//
// 用法：
//   npm install
//   KEJIFUWU_USERNAME=sansan2 KEJIFUWU_PASSWORD='xxx' CHROME_PATH=/usr/bin/chromium node login.js
//
// 输出：{"token":"eyJ..."} —— 将其设为服务端环境变量 KEJIFUWU_TOKEN 即可（静态 token 模式）
const puppeteer = require('puppeteer-core');

const BASE = process.env.KEJIFUWU_BASE_URL || 'https://kejifuwu.windycloud.cn';
const USER = process.env.KEJIFUWU_USERNAME;
const PASS = process.env.KEJIFUWU_PASSWORD;
const CHROME = process.env.CHROME_PATH || '/usr/bin/chromium';

if (!USER || !PASS) {
  console.error('缺少环境变量 KEJIFUWU_USERNAME / KEJIFUWU_PASSWORD');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('PAGE-EXC:', String(e).slice(0, 200)));

  await page.goto(BASE + '/login', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(3000);

  // Vuetify 的 placeholder 是浮动标签，input 上无 placeholder 属性，按 type 定位
  const filled = await page.evaluate(([u, p]) => {
    const inputs = [...document.querySelectorAll('input')];
    const ui = inputs.find((i) => i.type === 'text');
    const pi = inputs.find((i) => i.type === 'password');
    if (!ui || !pi) return false;
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    set.call(ui, u);
    ui.dispatchEvent(new Event('input', { bubbles: true }));
    set.call(pi, p);
    pi.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }, [USER, PASS]);

  if (!filled) {
    console.error('未找到登录表单（页面结构可能已改版）');
    await page.screenshot({ path: 'debug-login.png' });
    await browser.close();
    process.exit(1);
  }

  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === '登录');
    if (b) b.click();
  });

  // 登录成功后 Apollo 会把 JWT 写入 localStorage，轮询直到拿到
  let token = null;
  for (let i = 0; i < 30 && !token; i++) {
    await sleep(1000);
    token = await page.evaluate(() => {
      for (let k = 0; k < localStorage.length; k++) {
        const v = localStorage.getItem(localStorage.key(k)) || '';
        const m = v.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
        if (m) return m[0];
      }
      return null;
    });
  }

  if (!token) {
    console.error('登录后未获取到 JWT，已保存 debug-login.png');
    await page.screenshot({ path: 'debug-login.png' });
  } else {
    console.log(JSON.stringify({ token }));
  }
  await browser.close();
  process.exit(token ? 0 : 1);
})().catch((e) => {
  console.error('FAIL:', e.message);
  process.exit(1);
});
