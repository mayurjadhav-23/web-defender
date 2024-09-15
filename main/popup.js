document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "popupRequest" }, (response) => {
        let resultElement = document.getElementById("result");

        if (response) {
            let message = "Website status unknown.";
            let backgroundColor = "gray";

            if (response.phishingDetected && response.xssDetected) {
                message = "Website is phished and vulnerable to XSS";
                backgroundColor = "red";
            } else if (response.phishingDetected && !response.xssDetected) {
                message = "Website is phished and Not vulnerable to XSS";
                backgroundColor = "red";
            } else if (!response.phishingDetected && response.xssDetected) {
                message = "Website is safe and vulnerable to XSS";
                backgroundColor = "red"; 
            } else if (!response.phishingDetected && !response.xssDetected) {
                message = "Website is safe and Not vulnerable to XSS";
                backgroundColor = "green"; 
            }

            resultElement.textContent = message;
            resultElement.style.color = backgroundColor;
        } else {
            resultElement.textContent = "Error: Could not retrieve results.";
            resultElement.style.color = "orange";
        }
    });
});
