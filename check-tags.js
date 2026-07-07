const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newContext().then(c => c.newPage());
  
  await page.goto('http://localhost:3000/progress', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Get all text content
  const bodyText = await page.textContent('body');
  
  // Check for specific tags
  const tags = ['Keep Going', 'Try This', 'Explore', 'Complete'];
  console.log('Checking for recommendation tags:\n');
  
  for (const tag of tags) {
    const found = bodyText.includes(tag);
    console.log(`  ${found ? '✓' : '✗'} "${tag}": ${found ? 'Found' : 'Not found'}`);
  }
  
  // Check for badge/tag elements
  console.log('\nLooking for badge/tag elements...');
  const badges = await page.$$('[class*="badge"], [class*="tag"], span[class*="bg-"]');
  console.log(`  Found ${badges.length} badge-like elements`);
  
  if (badges.length > 0) {
    console.log('\n  Sample badge texts:');
    for (let i = 0; i < Math.min(5, badges.length); i++) {
      const text = await badges[i].textContent();
      if (text.trim()) {
        console.log(`    - "${text.trim()}"`);
      }
    }
  }
  
  // Look for the "Explore" tag specifically
  const exploreElements = await page.$$('*:has-text("Explore")');
  console.log(`\n  Elements containing "Explore": ${exploreElements.length}`);
  
  await browser.close();
})();
