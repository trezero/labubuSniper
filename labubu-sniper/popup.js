document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const offsetInput = document.getElementById('offset');
    const setAlarmBtn = document.getElementById('setAlarm');
    const cancelAlarmBtn = document.getElementById('cancelAlarm');
    const statusDiv = document.getElementById('status');
  
    // Load any existing alarm info when the popup opens
    chrome.storage.sync.get('dropInfo', (data) => {
      if (data.dropInfo) {
        const { url, date, time, offset, triggerTime } = data.dropInfo;
        urlInput.value = url;
        dateInput.value = date;
        timeInput.value = time;
        offsetInput.value = offset;
        updateStatus(`Alert set for: ${new Date(triggerTime).toLocaleString()}`);
      } else {
        updateStatus('No drop scheduled.');
      }
    });
  
    // Set Alarm Button Logic
    setAlarmBtn.addEventListener('click', () => {
      const url = urlInput.value;
      const date = dateInput.value;
      const time = timeInput.value;
      const offset = parseInt(offsetInput.value, 10);
  
      if (!url || !date || !time) {
        updateStatus('Error: Please fill all fields.');
        return;
      }
  
      // Combine date and time to create a target timestamp
      const dropDateTime = new Date(`${date}T${time}`);
      const triggerTime = dropDateTime.getTime() - (offset * 1000);
  
      if (triggerTime < Date.now()) {
          updateStatus('Error: The scheduled time is in the past.');
          return;
      }
  
      // Save the info to storage
      const dropInfo = { url, date, time, offset, triggerTime };
      chrome.storage.sync.set({ dropInfo }, () => {
        // Create the alarm
        chrome.alarms.create('labubuDrop', { when: triggerTime });
        
        // Notify the user
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Drop Sniper Set!',
            message: `Alert is set for ${new Date(triggerTime).toLocaleString()}`,
            priority: 2
        });
        
        updateStatus(`Alert set for: ${new Date(triggerTime).toLocaleString()}`);
        window.close(); // Close the popup
      });
    });
  
    // Cancel Alarm Button Logic
    cancelAlarmBtn.addEventListener('click', () => {
      chrome.alarms.clear('labubuDrop', (wasCleared) => {
        chrome.storage.sync.remove('dropInfo', () => {
          updateStatus('Alert canceled.');
          urlInput.value = '';
          dateInput.value = '';
          timeInput.value = '';
        });
      });
    });
  
    function updateStatus(message) {
      statusDiv.textContent = message;
    }
  });