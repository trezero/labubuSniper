document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('url');
  const openBtn = document.getElementById('openVariants');
  const statusDiv = document.getElementById('status');

  // Button click -> generate sequential URLs and open them in new tabs
  openBtn.addEventListener('click', () => {
    const baseUrl = urlInput.value.trim();
    if (!baseUrl) {
      updateStatus('Error: Please enter a base URL.');
      return;
    }

    const urls = generateSequentialUrls(baseUrl, 10);
    // Send message to background to open tabs with delay (persists after popup closes)
    chrome.runtime.sendMessage({ action: 'openVariants', urls, delayMs: 1500 }, (resp) => {
      if (resp && resp.status === 'ok') {
        updateStatus(`${urls.length} tabs will open (1.5 s apart). You may close this popup.`);
        window.close();
      } else {
        updateStatus('Error communicating with background.');
      }
    });
  });

  function updateStatus(message) {
    statusDiv.textContent = message;
  }

  /**
   * Generate an array of sequential URLs by incrementing the 4-digit SKU segment
   * immediately after the string "1000" and before "600280".
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

  // openTabsWithDelay kept for potential future use but not called here.
  function openTabsWithDelay(urls, delayMs = 1000) {
    urls.forEach((url, index) => {
      setTimeout(() => {
        chrome.tabs.create({ url, active: index === 0 });
      }, index * delayMs);
    });
  }
});