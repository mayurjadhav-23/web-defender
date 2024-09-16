chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "clickjackingDetected" || message.action === "clickjackingNotDetected") {
      showPopupInActiveTab(message.action === "clickjackingDetected");
    }
  });
  
  function showPopupInActiveTab(isVulnerable) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: activeTabId },
        func: displayPopupOnActiveTab,
        args: [isVulnerable]
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error executing script: ", chrome.runtime.lastError.message);
        }
      });
    });
  }
  
  function displayPopupOnActiveTab(isVulnerable) {
    let message = isVulnerable ? "Website is vulnerable to clickjacking!" : "Website is safe from clickjacking.";
    let backgroundColor = isVulnerable ? "red" : "green";
  
    // Remove any existing popup
    let existingPopup = document.querySelector('.extension-popup');
    if (existingPopup) {
      existingPopup.remove();
    }
  
    // Create new popup
    let popup = document.createElement('div');
    popup.className = 'extension-popup';
    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.padding = '15px';
    popup.style.backgroundColor = backgroundColor;
    popup.style.color = 'white';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '10000';
    popup.style.fontSize = '16px';
    popup.style.maxWidth = '300px';
    popup.style.wordWrap = 'break-word';
    popup.innerText = message;
  
    // Add close button
    let closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
  
    closeButton.addEventListener('click', function () {
      popup.remove();
    });
  
    popup.appendChild(closeButton);
    document.body.appendChild(popup);
  }
  