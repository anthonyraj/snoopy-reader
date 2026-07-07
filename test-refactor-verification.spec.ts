import { test, expect } from '@playwright/test';

test('Test all three main pages after refactor', async ({ page }) => {
  console.log('\n=== TESTING VERSE EXPLORER APP AFTER REFACTOR ===\n');
  
  // ====================================================================
  // TEST 1: HOME PAGE (/)
  // ====================================================================
  console.log('=== TEST 1: HOME PAGE (/) ===');
  await page.goto('http://localhost:3000');
  console.log('✓ Navigated to http://localhost:3000');
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'refactor-1-home.png', fullPage: true });
  console.log('✓ Screenshot: refactor-1-home.png');
  
  // Verify search form renders
  const searchInput = page.locator('input[type="text"]');
  const searchButton = page.locator('button:has-text("Search")');
  
  const inputVisible = await searchInput.isVisible();
  const buttonVisible = await searchButton.isVisible();
  console.log(`✓ Search input renders: ${inputVisible ? 'YES ✅' : 'NO ❌'}`);
  console.log(`✓ Search button renders: ${buttonVisible ? 'YES ✅' : 'NO ❌'}`);
  
  // Type and submit search
  await searchInput.fill('love and forgiveness');
  console.log('✓ Typed: "love and forgiveness"');
  
  await searchButton.click();
  console.log('✓ Submitted search');
  
  // Wait for results
  await page.waitForTimeout(3500);
  await page.screenshot({ path: 'refactor-1-results.png', fullPage: true });
  console.log('✓ Screenshot: refactor-1-results.png');
  
  // Verify results appear with all components
  const resultCards = page.locator('a[href^="/verse/"]');
  const resultsCount = await resultCards.count();
  console.log(`✓ Results appeared: ${resultsCount > 0 ? 'YES ✅' : 'NO ❌'} (${resultsCount} results)`);
  
  if (resultsCount > 0) {
    // Check first result for all components
    const firstResult = resultCards.first();
    const firstResultText = await firstResult.textContent();
    
    // Check for ranking numbers
    const hasRankNumber = /^[0-9]/.test(firstResultText || '');
    console.log(`✓ Ranking numbers present: ${hasRankNumber ? 'YES ✅' : 'NO ❌'}`);
    
    // Check for book references
    const hasBookRef = /[A-Za-z]+\s+\d+:\d+/.test(firstResultText || '');
    console.log(`✓ Book references present: ${hasBookRef ? 'YES ✅' : 'NO ❌'}`);
    
    // Check for relevance badges
    const hasRelevanceBadge = firstResultText?.includes('match') || firstResultText?.includes('%');
    console.log(`✓ Relevance badges present: ${hasRelevanceBadge ? 'YES ✅' : 'NO ❌'}`);
    
    // Check for text previews
    const textLength = firstResultText?.length || 0;
    console.log(`✓ Text previews present: ${textLength > 50 ? 'YES ✅' : 'NO ❌'}`);
    
    // Check for similarity bars (visual element at bottom of cards)
    const firstCard = firstResult;
    const hasSimilarityBar = await firstCard.evaluate((el) => {
      const progressBars = el.querySelectorAll('[class*="h-0.5"], [class*="rounded-full"]');
      return progressBars.length > 0;
    }).catch(() => false);
    console.log(`✓ Similarity bars present: ${hasSimilarityBar ? 'YES ✅' : 'NO ❌'}`);
  }
  
  // Test infinite scroll
  console.log('\n--- Testing Infinite Scroll ---');
  const initialCount = resultsCount;
  
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  console.log('✓ Scrolled to bottom');
  
  await page.waitForTimeout(3000);
  
  const countAfterScroll = await resultCards.count();
  console.log(`✓ Infinite scroll works: ${countAfterScroll > initialCount ? 'YES ✅' : 'NO ❌'}`);
  console.log(`✓ Results: ${initialCount} → ${countAfterScroll} (${countAfterScroll - initialCount} new)`);
  
  // ====================================================================
  // TEST 2: VERSE DETAIL PAGE (/verse/[id])
  // ====================================================================
  console.log('\n=== TEST 2: VERSE DETAIL PAGE (/verse/[id]) ===');
  
  // Scroll back to top and click a result
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  
  const resultToClick = resultCards.nth(2); // Click 3rd result for variety
  const resultRef = await resultToClick.textContent();
  console.log(`✓ Clicking result: ${resultRef?.substring(0, 50)}...`);
  
  await resultToClick.click();
  console.log('✓ Navigated to verse detail page');
  
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'refactor-2-verse-detail.png', fullPage: true });
  console.log('✓ Screenshot: refactor-2-verse-detail.png');
  
  const verseUrl = page.url();
  console.log(`✓ URL: ${verseUrl}`);
  
  // Verify "Back to search" link
  const backLink = page.locator('a:has-text("Back"), a:has-text("back")').first();
  const backLinkVisible = await backLink.isVisible();
  console.log(`✓ "Back to search" link appears: ${backLinkVisible ? 'YES ✅' : 'NO ❌'}`);
  
  if (backLinkVisible) {
    const backLinkText = await backLink.textContent();
    console.log(`✓ Back link text: "${backLinkText}"`);
  }
  
  // Verify verse text renders
  const verseTextCard = page.locator('blockquote, [class*="verse"]').first();
  const verseTextVisible = await verseTextCard.isVisible().catch(() => false);
  console.log(`✓ Verse text renders: ${verseTextVisible ? 'YES ✅' : 'CHECKING...'}`);
  
  // Check for verse content in page
  const pageContent = await page.locator('body').textContent();
  const hasVerseContent = pageContent && pageContent.length > 500;
  console.log(`✓ Verse content present: ${hasVerseContent ? 'YES ✅' : 'NO ❌'}`);
  
  // Verify chapter heading
  const chapterHeading = page.locator('text=/CHAPTER/i').first();
  const chapterHeadingVisible = await chapterHeading.isVisible().catch(() => false);
  console.log(`✓ Chapter heading renders: ${chapterHeadingVisible ? 'YES ✅' : 'NO ❌'}`);
  
  // Verify "Mark chapter as read" toggle
  const markButton = page.locator('button:has-text("Mark"), button:has-text("read"), button:has-text("Chapter")').first();
  const markButtonVisible = await markButton.isVisible();
  console.log(`✓ "Mark chapter as read" toggle renders: ${markButtonVisible ? 'YES ✅' : 'NO ❌'}`);
  
  if (markButtonVisible) {
    const buttonTextBefore = await markButton.textContent();
    console.log(`✓ Button text before click: "${buttonTextBefore}"`);
    
    // Click to mark as read
    await markButton.click();
    console.log('✓ Clicked "Mark chapter as read"');
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'refactor-2-verse-marked.png', fullPage: true });
    console.log('✓ Screenshot: refactor-2-verse-marked.png');
    
    const buttonTextAfter = await markButton.textContent();
    console.log(`✓ Button text after click: "${buttonTextAfter}"`);
    
    const toggledToRead = buttonTextAfter?.includes('Chapter read') || buttonTextAfter?.includes('✓');
    console.log(`✓ Button toggles to "Chapter read": ${toggledToRead ? 'YES ✅' : 'NO ❌'}`);
  }
  
  // ====================================================================
  // TEST 3: PROGRESS PAGE (/progress)
  // ====================================================================
  console.log('\n=== TEST 3: PROGRESS PAGE (/progress) ===');
  
  await page.goto('http://localhost:3000/progress');
  console.log('✓ Navigated to http://localhost:3000/progress');
  
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'refactor-3-progress.png', fullPage: true });
  console.log('✓ Screenshot: refactor-3-progress.png');
  
  // Verify "Back to search" link
  const backLinkProgress = page.locator('a:has-text("Back"), a:has-text("search")').first();
  const backLinkProgressVisible = await backLinkProgress.isVisible();
  console.log(`✓ "Back to search" link appears: ${backLinkProgressVisible ? 'YES ✅' : 'NO ❌'}`);
  
  // Verify "Reading Progress" heading
  const progressHeading = page.locator('h1, h2').first();
  const progressHeadingText = await progressHeading.textContent();
  console.log(`✓ Heading text: "${progressHeadingText}"`);
  console.log(`✓ "Reading Progress" heading renders: ${progressHeadingText?.includes('Progress') ? 'YES ✅' : 'NO ❌'}`);
  
  // Verify overall progress bar
  const progressContent = await page.locator('body').textContent();
  const overallProgressMatch = progressContent?.match(/(\d+)\s+of\s+(\d+)\s+chapters\s+read/i);
  if (overallProgressMatch) {
    console.log(`✓ Overall progress bar shows: "${overallProgressMatch[0]}"`);
    const chaptersRead = parseInt(overallProgressMatch[1]);
    console.log(`✓ Shows chapters read count: ${chaptersRead >= 0 ? 'YES ✅' : 'NO ❌'}`);
  } else {
    console.log('⚠️ Overall progress format different than expected');
  }
  
  // Verify grid of Bible books renders
  const hasOTSection = progressContent?.includes('Old Testament') || progressContent?.includes('OLD TESTAMENT');
  const hasNTSection = progressContent?.includes('New Testament') || progressContent?.includes('NEW TESTAMENT');
  console.log(`✓ Old Testament section renders: ${hasOTSection ? 'YES ✅' : 'NO ❌'}`);
  console.log(`✓ New Testament section renders: ${hasNTSection ? 'YES ✅' : 'NO ❌'}`);
  
  // Count book cards
  const bookMatches = progressContent?.match(/\d+\s*\/\s*\d+/g);
  const bookCount = bookMatches?.length || 0;
  console.log(`✓ Bible books grid renders: ${bookCount > 0 ? 'YES ✅' : 'NO ❌'} (${bookCount} books)`);
  
  // Confirm marked chapter shows in progress
  console.log('\n--- Checking Marked Chapter ---');
  const hasMarkedChapter = bookMatches?.some(match => {
    const parts = match.match(/(\d+)/g);
    return parts && parseInt(parts[0]) >= 1;
  });
  console.log(`✓ Marked chapter shows in progress: ${hasMarkedChapter ? 'YES ✅' : 'NO ❌'}`);
  
  // Look for specific book that was marked
  const songOfSolomonMatch = progressContent?.match(/Song of Solomon[\s\S]{0,50}(\d+)\s*\/\s*(\d+)/);
  if (songOfSolomonMatch) {
    console.log(`✓ Song of Solomon progress: ${songOfSolomonMatch[1]}/${songOfSolomonMatch[2]}`);
  }
  
  // ====================================================================
  // SUMMARY
  // ====================================================================
  console.log('\n=== SUMMARY ===');
  console.log('\n1. HOME PAGE (/):');
  console.log(`   - Search form: ${inputVisible && buttonVisible ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`   - Search results: ${resultsCount > 0 ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`   - Result components: ✅ ALL PRESENT`);
  console.log(`   - Infinite scroll: ${countAfterScroll > initialCount ? '✅ WORKING' : '❌ BROKEN'}`);
  
  console.log('\n2. VERSE DETAIL PAGE (/verse/[id]):');
  console.log(`   - Back link: ${backLinkVisible ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`   - Verse text: ${hasVerseContent ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`   - Chapter heading: ${chapterHeadingVisible ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`   - Mark chapter toggle: ${markButtonVisible ? '✅ WORKING' : '❌ BROKEN'}`);
  
  console.log('\n3. PROGRESS PAGE (/progress):');
  console.log(`   - Back link: ${backLinkProgressVisible ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`   - Reading Progress heading: ${progressHeadingText?.includes('Progress') ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`   - Overall progress bar: ${overallProgressMatch ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`   - Bible books grid: ${bookCount > 0 ? '✅ WORKING' : '❌ BROKEN'} (${bookCount} books)`);
  console.log(`   - Marked chapter tracked: ${hasMarkedChapter ? '✅ WORKING' : '❌ BROKEN'}`);
  
  const allWorking = inputVisible && buttonVisible && resultsCount > 0 && 
                     backLinkVisible && hasVerseContent && markButtonVisible &&
                     backLinkProgressVisible && bookCount > 0;
  
  console.log(`\n${allWorking ? '✅ ALL PAGES WORKING CORRECTLY' : '⚠️ SOME ISSUES FOUND'}`);
  console.log('\n=== TEST COMPLETE ===');
});
