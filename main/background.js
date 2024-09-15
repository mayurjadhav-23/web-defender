let xssDetected = false;
let phishingDetected = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "popupRequest") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTabId = tabs[0].id;

            // Dynamically inject content scripts into the active tab
            chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                files: ['xssDetection.js', 'phishingDetection.js']
            }, () => {
                // Send a message to the content script after it is injected
                chrome.tabs.sendMessage(activeTabId, { action: "runSecurityChecks" }, (response) => {
                    sendResponse({
                        xssDetected: xssDetected,
                        phishingDetected: phishingDetected
                    });
                });
            });
        });
        return true; // Keep the message channel open for async response
    }
});


function openPopup() {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 300,
        height: 200
    });
}
