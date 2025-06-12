// Listen for messages from popup to open variants with throttling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openVariants' && Array.isArray(message.urls)) {
    openTabsWithDelay(message.urls, message.delayMs || 1500);
    sendResponse({ status: 'ok' });
  }
});

// Listen for when the alarm goes off
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "labubuDrop") {
    // Retrieve the saved URL from storage
    chrome.storage.sync.get("dropInfo", (data) => {
      if (data.dropInfo && data.dropInfo.url) {
        // Generate sequential URLs based on the pattern
        const baseUrl = data.dropInfo.url;
        const urlsToOpen = generateSequentialUrls(baseUrl, 10);

        // Open each URL with delay to avoid rate limiting
        openTabsWithDelay(urlsToOpen, 1500);

        // Show a notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Drop Sniper Fired!',
          message: `${urlsToOpen.length} product pages are opening now. Good luck!`,
          priority: 2
        });
        
        // Clean up storage after the alarm has fired
        chrome.storage.sync.remove("dropInfo");
      }
    });
  }
});

/**
 * Generate an array of sequential URLs by incrementing the 4-digit SKU segment
 * immediately after the string "1000" and before any suffix.
 *
 * For example, given the base URL:
 *   https://www.popmart.com/us/pop-now/set/40-10007802600280
 * the function will return the next `count` URLs with the SKU segment +1, +2, ...
 *
 * @param {string} baseUrl  The initial product URL.
 * @param {number} count    The number of sequential URLs to generate.
 * @returns {string[]}      Array containing `count` generated URLs.
 */
function generateSequentialUrls(baseUrl, count = 10) {
  const regex = /(.*1000)(\d{4})(.*)/;
  const match = baseUrl.match(regex);
  if (!match) {
    // If the pattern isn't found, just return the original URL.
    return Array(count).fill(baseUrl);
  }

  const prefix = match[1];
  const skuNum = parseInt(match[2], 10);
  const suffix = match[3];

  const urls = [];
  for (let i = 1; i <= count; i++) {
    const newSku = String(skuNum + i).padStart(4, '0');
    urls.push(`${prefix}${newSku}${suffix}`);
  }
  return urls;
}

function openTabsWithDelay(urls, delayMs = 1000) {
  urls.forEach((url, index) => {
    setTimeout(() => {
      chrome.tabs.create({ url, active: index === 0 });
    }, index * delayMs);
  });
}