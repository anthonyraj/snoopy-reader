const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Starting Smart Recommendations UI Test...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1024 }
  });
  const page = await context.newPage();
  
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  
  try {
    console.log('1. Navigating to http://localhost:3000/progress...');
    await page.goto('http://localhost:3000/progress', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for any client-side rendering
    console.log('   ✓ Progress page loaded\n');
    
    // Take full page screenshot
    await page.screenshot({ path: path.join(screenshotsDir, '13-smart-recommendations.png'), fullPage: true });
    console.log('   ✓ Screenshot saved: screenshots/13-smart-recommendations.png\n');
    
    // Check for Activity tab
    console.log('2. Checking for Activity tab...');
    const pageText = await page.textContent('body');
    
    // Look for tabs
    const tabs = await page.$$('[role="tab"], button:has-text("Activity"), button:has-text("Books"), button:has-text("Stats")');
    console.log(`   Found ${tabs.length} tab-like elements`);
    
    // Check if Activity tab exists and is active
    const activityTabActive = pageText.includes('Activity') || pageText.includes('ACTIVITY');
    console.log(`   - Activity tab present: ${activityTabActive ? '✓ Yes' : '✗ No'}`);
    
    // Check for active state indicators
    const hasActiveIndicator = await page.$('[aria-selected="true"], .active, [class*="active"]');
    if (hasActiveIndicator) {
      const activeText = await hasActiveIndicator.textContent();
      console.log(`   - Active tab: "${activeText.trim()}"`);
    }
    console.log('');
    
    // Check for Smart Recommendations sections
    console.log('3. Checking for Smart Recommendations UI...');
    
    // Check for "Where to start" (new users)
    const hasWhereToStart = pageText.includes('Where to start') || pageText.includes('WHERE TO START');
    console.log(`   - "Where to start" section: ${hasWhereToStart ? '✓ Found' : '✗ Not found'}`);
    
    // Check for "Recommended for You" (users with progress)
    const hasRecommendedForYou = pageText.includes('Recommended for You') || pageText.includes('RECOMMENDED FOR YOU');
    console.log(`   - "Recommended for You" section: ${hasRecommendedForYou ? '✓ Found' : '✗ Not found'}`);
    
    // Check for recommendation tags
    const tags = ['Keep Going', 'Try This', 'Explore', 'Complete'];
    const foundTags = [];
    for (const tag of tags) {
      if (pageText.includes(tag)) {
        foundTags.push(tag);
      }
    }
    
    if (foundTags.length > 0) {
      console.log(`   - Recommendation tags found: ${foundTags.join(', ')}`);
    } else {
      console.log('   - Recommendation tags: ✗ None found');
    }
    console.log('');
    
    // Check for OLD sections that should NOT be present
    console.log('4. Checking for OLD sections (should NOT be present)...');
    
    const hasContinueReading = pageText.includes('Continue Reading') && !pageText.includes('Recommended for You');
    const hasAlmostThere = pageText.includes('Almost There') || pageText.includes('Closest to Finish');
    
    console.log(`   - "Continue Reading" section: ${hasContinueReading ? '✗ FOUND (should be removed!)' : '✓ Not found (correct)'}`);
    console.log(`   - "Almost There" section: ${hasAlmostThere ? '✗ FOUND (should be removed!)' : '✓ Not found (correct)'}`);
    console.log('');
    
    // Analyze page structure
    console.log('5. Page structure analysis...');
    
    // Count recommendation cards
    const cards = await page.$$('[class*="card"], [class*="recommendation"], div[class*="rounded"]');
    console.log(`   - Card-like elements: ${cards.length}`);
    
    // Look for specific headings
    const headings = await page.$$('h1, h2, h3, h4');
    console.log(`   - Headings found: ${headings.length}`);
    
    const headingTexts = [];
    for (const heading of headings.slice(0, 10)) {
      const text = await heading.textContent();
      const trimmed = text.trim();
      if (trimmed && trimmed.length < 50) {
        headingTexts.push(trimmed);
      }
    }
    
    if (headingTexts.length > 0) {
      console.log('   - Sample headings:');
      headingTexts.forEach(h => console.log(`     • "${h}"`));
    }
    console.log('');
    
    // Summary
    console.log('='.repeat(70));
    console.log('SMART RECOMMENDATIONS UI TEST SUMMARY');
    console.log('='.repeat(70));
    console.log('');
    
    console.log('✅ EXPECTED (New Smart Recommendations):');
    console.log(`   ${hasWhereToStart || hasRecommendedForYou ? '✓' : '✗'} Smart Recommendations section present`);
    console.log(`   ${foundTags.length > 0 ? '✓' : '✗'} Recommendation tags (${foundTags.length} found: ${foundTags.join(', ') || 'none'})`);
    console.log('');
    
    console.log('❌ NOT EXPECTED (Old sections to be removed):');
    console.log(`   ${!hasContinueReading ? '✓' : '✗'} "Continue Reading" ${!hasContinueReading ? 'removed' : 'still present'}`);
    console.log(`   ${!hasAlmostThere ? '✓' : '✗'} "Almost There" ${!hasAlmostThere ? 'removed' : 'still present'}`);
    console.log('');
    
    if ((hasWhereToStart || hasRecommendedForYou) && !hasContinueReading && !hasAlmostThere) {
      console.log('🎉 SUCCESS: Smart Recommendations UI is correctly implemented!');
    } else if (!hasWhereToStart && !hasRecommendedForYou) {
      console.log('⚠️  WARNING: Smart Recommendations sections not found');
      console.log('   This might be the wrong URL (should be :3000 not :3001)');
      console.log('   Or the feature is not yet implemented');
    } else {
      console.log('⚠️  PARTIAL: Some old sections still present');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    await page.screenshot({ path: path.join(screenshotsDir, 'smart-recommendations-error.png'), fullPage: true });
    console.log('Error screenshot saved: screenshots/smart-recommendations-error.png');
    throw error;
  } finally {
    await browser.close();
  }
})();
