let xssDetected = false;
let phishingDetected = false;
let clickjackingDetected = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "xssDetected") {
        xssDetected = true;
    } else if (request.action === "xssNotDetected") {
        xssDetected = false;
    }

    if (request.action === "phishingDetected") {
        phishingDetected = true;
    } else if (request.action === "phishingNotDetected") {
        phishingDetected = false;
    }

    if (request.action === "clickjackingDetected") {
        clickjackingDetected = true;
    } else if (request.action === "clickjackingNotDetected") {
        clickjackingDetected = false;
    }

    if (request.action === "popupRequest") {
        sendResponse({
            xssDetected: xssDetected,
            phishingDetected: phishingDetected,
            clickjackingDetected: clickjackingDetected
        });
    }

    checkAndShowPopup();
});

function checkAndShowPopup() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: showPopupOnActiveTab,
            args: [xssDetected, phishingDetected, clickjackingDetected]
        });
    });
}

function showPopupOnActiveTab(xssDetected, phishingDetected, clickjackingDetected) {
    let message = "Website is Safe.";
    let backgroundColor = "green";

    // If any vulnerability is detected, show a vulnerable message and set the background color to red
    if (xssDetected || phishingDetected || clickjackingDetected) {
        message = "Website is vulnerable!";
        backgroundColor = "red";
    }

    // Remove previous popup
    let existingPopup = document.querySelector('.extension-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create and display the popup
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
