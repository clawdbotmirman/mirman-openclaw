const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const path = require('path');
const fs = require('fs');
const { getAmazonCreds } = require('./config');

chromium.use(stealth);

const USER_DATA_DIR = path.join(__dirname, '..', '.browser-data-stealth');
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

function ss(page, name) {
  return page.screenshot({ path: path.join(SCREENSHOTS_DIR, `buy-${name}.png`), fullPage: true });
}
function delay(min, max) {
  return new Promise(r => setTimeout(r, min + Math.random() * (max - min)));
}

async function doLogin(page, creds) {
  const allInputs = await page.$$('input');
  for (const inp of allInputs) {
    const type = await inp.getAttribute('type');
    const visible = await inp.isVisible().catch(() => false);
    if (visible && (type === 'text' || type === 'email')) {
      await inp.type(creds.email, { delay: 55 });
      break;
    }
  }
  const btns = await page.$$('input[type="submit"], button[type="submit"]');
  for (const btn of btns) {
    if (await btn.isVisible().catch(() => false)) { await btn.click(); break; }
  }
  await delay(3000, 4000);
  const pwField = await page.$('#ap_password');
  if (pwField) {
    await pwField.type(creds.password, { delay: 50 });
    const signIn = await page.$('#signInSubmit');
    if (signIn) await signIn.click();
    await delay(5000, 7000);
  }
  if (page.url().includes('accountfixup')) {
    const skip = await page.$('text=Not now');
    if (skip) { await skip.click(); await delay(3000, 4000); }
  }
}

async function run() {
  const args = process.argv.slice(2);
  const searchQuery = args[0] || 'Mountain Valley Water 33.8oz 12-pack';
  const resultIndex = parseInt(args[1]) || 0;

  if (!searchQuery) {
    console.error('Usage: node buy-item.js "search query" [result index]');
    process.exit(1);
  }

  const creds = await getAmazonCreds();
  const browser = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled', '--disable-dev-shm-usage'],
    viewport: { width: 1366, height: 768 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.139 Safari/537.36',
  });

  const page = browser.pages()[0] || await browser.newPage();

  // Search
  console.log(`1. Searching for: "${searchQuery}"`);
  const encodedQuery = encodeURIComponent(searchQuery);
  await page.goto(`https://www.amazon.com/s?k=${encodedQuery}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(3000, 4000);

  // Click result
  const results = await page.$$('[data-component-type="s-search-result"]');
  if (results.length <= resultIndex) { 
    console.log(`Not enough results (wanted #${resultIndex}, found ${results.length})`); 
    await browser.close(); 
    return; 
  }
  
  const title = await results[resultIndex].$eval('h2', el => el.textContent?.trim()).catch(() => '');
  console.log(`2. Clicking result #${resultIndex}:`, title);
  
  const link = await results[resultIndex].$('a.a-link-normal');
  if (link) {
    const href = await link.getAttribute('href');
    await page.goto('https://www.amazon.com' + href, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } else {
    const h2 = await results[resultIndex].$('h2');
    if (h2) await h2.click();
  }
  await delay(3000, 4000);
  await ss(page, '01-product');

  const productTitle = await page.$eval('#productTitle', el => el.textContent?.trim()).catch(() => 'unknown');
  const price = await page.$eval('.a-price .a-offscreen', el => el.textContent?.trim()).catch(() => 'unknown');
  console.log(`   Product: ${productTitle}`);
  console.log(`   Price: ${price}`);

  // Add to cart
  console.log('3. Adding to cart...');
  const addBtn = await page.$('#add-to-cart-button');
  if (addBtn) {
    await addBtn.click();
    await delay(3000, 4000);
  } else {
    console.log('   No add to cart button');
    await ss(page, '02-no-button');
    await browser.close();
    return;
  }

  // Go to cart
  console.log('4. Cart...');
  await page.goto('https://www.amazon.com/gp/cart/view.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(2000, 3000);
  const subtotal = await page.$eval('#sc-subtotal-amount-activecart .sc-price', el => el.textContent?.trim()).catch(() => 'unknown');
  console.log('   Subtotal:', subtotal);

  // Checkout
  console.log('5. Checkout...');
  const checkoutBtn = await page.$('#sc-buy-box-ptc-button input');
  if (checkoutBtn) {
    await checkoutBtn.click();
    await delay(5000, 7000);
  }

  // Login if needed
  let url = page.url();
  if (url.includes('signin') || url.includes('claim')) {
    console.log('   Logging in...');
    await doLogin(page, creds);
  }

  // Skip Prime
  if (page.url().includes('pip')) {
    const noThanks = await page.$('text=No thanks');
    if (noThanks) { await noThanks.click(); await delay(5000, 7000); }
  }

  // Checkout page
  url = page.url();
  console.log('6. Checkout:', url);
  await ss(page, '02-checkout');

  const bodyText = await page.textContent('body');
  const allText = bodyText.replace(/\s+/g, ' ');
  const totalMatch = allText.match(/Order total:\s*\$([\d.]+)/);
  if (totalMatch) console.log('   Order total: $' + totalMatch[1]);

  // Delivery estimate
  const deliveryMatch = allText.match(/Arriving\s+\w+,?\s+\w+\s+\d+/i) || allText.match(/(arriving|delivery).{0,60}/i);
  if (deliveryMatch) console.log('   📦', deliveryMatch[0].trim());

  // Place order
  const placeOrderBtn = await page.$('input[name="placeYourOrder1"]') || await page.$('#submitOrderButtonId input');
  if (placeOrderBtn) {
    console.log('7. *** PLACING ORDER ***');
    await placeOrderBtn.click();
    await delay(8000, 12000);
    await ss(page, '03-placed');
    console.log('   URL:', page.url());

    // Check order history
    await page.goto('https://www.amazon.com/gp/css/order-history', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await delay(3000, 4000);
    await ss(page, '04-orders');
  } else {
    console.log('7. No place order button found');
    await ss(page, '03-no-place');
  }

  await browser.close();
}

run().catch(err => { console.error('Fatal:', err); process.exit(1); });
