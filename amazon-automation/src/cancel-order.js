#!/usr/bin/env node

const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const path = require('path');
const fs = require('fs');
const { getAmazonCreds } = require('./config');

chromium.use(stealth);

const USER_DATA_DIR = path.join(__dirname, '..', '.browser-data-stealth');

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
}

async function run() {
  const args = process.argv.slice(2);
  const orderId = args[0];

  if (!orderId) {
    console.error('Usage: node cancel-order.js <order-id>');
    process.exit(1);
  }

  console.log(`📋 Cancelling order #${orderId}...`);

  const creds = await getAmazonCreds();
  const browser = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled', '--disable-dev-shm-usage'],
    viewport: { width: 1366, height: 768 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
  });

  const page = browser.pages()[0] || await browser.newPage();

  // Go to orders page
  console.log('1. Going to orders...');
  await page.goto('https://www.amazon.com/gp/your-account/order-history', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(3000, 4000);

  // Check if logged in
  const signInBtn = await page.$('[data-feature-id="sw-atc-buy-box"] a') || await page.$('a[href*="signin"]');
  if (signInBtn && await signInBtn.isVisible().catch(() => false)) {
    console.log('2. Logging in...');
    await doLogin(page, creds);
    await delay(5000, 7000);
  }

  // Find the order
  console.log(`2. Looking for order #${orderId}...`);
  const orderLink = await page.$(`a[href*="${orderId}"]`);
  
  if (!orderLink) {
    console.log(`❌ Order #${orderId} not found`);
    await browser.close();
    return;
  }

  await orderLink.click();
  await delay(3000, 4000);

  // Find cancel button
  console.log('3. Looking for cancel option...');
  const cancelBtn = await page.$('text=Cancel Items') || 
                    await page.$('text=Cancel Order') ||
                    await page.$('button:has-text("Cancel")');

  if (!cancelBtn) {
    console.log('❌ Cancel button not found (order may already be shipped/cancelled)');
    const bodyText = await page.textContent('body');
    if (bodyText.includes('Cancelled') || bodyText.includes('Shipped')) {
      console.log('   Status:', bodyText.match(/Cancelled|Shipped|Out for delivery|Delivered/)?.[0]);
    }
    await browser.close();
    return;
  }

  console.log('4. Clicking cancel...');
  await cancelBtn.click();
  await delay(2000, 3000);

  // Confirm cancellation
  const confirmBtn = await page.$('button:has-text("Cancel Items")') ||
                     await page.$('button:has-text("Yes, cancel")') ||
                     await page.$('input[type="submit"][value*="Cancel"]');

  if (confirmBtn) {
    console.log('5. Confirming cancellation...');
    await confirmBtn.click();
    await delay(3000, 4000);
  }

  // Check result
  const successText = await page.textContent('body');
  if (successText.includes('cancelled') || successText.includes('Cancellation request')) {
    console.log('✅ Order cancelled successfully');
  } else {
    console.log('⚠️  Cancellation submitted (check email for confirmation)');
  }

  await browser.close();
}

run();
