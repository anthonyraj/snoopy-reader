import { test, expect } from '@playwright/test';

test('Test search results persistence on back navigation', async ({ page }) => {
  console.log('\n=== TESTING SEARCH RESULTS PERSISTENCE ===\n');
  
  // Step 1: Navigate to home page
  await page.goto('http://localhost:3000');
  console.log('✓ Step 1: Navigated to http://localhost:3000');
  
  // Step 2: Type "forgiveness" and click Search
  const searchInput = page.locator('input[type="text"]');
  await searchInput.fill('forgiveness');
  console.log('✓ Step 2: Typed "forgiveness" in search input');
  
  const searchButton = page.locator('button:has-text("Search")');
  await searchButton.click();
  console.log('✓ Step 2: Clicked Search button');
  
  // Step 3: Wait for results and take snapshot
  await page.waitForTimeout(3500);
  await page.screenshot({ path: 'test-back-nav-1-results.png', fullPage: true });
  
  const queryValue = await searchInput.inputValue();
  console.log(`✓ Step 3: Query in input: "${queryValue}"`);
  
  const resultCards = page.locator('a[href^="/verse/"]');
  const resultsCount = await resultCards.count();
  console.log(`✓ Step 3: Number of results: ${resultsCount}`);
  console.log('✓ Step 3: Screenshot saved: test-back-nav-1-results.png');
  
  if (resultsCount > 0) {
    const firstResultText = await resultCards.first().textContent();
    console.log(`✓ Step 3: First result preview: ${firstResultText?.substring(0, 100)}...`);
  }
  
  // Step 4: Click first result
  if (resultsCount > 0) {
    const firstResultHref = await resultCards.first().getAttribute('href');
    console.log(`✓ Step 4: Clicking first result (${firstResultHref})`);
    await resultCards.first().click();
    
    // Step 5: Wait for verse detail page and take snapshot
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'test-back-nav-2-detail.png', fullPage: true });
    
    const currentUrl = page.url();
    console.log(`✓ Step 5: Current URL: ${currentUrl}`);
    console.log(`✓ Step 5: On verse detail page: ${currentUrl.includes('/verse/')}`);
    console.log('✓ Step 5: Screenshot saved: test-back-nav-2-detail.png');
    
    // Check for verse content
    const verseHeading = await page.locator('h2, h1').first().textContent();
    console.log(`✓ Step 5: Verse heading: ${verseHeading}`);
    
    // Step 6: Click "Back to search" link
    const backLink = page.locator('a:has-text("Back"), a:has-text("back")').first();
    const backLinkExists = await backLink.count() > 0;
    console.log(`✓ Step 6: Back link found: ${backLinkExists}`);
    
    if (backLinkExists) {
      const backLinkText = await backLink.textContent();
      console.log(`✓ Step 6: Back link text: "${backLinkText}"`);
      await backLink.click();
      console.log('✓ Step 6: Clicked back link');
      
      // Step 7: Wait and take snapshot after returning
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-back-nav-3-after-back.png', fullPage: true });
      console.log('✓ Step 7: Screenshot saved: test-back-nav-3-after-back.png');
      
      const returnedUrl = page.url();
      console.log(`✓ Step 7: Returned to URL: ${returnedUrl}`);
      
      // CRITICAL CHECK: Is search input still populated?
      const queryAfterBack = await searchInput.inputValue();
      console.log(`\n=== CRITICAL CHECK ===`);
      console.log(`Search input value after back: "${queryAfterBack}"`);
      console.log(`Is input populated? ${queryAfterBack.length > 0 ? '✅ YES' : '❌ NO (EMPTY)'}`);
      console.log(`Input matches original query? ${queryAfterBack === 'forgiveness' ? '✅ YES' : '❌ NO'}`);
      
      // CRITICAL CHECK: Are results still displayed?
      const resultsAfterBack = await resultCards.count();
      console.log(`Number of results after back: ${resultsAfterBack}`);
      console.log(`Are results displayed? ${resultsAfterBack > 0 ? '✅ YES' : '❌ NO (EMPTY)'}`);
      console.log(`Results count matches? ${resultsAfterBack === resultsCount ? '✅ YES' : '❌ NO'}`);
      
      // Check if page is in initial/empty state
      const searchHeading = await page.locator('h2:has-text("Search the Bible")').isVisible();
      const hasResults = resultsAfterBack > 0;
      const isLoading = await page.locator('text=Searching...').isVisible().catch(() => false);
      
      console.log(`\n=== PAGE STATE ===`);
      console.log(`Search heading visible: ${searchHeading}`);
      console.log(`Has results: ${hasResults}`);
      console.log(`Is loading: ${isLoading}`);
      
      if (queryAfterBack.length === 0 && resultsAfterBack === 0) {
        console.log(`\n❌ FAIL: Page is RESET/EMPTY after back navigation`);
        console.log(`Expected: Query "forgiveness" and ${resultsCount} results`);
        console.log(`Actual: Empty input and no results`);
      } else if (queryAfterBack === 'forgiveness' && resultsAfterBack === resultsCount) {
        console.log(`\n✅ PASS: Search state PERSISTED correctly`);
        console.log(`Query and results are restored after back navigation`);
      } else {
        console.log(`\n⚠️ PARTIAL: Some state persisted but not complete`);
        console.log(`Query: ${queryAfterBack === 'forgiveness' ? 'restored' : 'not restored'}`);
        console.log(`Results: ${resultsAfterBack === resultsCount ? 'restored' : 'not restored'}`);
      }
      
      // Additional checks
      const pageContent = await page.locator('body').textContent();
      const hasNoResultsMessage = pageContent?.includes('No results found');
      const hasResultsCountLabel = pageContent?.includes('result');
      
      console.log(`\n=== ADDITIONAL INFO ===`);
      console.log(`Has "No results found" message: ${hasNoResultsMessage}`);
      console.log(`Has results count label: ${hasResultsCountLabel}`);
      
    } else {
      console.log('❌ ERROR: Back link not found on verse detail page');
    }
  } else {
    console.log('❌ ERROR: No search results found to click');
  }
  
  console.log('\n=== TEST COMPLETE ===');
});
