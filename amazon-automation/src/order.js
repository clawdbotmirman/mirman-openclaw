#!/usr/bin/env node

/**
 * Smart ordering script for Amazon
 * Usage: node order.js <product> [priority: price|speed]
 * 
 * Examples:
 *   node order.js water              # Order Mountain Valley Water
 *   node order.js "coffee beans"     # Search for coffee and pick best option
 *   node order.js water speed        # Order water, prioritizing fast delivery
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PRODUCTS_FILE = path.join(__dirname, '..', 'products.json');
let products = {};

try {
  products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
} catch (e) {
  console.error('❌ Could not load products.json');
  process.exit(1);
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const args = process.argv.slice(2);
  let productQuery = args[0];
  const priority = args[1] || 'price';

  if (!productQuery) {
    console.error('Usage: node order.js <product> [price|speed]');
    console.error('\nAvailable products:', Object.keys(products).join(', '));
    process.exit(1);
  }

  // Check if product exists in registry
  let searchQuery;
  let resultIndex = 0;
  
  if (products[productQuery.toLowerCase()]) {
    const product = products[productQuery.toLowerCase()];
    searchQuery = product.searchQuery;
    resultIndex = product.resultIndex || 0;
    console.log(`📦 Ordering: ${product.name}`);
    console.log(`   Search: "${searchQuery}"`);
  } else {
    // Unknown product - search for it directly
    searchQuery = productQuery;
    console.log(`🔍 Unknown product "${productQuery}" - searching...`);
  }

  // Run buy-item script
  console.log('\n🛒 Starting order process...\n');
  
  const buyScript = spawn('node', [
    path.join(__dirname, 'buy-item.js'),
    searchQuery,
    resultIndex.toString()
  ]);

  buyScript.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  buyScript.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  buyScript.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Order placed!');
    } else {
      console.log('\n❌ Order failed');
      process.exit(1);
    }
  });
}

run();
