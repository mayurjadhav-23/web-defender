document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "popupRequest" }, (response) => {
        let resultElement = document.getElementById("result");

        if (response) {
            let message = "Website status unknown.";
            let backgroundColor = "gray";

            if (response.phishingDetected && response.xssDetected) {
                message = "Website is phished and XSS vulnerability is present";
                backgroundColor = "red";
            } else if (response.phishingDetected && !response.xssDetected) {
                message = "Website is phished and XSS vulnerability not present";
                backgroundColor = "red";
            } else if (!response.phishingDetected && response.xssDetected) {
                message = "Website is safe and XSS vulnerability is present";
                backgroundColor = "red";
            } else if (!response.phishingDetected && !response.xssDetected) {
                message = "Website is safe and XSS vulnerability not present";
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
