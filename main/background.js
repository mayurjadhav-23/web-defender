let xssDetected = false;
let phishingDetected = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "xssDetected") {
        xssDetected = true;
        checkAndShowPopup();
    } else if (request.action === "xssNotDetected") {
        xssDetected = false;
        checkAndShowPopup(); // Ensure we check if it's safe after updating
    }

    if (request.action === "phishingDetected") {
        phishingDetected = true;
        checkAndShowPopup();
    } else if (request.action === "phishingNotDetected") {
        phishingDetected = false;
        checkAndShowPopup(); // Ensure we check if it's safe after updating
    }

    if (request.action === "popupRequest") {
        sendResponse({
            xssDetected: xssDetected,
            phishingDetected: phishingDetected
        });
    }
});

function checkAndShowPopup() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: showPopupOnActiveTab,
            args: [xssDetected, phishingDetected]
        });
    });
}

function showPopupOnActiveTab(xssDetected, phishingDetected) {
    let message = "Website status unknown.";
    let backgroundColor = "gray";

    if (phishingDetected && xssDetected) {
        message = "Website is phished and XSS vulnerability is present";
        backgroundColor = "red";
    } else if (phishingDetected && !xssDetected) {
        message = "Website is phished and XSS vulnerability not present";
        backgroundColor = "red";
    } else if (!phishingDetected && xssDetected) {
        message = "Website is safe and XSS vulnerability is present";
        backgroundColor = "red";
    } else if (!phishingDetected && !xssDetected) {
        message = "Website is safe and XSS vulnerability not present";
        backgroundColor = "green"; // Ensure green is used correctly here
    }

    // Remove any previous popups before showing a new one
    let existingPopup = document.querySelector('.extension-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create and display the popup
    let popup = document.createElement('div');
    popup.className = 'extension-popup'; // Add a class to identify this popup
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
