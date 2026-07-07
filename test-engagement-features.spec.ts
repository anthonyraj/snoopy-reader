import { test, expect } from '@playwright/test';

test('Test progress page with all engagement features', async ({ page }) => {
  console.log('\n=== TESTING PROGRESS PAGE WITH ENGAGEMENT FEATURES ===\n');
  
  // ====================================================================
  // STEP 1: CREATE TEST DATA BY MARKING CHAPTERS
  // ====================================================================
  console.log('=== STEP 1: CREATING TEST DATA ===\n');
  
  // 1.1: Search for "creation" and mark a chapter
  console.log('--- Test 1.1: Search "creation" ---');
  await page.goto('http://localhost:3000');
  console.log('✓ Navigated to home page');
  
  let searchInput = page.locator('input[type="text"]');
  await searchInput.fill('creation');
  console.log('✓ Typed "creation"');
  
  let searchButton = page.locator('button:has-text("Search")');
  await searchButton.click();
  console.log('✓ Clicked Search');
  
  await page.waitForTimeout(3500);
  
  let resultCards = page.locator('a[href^="/verse/"]');
  let firstResult = await resultCards.first().textContent();
  console.log(`✓ First result: ${firstResult?.substring(0, 50)}...`);
  
  await resultCards.first().click();
  console.log('✓ Clicked first result');
  
  await page.waitForTimeout(1500);
  
  let markButton = page.locator('button:has-text("Mark"), button:has-text("read")').first();
  let buttonText = await markButton.textContent();
  
  if (buttonText?.includes('Mark')) {
    await markButton.click();
    console.log('✓ Marked chapter as read');
    await page.waitForTimeout(1000);
  } else {
    console.log('✓ Chapter already marked');
  }
  
  // 1.2: Search for "love" and mark a different book's chapter
  console.log('\n--- Test 1.2: Search "love" ---');
  await page.locator('a:has-text("Back")').first().click();
  console.log('✓ Clicked "Back to search"');
  await page.waitForTimeout(1000);
  
  searchInput = page.locator('input[type="text"]');
  await searchInput.fill('love');
  searchButton = page.locator('button:has-text("Search")');
  await searchButton.click();
  console.log('✓ Searched for "love"');
  
  await page.waitForTimeout(3500);
  
  resultCards = page.locator('a[href^="/verse/"]');
  let secondResult = await resultCards.nth(1).textContent();
  console.log(`✓ Second result: ${secondResult?.substring(0, 50)}...`);
  
  await resultCards.nth(1).click();
  await page.waitForTimeout(1500);
  
  markButton = page.locator('button:has-text("Mark"), button:has-text("read")').first();
  buttonText = await markButton.textContent();
  
  if (buttonText?.includes('Mark')) {
    await markButton.click();
    console.log('✓ Marked chapter as read');
    await page.waitForTimeout(1000);
  }
  
  // 1.3: Search for "wisdom" and mark another different book's chapter
  console.log('\n--- Test 1.3: Search "wisdom" ---');
  await page.locator('a:has-text("Back")').first().click();
  await page.waitForTimeout(1000);
  
  searchInput = page.locator('input[type="text"]');
  await searchInput.fill('wisdom');
  searchButton = page.locator('button:has-text("Search")');
  await searchButton.click();
  console.log('✓ Searched for "wisdom"');
  
  await page.waitForTimeout(3500);
  
  resultCards = page.locator('a[href^="/verse/"]');
  let thirdResult = await resultCards.nth(2).textContent();
  console.log(`✓ Third result: ${thirdResult?.substring(0, 50)}...`);
  
  await resultCards.nth(2).click();
  await page.waitForTimeout(1500);
  
  markButton = page.locator('button:has-text("Mark"), button:has-text("read")').first();
  buttonText = await markButton.textContent();
  
  if (buttonText?.includes('Mark')) {
    await markButton.click();
    console.log('✓ Marked chapter as read');
    await page.waitForTimeout(1000);
  }
  
  console.log('\n✅ Test data created: 3 chapters marked\n');
  
  // ====================================================================
  // STEP 2: NAVIGATE TO PROGRESS PAGE AND VERIFY SECTIONS
  // ====================================================================
  console.log('=== STEP 2: VERIFYING PROGRESS PAGE SECTIONS ===\n');
  
  await page.goto('http://localhost:3000/progress');
  console.log('✓ Navigated to /progress');
  
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'engagement-full-page.png', fullPage: true });
  console.log('✓ Screenshot: engagement-full-page.png\n');
  
  const pageContent = await page.locator('body').textContent();
  
  // Get all headings
  const headings = await page.locator('h1, h2, h3').allTextContents();
  console.log('--- All Page Headings ---');
  headings.forEach((h, i) => console.log(`  ${i + 1}. "${h}"`));
  console.log();
  
  // 2.1: Reading Progress heading + overall bar
  console.log('--- Section 1: Reading Progress ---');
  const hasReadingProgress = pageContent?.includes('Reading Progress');
  console.log(`✓ "Reading Progress" heading: ${hasReadingProgress ? 'YES ✅' : 'NO ❌'}`);
  
  const progressMatch = pageContent?.match(/(\d+)\s+of\s+(\d+)\s+chapters\s+read/i);
  if (progressMatch) {
    const chaptersRead = parseInt(progressMatch[1]);
    console.log(`✓ Overall bar: "${progressMatch[0]}"`);
    console.log(`✓ Shows 3+ chapters: ${chaptersRead >= 3 ? 'YES ✅' : `NO ❌ (${chaptersRead})`}`);
  } else {
    console.log('⚠️ Overall progress format not found');
  }
  
  // 2.2: Books Completed section
  console.log('\n--- Section 2: Books Completed ---');
  const hasBooksCompleted = pageContent?.includes('Books Completed') || pageContent?.includes('BOOKS COMPLETED');
  console.log(`✓ "Books Completed" section: ${hasBooksCompleted ? 'YES ✅' : 'NO (expected with only 3 chapters) ✅'}`);
  
  // 2.3: Continue Reading section
  console.log('\n--- Section 3: Continue Reading ---');
  const hasContinueReading = pageContent?.includes('Continue Reading') || pageContent?.includes('CONTINUE READING');
  console.log(`✓ "Continue Reading" section: ${hasContinueReading ? 'YES ✅' : 'NO ❌'}`);
  
  if (hasContinueReading) {
    const hasChapterBadge = pageContent?.includes('Chapter');
    console.log(`✓ Shows "Chapter N" badges: ${hasChapterBadge ? 'YES ✅' : 'NO ❌'}`);
  }
  
  // 2.4: Almost There section
  console.log('\n--- Section 4: Almost There ---');
  const hasAlmostThere = pageContent?.includes('Almost There') || pageContent?.includes('ALMOST THERE');
  console.log(`✓ "Almost There" section: ${hasAlmostThere ? 'YES ✅' : 'NO ❌'}`);
  
  if (hasAlmostThere) {
    const hasToGo = pageContent?.includes('to go') || pageContent?.includes('chapters to go');
    console.log(`✓ Shows "X chapters to go!": ${hasToGo ? 'YES ✅' : 'NO ❌'}`);
  }
  
  // 2.5: Top Books section
  console.log('\n--- Section 5: Top Books ---');
  const hasTopBooks = pageContent?.includes('Top Books') || pageContent?.includes('TOP BOOKS');
  console.log(`✓ "Top Books" section: ${hasTopBooks ? 'YES ✅' : 'NO ❌'}`);
  
  // 2.6: Highlights section
  console.log('\n--- Section 6: Highlights ---');
  const hasHighlights = pageContent?.includes('Highlights') || pageContent?.includes('HIGHLIGHTS');
  console.log(`✓ "Highlights" section: ${hasHighlights ? 'YES ✅' : 'NO ❌'}`);
  
  if (hasHighlights) {
    const hasMostRead = pageContent?.includes('Most Read') || pageContent?.includes('MOST READ');
    const hasOT = pageContent?.includes('Old Testament') || pageContent?.includes('OLD TESTAMENT');
    const hasNT = pageContent?.includes('New Testament') || pageContent?.includes('NEW TESTAMENT');
    
    console.log(`✓ "Most Read Book" card: ${hasMostRead ? 'YES ✅' : 'NO ❌'}`);
    console.log(`✓ "Old Testament" stats: ${hasOT ? 'YES ✅' : 'NO ❌'}`);
    console.log(`✓ "New Testament" stats: ${hasNT ? 'YES ✅' : 'NO ❌'}`);
  }
  
  // 2.7: By Category section
  console.log('\n--- Section 7: By Category ---');
  const hasByCategory = pageContent?.includes('By Category') || pageContent?.includes('BY CATEGORY');
  console.log(`✓ "By Category" section: ${hasByCategory ? 'YES ✅' : 'NO ❌'}`);
  
  if (hasByCategory) {
    const categories = ['Law', 'History', 'Poetry', 'Prophets', 'Gospels', 'Letters', 'Revelation'];
    console.log('✓ Category cards:');
    categories.forEach(cat => {
      const hasCat = pageContent?.includes(cat);
      console.log(`  - ${cat}: ${hasCat ? 'YES ✅' : 'NO ❌'}`);
    });
  }
  
  // 2.8: OT/NT book grids
  console.log('\n--- Section 8: Book Grids ---');
  const hasOTGrid = pageContent?.includes('OLD TESTAMENT');
  const hasNTGrid = pageContent?.includes('NEW TESTAMENT');
  console.log(`✓ "Old Testament" grid: ${hasOTGrid ? 'YES ✅' : 'NO ❌'}`);
  console.log(`✓ "New Testament" grid: ${hasNTGrid ? 'YES ✅' : 'NO ❌'}`);
  
  // Take sectional screenshots
  console.log('\n--- Taking Sectional Screenshots ---');
  
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'engagement-top.png', fullPage: false });
  console.log('✓ Screenshot: engagement-top.png');
  
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'engagement-middle-1.png', fullPage: false });
  console.log('✓ Screenshot: engagement-middle-1.png');
  
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'engagement-middle-2.png', fullPage: false });
  console.log('✓ Screenshot: engagement-middle-2.png');
  
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'engagement-bottom.png', fullPage: false });
  console.log('✓ Screenshot: engagement-bottom.png');
  
  // Summary
  console.log('\n=== SUMMARY ===\n');
  
  const sections = [
    { name: 'Reading Progress', present: hasReadingProgress },
    { name: 'Books Completed', present: hasBooksCompleted, optional: true },
    { name: 'Continue Reading', present: hasContinueReading },
    { name: 'Almost There', present: hasAlmostThere },
    { name: 'Top Books', present: hasTopBooks },
    { name: 'Highlights', present: hasHighlights },
    { name: 'By Category', present: hasByCategory },
    { name: 'OT Grid', present: hasOTGrid },
    { name: 'NT Grid', present: hasNTGrid },
  ];
  
  console.log('Section Status:');
  sections.forEach(s => {
    if (s.optional) {
      console.log(`  - ${s.name}: ${s.present ? '✅ PRESENT' : '✅ NOT PRESENT (optional)'}`);
    } else {
      console.log(`  - ${s.name}: ${s.present ? '✅ PRESENT' : '❌ MISSING'}`);
    }
  });
  
  const requiredSections = sections.filter(s => !s.optional);
  const allPresent = requiredSections.every(s => s.present);
  
  console.log(`\n${allPresent ? '✅ ALL REQUIRED SECTIONS PRESENT' : '⚠️ SOME SECTIONS MISSING'}`);
  console.log('\n=== TEST COMPLETE ===');
});
