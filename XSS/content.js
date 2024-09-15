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
                return true;  // XSS detected
            }
        } catch (error) {
            console.error(`Error testing payload: ${payload}`, error);
        }
    }

    // Ensure the URL is restored to the original after all tests
    window.history.pushState("", "", originalUrl);

    return false;  // No XSS detected
}

// Function to create and show the popup
function showPopup(message, backgroundColor) {
    let popup = document.createElement('div');
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
    
    closeButton.addEventListener('click', function() {
        popup.remove();
    });

    popup.appendChild(closeButton);
    document.body.appendChild(popup);
}

// Automatically check for DOM-based XSS when the page loads
window.onload = function () {
    checkDomXss().then((xssDetected) => {
        let message = xssDetected ? "⚠️ XSS vulnerability detected!" : "✅ URL is safe from XSS.";
        let backgroundColor = xssDetected ? "red" : "green";
        showPopup(message, backgroundColor);
    });
};
