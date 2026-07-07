import { test, expect } from '@playwright/test';

test('Test updated search results UI features', async ({ page }) => {
  console.log('\n=== TESTING UPDATED SEARCH RESULTS UI ===\n');
  
  // 1. Navigate to home page
  await page.goto('http://localhost:3000');
  console.log('✓ Navigated to http://localhost:3000');
  
  // 2. Type search query and click Search
  const searchInput = page.locator('input[type="text"]');
  await searchInput.fill('courage in hard times');
  console.log('✓ Typed: "courage in hard times"');
  
  const searchButton = page.locator('button:has-text("Search")');
  await searchButton.click();
  console.log('✓ Clicked Search button');
  
  // 3. Wait for results to load
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-updated-ui-results.png', fullPage: true });
  console.log('✓ Screenshot saved: test-updated-ui-results.png\n');
  
  // 4. Check the 5 specific features
  
  // Feature 1: Ranking numbers
  console.log('=== FEATURE 1: RANKING NUMBERS ===');
  const rankNumbers = page.locator('[class*="rank"], [class*="number"], .result-card span:first-child, article > div:first-child');
  const rankCount = await rankNumbers.count();
  console.log(`Found ${rankCount} potential rank number elements`);
  
  if (rankCount > 0) {
    const firstRankText = await rankNumbers.first().textContent();
    console.log(`First rank element text: "${firstRankText}"`);
    
    // Check if it's a number
    const hasNumbers = /[0-9]/.test(firstRankText || '');
    console.log(`Contains numbers: ${hasNumbers}`);
  }
  
  // Check for specific rank number patterns
  const rank1 = await page.locator('text=/^1$|^1\\s|rank.*1/i').first().isVisible().catch(() => false);
  const rank2 = await page.locator('text=/^2$|^2\\s|rank.*2/i').first().isVisible().catch(() => false);
  console.log(`Visible rank "1": ${rank1}`);
  console.log(`Visible rank "2": ${rank2}`);
  
  // Feature 2: Text truncation
  console.log('\n=== FEATURE 2: TEXT TRUNCATION ===');
  const verseTexts = page.locator('article p, .verse-text, [class*="verse"]');
  const verseCount = await verseTexts.count();
  console.log(`Found ${verseCount} verse text elements`);
  
  if (verseCount > 0) {
    const firstVerseText = await verseTexts.first().textContent();
    console.log(`First verse text length: ${firstVerseText?.length} characters`);
    console.log(`First verse preview: "${firstVerseText?.substring(0, 100)}..."`);
    
    // Check for ellipsis
    const hasEllipsis = firstVerseText?.includes('...') || firstVerseText?.includes('…');
    console.log(`Has ellipsis: ${hasEllipsis}`);
    
    // Check CSS for line-clamp
    const firstVerseElement = verseTexts.first();
    const styles = await firstVerseElement.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        webkitLineClamp: computed.webkitLineClamp,
        overflow: computed.overflow,
        textOverflow: computed.textOverflow,
        display: computed.display,
      };
    }).catch(() => null);
    console.log(`CSS styles:`, styles);
  }
  
  // Feature 3: Similarity bar
  console.log('\n=== FEATURE 3: SIMILARITY BAR ===');
  const similarityBars = page.locator('[class*="progress"], [class*="similarity"], [class*="bar"], [role="progressbar"]');
  const barCount = await similarityBars.count();
  console.log(`Found ${barCount} potential progress/similarity bar elements`);
  
  if (barCount > 0) {
    const firstBar = similarityBars.first();
    const barStyles = await firstBar.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        height: computed.height,
        width: computed.width,
        backgroundColor: computed.backgroundColor,
        position: computed.position,
      };
    }).catch(() => null);
    console.log(`First bar styles:`, barStyles);
  }
  
  // Check for thin bars at bottom of cards
  const bottomBars = page.locator('article > div:last-child, .result-card > div:last-child');
  const bottomBarCount = await bottomBars.count();
  console.log(`Found ${bottomBarCount} bottom elements in result cards`);
  
  // Feature 4: Focus ring
  console.log('\n=== FEATURE 4: FOCUS RING ===');
  const resultCards = page.locator('article, .result-card, a[href^="/verse/"]');
  const cardCount = await resultCards.count();
  console.log(`Found ${cardCount} result cards/links`);
  
  if (cardCount > 0) {
    // Tab to first result
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Usually need a few tabs to get to results
    
    await page.screenshot({ path: 'test-updated-ui-focus.png', fullPage: true });
    console.log('✓ Screenshot with focus: test-updated-ui-focus.png');
    
    // Check if any element has focus
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        className: el?.className,
        href: (el as HTMLAnchorElement)?.href,
        hasOutline: window.getComputedStyle(el!).outline !== 'none',
        outlineStyle: window.getComputedStyle(el!).outline,
        boxShadow: window.getComputedStyle(el!).boxShadow,
      };
    });
    console.log('Focused element:', focusedElement);
  }
  
  // Feature 5: Loading skeletons
  console.log('\n=== FEATURE 5: LOADING SKELETONS ===');
  console.log('Note: Cannot test loading state after results have loaded.');
  console.log('To test: Need to observe during the initial 3-second loading period.');
  console.log('Expected: ~8 skeleton cards with staggered animation');
  
  // Let's do a second search to catch the loading state
  console.log('\nPerforming second search to capture loading state...');
  await page.goto('http://localhost:3000');
  await searchInput.fill('love');
  
  // Take screenshot immediately after clicking
  const [response] = await Promise.all([
    page.waitForResponse(response => response.url().includes('/api/search')),
    searchButton.click(),
  ]);
  
  // Capture loading state
  await page.waitForTimeout(100); // Small delay to see skeletons
  await page.screenshot({ path: 'test-updated-ui-loading.png', fullPage: true });
  console.log('✓ Screenshot of loading state: test-updated-ui-loading.png');
  
  const skeletons = page.locator('[class*="skeleton"], [class*="loading"], [class*="animate"]');
  const skeletonCount = await skeletons.count();
  console.log(`Found ${skeletonCount} skeleton/loading elements during load`);
  
  // Wait for results
  await page.waitForTimeout(3000);
  console.log('\n=== TEST COMPLETE ===');
});
