document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "popupRequest" }, (response) => {
        let resultElement = document.getElementById("result");

        if (response) {
            let message = "No vulnerabilities detected.";
            let backgroundColor = "green";

            if (response.phishingDetected) {
                message = "Phishing detected!";
                backgroundColor = "red";
            } else if (response.xssDetected) {
                message = "XSS vulnerability detected!";
                backgroundColor = "red";
            }

            resultElement.textContent = message;
            resultElement.style.color = backgroundColor;
        } else {
            resultElement.textContent = "Error: Could not retrieve results.";
            resultElement.style.color = "orange";
        }
    });
});
