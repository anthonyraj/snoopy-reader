import { test, expect } from '@playwright/test';

test('Test infinite scroll feature', async ({ page }) => {
  console.log('\n=== TESTING INFINITE SCROLL FEATURE ===\n');
  
  // Test 1: Initial search loads first page
  console.log('=== TEST 1: INITIAL SEARCH LOADS FIRST PAGE ===');
  await page.goto('http://localhost:3000');
  console.log('✓ Navigated to http://localhost:3000');
  
  const searchInput = page.locator('input[type="text"]');
  await searchInput.fill('love');
  console.log('✓ Typed "love" in search input');
  
  const searchButton = page.locator('button:has-text("Search")');
  await searchButton.click();
  console.log('✓ Clicked Search button');
  
  // Wait for results to load
  await page.waitForTimeout(3500);
  await page.screenshot({ path: 'test-scroll-1-initial.png', fullPage: true });
  console.log('✓ Screenshot saved: test-scroll-1-initial.png');
  
  // Count initial results
  const resultCards = page.locator('a[href^="/verse/"]');
  const initialCount = await resultCards.count();
  console.log(`✓ Number of results loaded: ${initialCount}`);
  
  // Check for count label
  const bodyText = await page.locator('body').textContent();
  const countMatch = bodyText?.match(/(\d+)\s+results?|Showing\s+(\d+)/i);
  if (countMatch) {
    const countText = bodyText?.match(/(Showing\s+\d+\s+results?|\d+\s+results?)/i)?.[0];
    console.log(`✓ Count label text: "${countText}"`);
  } else {
    console.log('✓ Count label: Not found or different format');
  }
  
  // Get first few result titles for comparison
  const firstResults = [];
  for (let i = 0; i < Math.min(3, initialCount); i++) {
    const text = await resultCards.nth(i).textContent();
    firstResults.push(text?.substring(0, 50));
  }
  console.log(`✓ First 3 results: ${JSON.stringify(firstResults)}`);
  
  // Test 2: Scroll to trigger infinite scroll
  console.log('\n=== TEST 2: SCROLL TO TRIGGER INFINITE SCROLL ===');
  
  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  console.log('✓ Scrolled to bottom of page');
  
  // Check for loading indicator
  await page.waitForTimeout(500);
  const loadingIndicator = await page.locator('text=/loading|Loading/i').isVisible().catch(() => false);
  console.log(`✓ Loading indicator visible: ${loadingIndicator}`);
  
  // Wait for new results to load
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-scroll-2-after-first-scroll.png', fullPage: true });
  console.log('✓ Screenshot saved: test-scroll-2-after-first-scroll.png');
  
  // Count results after first scroll
  const countAfterScroll1 = await resultCards.count();
  console.log(`✓ Number of results after scroll: ${countAfterScroll1}`);
  console.log(`✓ New results loaded: ${countAfterScroll1 > initialCount ? 'YES ✅' : 'NO ❌'}`);
  console.log(`✓ Results appended (not replaced): ${countAfterScroll1 > initialCount ? 'YES ✅' : 'NO ❌'}`);
  
  if (countAfterScroll1 > initialCount) {
    console.log(`✓ Number of new results: ${countAfterScroll1 - initialCount}`);
  }
  
  // Check updated count label
  const bodyText2 = await page.locator('body').textContent();
  const countMatch2 = bodyText2?.match(/(Showing\s+\d+\s+results?|\d+\s+results?)/i)?.[0];
  console.log(`✓ Count label after scroll: "${countMatch2}"`);
  
  // Verify first results are still there (not replaced)
  const firstResultAfterScroll = await resultCards.first().textContent();
  const firstResultMatches = firstResultAfterScroll?.substring(0, 50) === firstResults[0];
  console.log(`✓ First result unchanged: ${firstResultMatches ? 'YES ✅' : 'NO ❌'}`);
  
  // Test 3: Keep scrolling for a third page
  console.log('\n=== TEST 3: KEEP SCROLLING FOR THIRD PAGE ===');
  
  // Scroll to bottom again
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  console.log('✓ Scrolled to bottom again');
  
  // Wait for more results
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-scroll-3-after-second-scroll.png', fullPage: true });
  console.log('✓ Screenshot saved: test-scroll-3-after-second-scroll.png');
  
  // Count results after second scroll
  const countAfterScroll2 = await resultCards.count();
  console.log(`✓ Number of results after second scroll: ${countAfterScroll2}`);
  console.log(`✓ More results loaded: ${countAfterScroll2 > countAfterScroll1 ? 'YES ✅' : 'NO ❌'}`);
  
  if (countAfterScroll2 > countAfterScroll1) {
    console.log(`✓ Number of new results: ${countAfterScroll2 - countAfterScroll1}`);
    console.log(`✓ Total results loaded across 3 pages: ${countAfterScroll2}`);
  }
  
  // Check final count label
  const bodyText3 = await page.locator('body').textContent();
  const countMatch3 = bodyText3?.match(/(Showing\s+\d+\s+results?|\d+\s+results?)/i)?.[0];
  console.log(`✓ Count label after second scroll: "${countMatch3}"`);
  
  // Test 4: Navigate to verse and back
  console.log('\n=== TEST 4: NAVIGATE TO VERSE AND BACK ===');
  
  // Scroll back to top to click first result
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  
  // Click first result
  console.log('✓ Clicking first result...');
  await resultCards.first().click();
  
  // Wait for verse detail page
  await page.waitForTimeout(2000);
  const verseUrl = page.url();
  console.log(`✓ Navigated to: ${verseUrl}`);
  console.log(`✓ On verse detail page: ${verseUrl.includes('/verse/') ? 'YES ✅' : 'NO ❌'}`);
  
  // Click back
  const backLink = page.locator('a:has-text("Back"), a:has-text("back")').first();
  await backLink.click();
  console.log('✓ Clicked "Back to search"');
  
  // Wait for page to load
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'test-scroll-4-after-back.png', fullPage: true });
  console.log('✓ Screenshot saved: test-scroll-4-after-back.png');
  
  // Check if all results are still there
  const countAfterBack = await resultCards.count();
  console.log(`✓ Number of results after back: ${countAfterBack}`);
  console.log(`✓ All results preserved: ${countAfterBack === countAfterScroll2 ? 'YES ✅' : 'NO ❌'}`);
  
  if (countAfterBack !== countAfterScroll2) {
    console.log(`⚠️ WARNING: Expected ${countAfterScroll2} results, got ${countAfterBack}`);
    console.log(`⚠️ Lost ${countAfterScroll2 - countAfterBack} results after navigation`);
  }
  
  // Check count label after back
  const bodyText4 = await page.locator('body').textContent();
  const countMatch4 = bodyText4?.match(/(Showing\s+\d+\s+results?|\d+\s+results?)/i)?.[0];
  console.log(`✓ Count label after back: "${countMatch4}"`);
  
  // Verify first result is still the same
  const firstResultAfterBack = await resultCards.first().textContent();
  const firstResultStillMatches = firstResultAfterBack?.substring(0, 50) === firstResults[0];
  console.log(`✓ First result still unchanged: ${firstResultStillMatches ? 'YES ✅' : 'NO ❌'}`);
  
  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`1. Initial results loaded: ${initialCount}`);
  console.log(`2. After first scroll: ${countAfterScroll1} (${countAfterScroll1 > initialCount ? '✅ APPENDED' : '❌ NOT APPENDED'})`);
  console.log(`3. After second scroll: ${countAfterScroll2} (${countAfterScroll2 > countAfterScroll1 ? '✅ APPENDED' : '❌ NOT APPENDED'})`);
  console.log(`4. After back navigation: ${countAfterBack} (${countAfterBack === countAfterScroll2 ? '✅ PRESERVED' : '❌ NOT PRESERVED'})`);
  
  console.log('\n=== KEY FINDINGS ===');
  console.log(`1. Infinite scroll triggers automatically: ${countAfterScroll1 > initialCount ? '✅ YES' : '❌ NO'}`);
  console.log(`2. Results are appended (not replaced): ${countAfterScroll1 > initialCount && firstResultMatches ? '✅ YES' : '❌ NO'}`);
  console.log(`3. Result count updates correctly: ${countMatch3 ? '✅ YES' : '❌ NO'}`);
  console.log(`4. All results preserved when navigating back: ${countAfterBack === countAfterScroll2 ? '✅ YES' : '❌ NO'}`);
  
  console.log('\n=== TEST COMPLETE ===');
});
