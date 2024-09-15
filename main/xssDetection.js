let xssPayloads = [
    "<script>alert('XSS')</script>",
    "\"><script>alert('XSS')</script>",
    "<img src='x' onerror='alert(\"XSS\")'>",
    "<svg onload='alert(\"XSS\")'>"
];

// Function to inject payloads and detect XSS
async function checkDomXss() {
    let originalUrl = window.location.href.split("#")[0];  // Save the original URL without any fragments

    for (let payload of xssPayloads) {
        try {
            let alertTriggered = false;
            let domModified = false;

            // Override alert function to detect if XSS executes
            window.alert = function (message) {
                if (message.includes('XSS')) {
                    alertTriggered = true;
                }
            };

            // Temporarily inject payload into the URL fragment
            let testUrl = originalUrl + "#" + payload;
            window.history.pushState("", "", testUrl);

            // Inject the payload into the DOM to check for XSS
            domModified = document.body.innerHTML.includes('XSS') || document.body.innerHTML.includes('<script>');

            // Revert the URL back to the original after testing the payload
            window.history.pushState("", "", originalUrl);

            // If any XSS is detected, stop testing further payloads
            if (alertTriggered || domModified) {
                chrome.runtime.sendMessage({ action: "xssDetected" });
                return true;  // XSS detected
            }
        } catch (error) {
            console.error(`Error testing payload: ${payload}`, error);
        }
    }

    // Ensure the URL is restored to the original after all tests
    window.history.pushState("", "", originalUrl);

    chrome.runtime.sendMessage({ action: "xssNotDetected" });
    return false;  // No XSS detected
}

// Automatically check for DOM-based XSS when the page loads
window.onload = function () {
    checkDomXss();
};
