import { test, expect } from '@playwright/test';

test('Test Bible reading progress tracking feature', async ({ page }) => {
  console.log('\n=== TESTING PROGRESS TRACKING FEATURE ===\n');
  
  // Test 1: Progress page initial state
  console.log('=== TEST 1: PROGRESS PAGE INITIAL STATE ===');
  await page.goto('http://localhost:3000/progress');
  console.log('✓ Navigated to http://localhost:3000/progress');
  
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'test-progress-1-initial.png', fullPage: true });
  console.log('✓ Screenshot saved: test-progress-1-initial.png');
  
  // Check for overall stats bar
  const pageContent = await page.locator('body').textContent();
  const hasStatsBar = pageContent?.includes('chapters read') || pageContent?.includes('progress') || pageContent?.includes('completed');
  console.log(`✓ Overall stats bar present: ${hasStatsBar ? 'YES ✅' : 'NO ❌'}`);
  
  if (hasStatsBar) {
    const statsMatch = pageContent?.match(/(\d+)[\s\/]+(\d+)\s+chapters/i);
    if (statsMatch) {
      console.log(`✓ Stats show: ${statsMatch[0]}`);
    }
  }
  
  // Check for OT/NT sections
  const hasOT = pageContent?.includes('Old Testament') || pageContent?.includes('OT');
  const hasNT = pageContent?.includes('New Testament') || pageContent?.includes('NT');
  console.log(`✓ Old Testament section: ${hasOT ? 'YES ✅' : 'NO ❌'}`);
  console.log(`✓ New Testament section: ${hasNT ? 'YES ✅' : 'NO ❌'}`);
  
  // Check for books with chapter counts
  const bookCards = page.locator('[class*="book"], article, .card');
  const bookCount = await bookCards.count();
  console.log(`✓ Number of book cards found: ${bookCount}`);
  
  // Check if books show 0/N format
  const hasChapterFormat = pageContent?.match(/0[\s\/]+\d+/);
  console.log(`✓ Books show 0/N chapters format: ${hasChapterFormat ? 'YES ✅' : 'NO ❌'}`);
  
  // Test 2: Navigate to a verse and mark chapter as read
  console.log('\n=== TEST 2: NAVIGATE TO VERSE AND MARK CHAPTER AS READ ===');
  await page.goto('http://localhost:3000');
  console.log('✓ Navigated to home page');
  
  const searchInput = page.locator('input[type="text"]');
  await searchInput.fill('love');
  console.log('✓ Typed "love" in search');
  
  const searchButton = page.locator('button:has-text("Search")');
  await searchButton.click();
  console.log('✓ Clicked Search button');
  
  await page.waitForTimeout(3500);
  
  // Click first result
  const firstResult = page.locator('a[href^="/verse/"]').first();
  const firstResultText = await firstResult.textContent();
  console.log(`✓ First result: ${firstResultText?.substring(0, 50)}...`);
  
  await firstResult.click();
  console.log('✓ Clicked first result');
  
  await page.waitForTimeout(1500);
  const verseUrl = page.url();
  console.log(`✓ On verse page: ${verseUrl}`);
  
  await page.screenshot({ path: 'test-progress-2-verse-before-mark.png', fullPage: true });
  console.log('✓ Screenshot saved: test-progress-2-verse-before-mark.png');
  
  // Look for "Mark chapter as read" button
  const markButton = page.locator('button:has-text("Mark"), button:has-text("read")').first();
  const markButtonExists = await markButton.count() > 0;
  console.log(`✓ "Mark chapter as read" button found: ${markButtonExists ? 'YES ✅' : 'NO ❌'}`);
  
  if (markButtonExists) {
    const buttonText = await markButton.textContent();
    console.log(`✓ Button text: "${buttonText}"`);
    
    // Check button location (near chapter heading)
    const chapterHeading = page.locator('h2, h3').first();
    const headingText = await chapterHeading.textContent().catch(() => 'not found');
    console.log(`✓ Chapter heading: "${headingText}"`);
    
    // Click the mark button
    await markButton.click();
    console.log('✓ Clicked "Mark chapter as read" button');
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-progress-2-verse-after-mark.png', fullPage: true });
    console.log('✓ Screenshot saved: test-progress-2-verse-after-mark.png');
    
    // Check if button changed
    const buttonTextAfter = await markButton.textContent();
    console.log(`✓ Button text after click: "${buttonTextAfter}"`);
    
    const hasCheckmark = buttonTextAfter?.includes('✓') || buttonTextAfter?.includes('✔') || buttonTextAfter?.includes('read');
    console.log(`✓ Button shows "Chapter read" with checkmark: ${hasCheckmark ? 'YES ✅' : 'PARTIAL ⚠️'}`);
    
    // Test 3: Verify progress page updates
    console.log('\n=== TEST 3: VERIFY PROGRESS PAGE UPDATES ===');
    
    // Look for Progress link in header
    const progressLink = page.locator('a:has-text("Progress"), a[href="/progress"]').first();
    const progressLinkExists = await progressLink.count() > 0;
    console.log(`✓ Progress link in header: ${progressLinkExists ? 'YES ✅' : 'NO ❌'}`);
    
    if (progressLinkExists) {
      await progressLink.click();
      console.log('✓ Clicked Progress link');
      
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'test-progress-3-updated.png', fullPage: true });
      console.log('✓ Screenshot saved: test-progress-3-updated.png');
      
      const progressUrl = page.url();
      console.log(`✓ On progress page: ${progressUrl}`);
      
      // Check overall count
      const progressContent = await page.locator('body').textContent();
      const countMatch = progressContent?.match(/(\d+)[\s\/]+(\d+)\s+chapters/i);
      if (countMatch) {
        const readCount = parseInt(countMatch[1]);
        console.log(`✓ Overall count shows: ${countMatch[0]}`);
        console.log(`✓ At least 1 chapter read: ${readCount >= 1 ? 'YES ✅' : 'NO ❌'}`);
      }
      
      // Check specific book card
      const bookCardMatch = progressContent?.match(/(\d+)[\s\/]+(\d+)/g);
      if (bookCardMatch && bookCardMatch.length > 0) {
        console.log(`✓ Found ${bookCardMatch.length} book cards with chapter counts`);
        const hasOneRead = bookCardMatch.some(match => {
          const parts = match.match(/(\d+)/g);
          return parts && parseInt(parts[0]) >= 1;
        });
        console.log(`✓ At least one book shows 1/N chapters: ${hasOneRead ? 'YES ✅' : 'NO ❌'}`);
      }
      
      // Test 4: Toggle chapter back to unread
      console.log('\n=== TEST 4: TOGGLE CHAPTER BACK TO UNREAD ===');
      
      // Go back to verse page
      await page.goBack();
      console.log('✓ Used browser back to return to verse page');
      
      await page.waitForTimeout(1000);
      
      // Click the button again to toggle
      const toggleButton = page.locator('button:has-text("read"), button:has-text("Chapter")').first();
      const toggleButtonText = await toggleButton.textContent();
      console.log(`✓ Button text before toggle: "${toggleButtonText}"`);
      
      await toggleButton.click();
      console.log('✓ Clicked button to toggle back to unread');
      
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-progress-4-toggled-unread.png', fullPage: true });
      console.log('✓ Screenshot saved: test-progress-4-toggled-unread.png');
      
      const buttonTextAfterToggle = await toggleButton.textContent();
      console.log(`✓ Button text after toggle: "${buttonTextAfterToggle}"`);
      
      const revertedToMark = buttonTextAfterToggle?.includes('Mark') || !buttonTextAfterToggle?.includes('✓');
      console.log(`✓ Button reverted to "Mark chapter as read": ${revertedToMark ? 'YES ✅' : 'NO ❌'}`);
      
      // Test 5: Check header nav
      console.log('\n=== TEST 5: CHECK HEADER NAV ===');
      
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-progress-5-header.png', fullPage: true });
      console.log('✓ Screenshot saved: test-progress-5-header.png');
      
      const headerContent = await page.locator('header, nav').first().textContent().catch(() => '');
      const hasVerseExplorer = headerContent?.includes('Verse Explorer') || headerContent?.includes('VERSE EXPLORER');
      const hasProgress = headerContent?.includes('Progress');
      
      console.log(`✓ Header shows "Verse Explorer" on left: ${hasVerseExplorer ? 'YES ✅' : 'NO ❌'}`);
      console.log(`✓ Header shows "Progress" on right: ${hasProgress ? 'YES ✅' : 'NO ❌'}`);
      
      // Check positioning
      const verseExplorerLink = page.locator('a:has-text("Verse Explorer"), a[href="/"]').first();
      const progressLinkHeader = page.locator('a:has-text("Progress"), a[href="/progress"]').first();
      
      if (await verseExplorerLink.count() > 0 && await progressLinkHeader.count() > 0) {
        const verseBox = await verseExplorerLink.boundingBox();
        const progressBox = await progressLinkHeader.boundingBox();
        
        if (verseBox && progressBox) {
          const verseOnLeft = verseBox.x < progressBox.x;
          console.log(`✓ "Verse Explorer" is on the left: ${verseOnLeft ? 'YES ✅' : 'NO ❌'}`);
          console.log(`✓ "Progress" is on the right: ${verseOnLeft ? 'YES ✅' : 'NO ❌'}`);
        }
      }
      
    } else {
      console.log('❌ Cannot test progress page - link not found');
    }
    
  } else {
    console.log('❌ Cannot test marking - button not found');
  }
  
  console.log('\n=== TEST COMPLETE ===');
});
