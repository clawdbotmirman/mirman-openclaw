#!/usr/bin/env node

const playwright = require('playwright');

(async () => {
  let browser;
  try {
    console.log('🚀 Starting Playwright browser...');
    browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    const page = await context.newPage();

    console.log('📍 Navigating to Skiplagged...');
    await page.goto('https://skiplagged.com/flights/EWR', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Try to find and interact with the search form
    const title = await page.title();
    console.log(`✓ Page loaded: "${title}"`);

    // Get the page content for debugging
    const html = await page.content();
    if (html.includes('flight')) {
      console.log('✓ Flight content detected');
    }

    // Extract visible prices and flight info
    const flights = await page.evaluate(() => {
      const results = [];
      const text = document.body.innerText;
      
      // Look for price patterns
      const priceMatches = text.match(/\$[\d,]+/g) || [];
      
      return {
        foundPrices: priceMatches.slice(0, 10),
        pageText: text.substring(0, 500)
      };
    });

    console.log('\n📊 Results found:');
    console.log('Prices:', flights.foundPrices);
    
    if (flights.foundPrices.length === 0) {
      console.log('⚠️  No prices found on page. Skiplagged may require JavaScript interaction or be blocking the request.');
      console.log('\n💡 Recommendation: Visit https://skiplagged.com/flights/EWR manually and search for:');
      console.log('  - Origin: EWR (Newark)');
      console.log('  - Look for flights to: MAD, ROM, MIL, PRG, BUD (cities beyond Barcelona)');
      console.log('  - Filter for deals cheaper than direct EWR->BCN ($1500)');
      console.log('  - Book to the onward city but get off at Barcelona');
    }

    await browser.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (browser) await browser.close();
    process.exit(1);
  }
})();
