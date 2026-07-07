import { test, expect } from '@playwright/test';

test.describe('Bible Verse Search App Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Test 1: Initial page load', async ({ page }) => {
    console.log('\n=== TEST 1: INITIAL PAGE LOAD ===');
    
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-1-initial-load.png', fullPage: true });
    
    const heading = await page.locator('h1').textContent();
    console.log('Heading:', heading);
    
    const description = await page.locator('p').first().textContent();
    console.log('Description:', description);
    
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();
    console.log('Search input: VISIBLE');
    
    const searchButton = page.locator('button:has-text("Search")');
    await expect(searchButton).toBeVisible();
    console.log('Search button: VISIBLE');
    
    console.log('Page layout verified successfully');
  });

  test('Test 2: Empty search attempt', async ({ page }) => {
    console.log('\n=== TEST 2: EMPTY SEARCH ATTEMPT ===');
    
    const searchButton = page.locator('button:has-text("Search")');
    const isDisabled = await searchButton.isDisabled();
    console.log('Search button disabled state:', isDisabled);
    
    if (!isDisabled) {
      await searchButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-2-empty-search.png', fullPage: true });
      console.log('Clicked search button with empty input');
      
      const url = page.url();
      console.log('Current URL:', url);
    } else {
      console.log('Search button is disabled - cannot click without input');
    }
  });

  test('Test 3: Valid semantic search', async ({ page }) => {
    console.log('\n=== TEST 3: VALID SEMANTIC SEARCH ===');
    
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('courage in hard times');
    console.log('Typed: "courage in hard times"');
    
    const searchButton = page.locator('button:has-text("Search")');
    await searchButton.click();
    console.log('Clicked Search button');
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-3-search-results.png', fullPage: true });
    
    const results = page.locator('[data-testid="search-result"], .result-item, article, div:has(> a[href^="/verse/"])').first();
    const resultsCount = await page.locator('[data-testid="search-result"], .result-item, article, div:has(> a[href^="/verse/"])').count();
    console.log('Number of results found:', resultsCount);
    
    if (resultsCount > 0) {
      const firstResult = await results.textContent();
      console.log('First result text:', firstResult?.substring(0, 200));
      
      const hasRelevanceBadge = await page.locator('.badge, [class*="relevance"], [class*="score"]').first().isVisible().catch(() => false);
      console.log('Relevance badge visible:', hasRelevanceBadge);
    } else {
      console.log('No results found - checking page content');
      const pageContent = await page.textContent('body');
      console.log('Page content:', pageContent?.substring(0, 500));
    }
  });

  test('Test 4: Click a result to view verse detail', async ({ page }) => {
    console.log('\n=== TEST 4: CLICK RESULT TO VIEW VERSE DETAIL ===');
    
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('courage in hard times');
    
    const searchButton = page.locator('button:has-text("Search")');
    await searchButton.click();
    
    await page.waitForTimeout(3000);
    
    const firstResultLink = page.locator('a[href^="/verse/"]').first();
    const linkExists = await firstResultLink.count();
    console.log('First result link found:', linkExists > 0);
    
    if (linkExists > 0) {
      await firstResultLink.click();
      console.log('Clicked first result');
      
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-4-verse-detail.png', fullPage: true });
      
      const url = page.url();
      console.log('Current URL:', url);
      console.log('URL contains /verse/:', url.includes('/verse/'));
      
      const verseText = await page.locator('body').textContent();
      console.log('Page content preview:', verseText?.substring(0, 300));
      
      const backLink = page.locator('a:has-text("Back"), a:has-text("back"), button:has-text("Back")');
      const hasBackLink = await backLink.count() > 0;
      console.log('Has "Back to search" link:', hasBackLink);
      
      const hasHighlight = await page.locator('[class*="highlight"], [class*="focused"], .verse-focus').count() > 0;
      console.log('Has highlighted/focused verse:', hasHighlight);
    } else {
      console.log('No result links found');
    }
  });

  test('Test 5: Navigate back', async ({ page }) => {
    console.log('\n=== TEST 5: NAVIGATE BACK ===');
    
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('courage in hard times');
    
    const searchButton = page.locator('button:has-text("Search")');
    await searchButton.click();
    
    await page.waitForTimeout(3000);
    
    const firstResultLink = page.locator('a[href^="/verse/"]').first();
    await firstResultLink.click();
    
    await page.waitForTimeout(2000);
    
    const backLink = page.locator('a:has-text("Back"), a:has-text("back"), button:has-text("Back")').first();
    const hasBackLink = await backLink.count() > 0;
    
    if (hasBackLink) {
      await backLink.click();
      console.log('Clicked Back link');
      
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-5-back-to-home.png', fullPage: true });
      
      const url = page.url();
      console.log('Current URL:', url);
      console.log('Back at home page:', url === 'http://localhost:3000/' || url === 'http://localhost:3000');
      
      const heading = await page.locator('h1').textContent();
      console.log('Heading:', heading);
    } else {
      console.log('No back link found');
    }
  });

  test('Test 6: Second search', async ({ page }) => {
    console.log('\n=== TEST 6: SECOND SEARCH ===');
    
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('love');
    console.log('Typed: "love"');
    
    const searchButton = page.locator('button:has-text("Search")');
    await searchButton.click();
    console.log('Clicked Search button');
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-6-second-search.png', fullPage: true });
    
    const resultsCount = await page.locator('[data-testid="search-result"], .result-item, article, div:has(> a[href^="/verse/"])').count();
    console.log('Number of results found:', resultsCount);
    
    if (resultsCount > 0) {
      console.log('Results loaded successfully');
      const firstResult = await page.locator('[data-testid="search-result"], .result-item, article, div:has(> a[href^="/verse/"])').first().textContent();
      console.log('First result preview:', firstResult?.substring(0, 200));
    } else {
      console.log('No results found');
      const pageContent = await page.textContent('body');
      console.log('Page content:', pageContent?.substring(0, 500));
    }
  });
});
