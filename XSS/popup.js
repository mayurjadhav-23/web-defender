document.addEventListener("DOMContentLoaded", () => {
    // Ask the background script to start the XSS test
    chrome.runtime.sendMessage({ action: "testXss" }, (response) => {
        // Once the background script responds, update the popup with the result
        document.getElementById("result").textContent = response.message;
    });
});
