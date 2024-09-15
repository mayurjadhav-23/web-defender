let xssDetected = false;
let phishingDetected = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "xssDetected") {
        xssDetected = true;
        openPopup(); // Open popup when XSS is detected
    }
    if (request.action === "xssNotDetected") {
        xssDetected = false;
    }
    if (request.action === "phishingDetected") {
        phishingDetected = true;
        openPopup(); // Open popup when phishing is detected
    }
    if (request.action === "phishingNotDetected") {
        phishingDetected = false;
    }
    if (request.action === "popupRequest") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTabId = tabs[0].id;
            chrome.tabs.sendMessage(activeTabId, { action: "runSecurityChecks" }, (response) => {
                sendResponse({
                    xssDetected: xssDetected,
                    phishingDetected: phishingDetected
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
