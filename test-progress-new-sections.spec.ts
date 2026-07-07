import { test, expect } from '@playwright/test';

test('Test progress page with Top Books and Reading Highlights', async ({ page }) => {
  console.log('\n=== TESTING PROGRESS PAGE WITH NEW SECTIONS ===\n');
  
  // Step 1: Navigate to home and search
  console.log('=== STEP 1: SEARCH FOR "LOVE" ===');
  await page.goto('http://localhost:3000');
  console.log('✓ Navigated to home page');
  
  const searchInput = page.locator('input[type="text"]');
  await searchInput.fill('love');
  console.log('✓ Typed "love"');
  
  const searchButton = page.locator('button:has-text("Search")');
  await searchButton.click();
  console.log('✓ Clicked Search');
  
  await page.waitForTimeout(3500);
  console.log('✓ Search results loaded');
  
  // Step 2-3: Click first result and mark chapter
  console.log('\n=== STEP 2-3: MARK FIRST CHAPTER ===');
  const resultCards = page.locator('a[href^="/verse/"]');
  const firstResultText = await resultCards.first().textContent();
  console.log(`✓ First result: ${firstResultText?.substring(0, 50)}...`);
  
  await resultCards.first().click();
  console.log('✓ Clicked first result');
  
  await page.waitForTimeout(1500);
  
  const markButton1 = page.locator('button:has-text("Mark"), button:has-text("read")').first();
  const buttonText1Before = await markButton1.textContent();
  console.log(`✓ Button state: "${buttonText1Before}"`);
  
  if (buttonText1Before?.includes('Mark')) {
    await markButton1.click();
    console.log('✓ Marked first chapter as read');
    await page.waitForTimeout(1000);
  } else {
    console.log('✓ Chapter already marked');
  }
  
  // Step 4: Go back, click different result, mark it
  console.log('\n=== STEP 4: MARK SECOND CHAPTER FROM DIFFERENT BOOK ===');
  await page.goBack();
  console.log('✓ Went back to search results');
  await page.waitForTimeout(1000);
  
  // Try to find a result from a different book
  let differentBookIndex = -1;
  const firstBookMatch = firstResultText?.match(/([A-Za-z\s]+)\s+\d+:\d+/);
  const firstBook = firstBookMatch?.[1]?.trim();
  console.log(`✓ First book was: ${firstBook}`);
  
  for (let i = 1; i < Math.min(10, await resultCards.count()); i++) {
    const resultText = await resultCards.nth(i).textContent();
    const bookMatch = resultText?.match(/([A-Za-z\s]+)\s+\d+:\d+/);
    const book = bookMatch?.[1]?.trim();
    
    if (book && book !== firstBook) {
      differentBookIndex = i;
      console.log(`✓ Found different book at index ${i}: ${book}`);
      break;
    }
  }
  
  if (differentBookIndex > 0) {
    await resultCards.nth(differentBookIndex).click();
    console.log('✓ Clicked result from different book');
    
    await page.waitForTimeout(1500);
    
    const markButton2 = page.locator('button:has-text("Mark"), button:has-text("read")').first();
    const buttonText2Before = await markButton2.textContent();
    
    if (buttonText2Before?.includes('Mark')) {
      await markButton2.click();
      console.log('✓ Marked second chapter as read');
      await page.waitForTimeout(1000);
    } else {
      console.log('✓ Chapter already marked');
    }
  } else {
    console.log('⚠️ Could not find a different book, marking another chapter from same book');
    await resultCards.nth(1).click();
    await page.waitForTimeout(1500);
    const markButton2 = page.locator('button:has-text("Mark"), button:has-text("read")').first();
    await markButton2.click();
    await page.waitForTimeout(1000);
  }
  
  // Step 5: Navigate to progress page
  console.log('\n=== STEP 5: NAVIGATE TO PROGRESS PAGE ===');
  await page.goto('http://localhost:3000/progress');
  console.log('✓ Navigated to /progress');
  
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'progress-new-sections-full.png', fullPage: true });
  console.log('✓ Screenshot: progress-new-sections-full.png');
  
  // Step 6: Verify all sections
  console.log('\n=== STEP 6: VERIFY NEW SECTIONS ===');
  
  const pageContent = await page.locator('body').textContent();
  
  // 6.1: Overall progress bar
  console.log('\n--- Overall Progress Bar ---');
  const progressMatch = pageContent?.match(/(\d+)\s+of\s+(\d+)\s+chapters\s+read/i);
  if (progressMatch) {
    const chaptersRead = parseInt(progressMatch[1]);
    console.log(`✓ Overall progress: ${progressMatch[0]}`);
    console.log(`✓ Chapters read: ${chaptersRead >= 2 ? '✅ YES (2+)' : '⚠️ LESS THAN 2'}`);
  } else {
    console.log('⚠️ Overall progress format not found');
  }
  
  // 6.2: Top Books section
  console.log('\n--- Top Books Section ---');
  const hasTopBooks = pageContent?.includes('Top Books') || pageContent?.includes('top books');
  console.log(`✓ "Top Books" section present: ${hasTopBooks ? 'YES ✅' : 'NO ❌'}`);
  
  if (hasTopBooks) {
    // Check if it's a horizontal scrollable row
    const topBooksContainer = page.locator('text=Top Books').locator('..').locator('..');
    const hasOverflowScroll = await topBooksContainer.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.overflowX === 'auto' || computed.overflowX === 'scroll';
    }).catch(() => false);
    console.log(`✓ Horizontal scrollable layout: ${hasOverflowScroll ? 'YES ✅' : 'NO ❌'}`);
    
    // Count top book cards
    const topBookCards = page.locator('[class*="top-book"], [class*="book-card"]').first();
    console.log(`✓ Top book cards visible: checking...`);
  }
  
  // 6.3: Highlights section
  console.log('\n--- Highlights Section ---');
  const hasHighlights = pageContent?.includes('Highlights') || pageContent?.includes('highlights');
  console.log(`✓ "Highlights" section present: ${hasHighlights ? 'YES ✅' : 'NO ❌'}`);
  
  if (hasHighlights) {
    // Check for specific highlight cards
    const hasMostReadBook = pageContent?.includes('Most Read') || pageContent?.includes('most read');
    const hasOTStats = pageContent?.includes('Old Testament');
    const hasNTStats = pageContent?.includes('New Testament');
    
    console.log(`✓ "Most Read Book" card: ${hasMostReadBook ? 'YES ✅' : 'NO ❌'}`);
    console.log(`✓ "Old Testament" stats card: ${hasOTStats ? 'YES ✅' : 'NO ❌'}`);
    console.log(`✓ "New Testament" stats card: ${hasNTStats ? 'YES ✅' : 'NO ❌'}`);
  }
  
  // 6.4: OT/NT book grid still renders
  console.log('\n--- Book Grid (OT/NT) ---');
  const hasOTGrid = pageContent?.includes('OLD TESTAMENT');
  const hasNTGrid = pageContent?.includes('NEW TESTAMENT');
  console.log(`✓ Old Testament grid section: ${hasOTGrid ? 'YES ✅' : 'NO ❌'}`);
  console.log(`✓ New Testament grid section: ${hasNTGrid ? 'YES ✅' : 'NO ❌'}`);
  
  // Count book cards
  const bookMatches = pageContent?.match(/\d+\s*\/\s*\d+/g);
  const bookCount = bookMatches?.length || 0;
  console.log(`✓ Total book cards: ${bookCount} (expected: 66)`);
  
  // Visual inspection
  console.log('\n=== VISUAL INSPECTION ===');
  
  // Take screenshots of specific sections
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'progress-top-section.png', fullPage: false });
  console.log('✓ Screenshot: progress-top-section.png (top of page)');
  
  // Scroll to see more
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'progress-middle-section.png', fullPage: false });
  console.log('✓ Screenshot: progress-middle-section.png (middle)');
  
  // Check page structure
  console.log('\n--- Page Structure ---');
  const headings = await page.locator('h1, h2, h3').allTextContents();
  console.log('✓ Page headings found:');
  headings.forEach((h, i) => console.log(`  ${i + 1}. "${h}"`));
  
  // Check for grid vs flex layouts
  const sections = await page.locator('section, div[class*="section"]').count();
  console.log(`✓ Major sections detected: ${sections}`);
  
  // Summary
  console.log('\n=== SUMMARY ===');
  const allSectionsPresent = hasTopBooks && hasHighlights && hasOTGrid && hasNTGrid;
  console.log(`\n${allSectionsPresent ? '✅ ALL SECTIONS RENDERED' : '⚠️ SOME SECTIONS MISSING'}`);
  
  console.log('\nRendered sections:');
  console.log(`  - Overall progress bar: ${progressMatch ? '✅' : '❌'}`);
  console.log(`  - Top Books section: ${hasTopBooks ? '✅' : '❌'}`);
  console.log(`  - Highlights section: ${hasHighlights ? '✅' : '❌'}`);
  console.log(`  - OT/NT book grid: ${hasOTGrid && hasNTGrid ? '✅' : '❌'}`);
  
  console.log('\n=== TEST COMPLETE ===');
});
