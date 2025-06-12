// Listen for when the alarm goes off
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "labubuDrop") {
      // Retrieve the saved URL from storage
      chrome.storage.sync.get("dropInfo", (data) => {
        if (data.dropInfo && data.dropInfo.url) {
          // Create a new tab with the URL
          chrome.tabs.create({ url: data.dropInfo.url, active: true });
  
          // Show a notification
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Drop Sniper Fired!',
            message: 'Your Labubu page is opening now. Good luck!',
            priority: 2
          });
          
          // Clean up storage after the alarm has fired
          chrome.storage.sync.remove("dropInfo");
        }
      });
    }
  });