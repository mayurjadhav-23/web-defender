document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "popupRequest" }, (response) => {
        let resultElement = document.getElementById("result");

        if (response) {
            // Clear previous results
            resultElement.innerHTML = '';

            // Phishing check
            let phishingStatus = document.createElement("li");
            if (response.phishingDetected) {
                phishingStatus.textContent = "1. Website is Phished";
                phishingStatus.classList.add("incorrect"); // Add red styling
            } else {
                phishingStatus.textContent = "1. Website is Not Phished";
                phishingStatus.classList.add("correct"); // Add green styling
            }
            resultElement.appendChild(phishingStatus);

            // XSS vulnerability check
            let xssStatus = document.createElement("li");
            if (response.xssDetected) {
                xssStatus.textContent = "2. XSS Vulnerability Detected";
                xssStatus.classList.add("incorrect"); // Add red styling
            } else {
                xssStatus.textContent = "2. Website is Not Vulnerable to XSS";
                xssStatus.classList.add("correct"); // Add green styling
            }
            resultElement.appendChild(xssStatus);

            // Clickjacking vulnerability check
            let clickjackingStatus = document.createElement("li");
            if (response.clickjackingDetected) {
                clickjackingStatus.textContent = "3. Clickjacking Vulnerability Detected";
                clickjackingStatus.classList.add("incorrect"); // Add red styling
            } else {
                clickjackingStatus.textContent = "3. Website is Not Vulnerable to Clickjacking";
                clickjackingStatus.classList.add("correct"); // Add green styling
            }
            resultElement.appendChild(clickjackingStatus);
        } else {
            // If there was an error retrieving the results
            let errorMessage = document.createElement("li");
            errorMessage.textContent = "Error: Could not retrieve results.";
            errorMessage.style.color = "orange";
            resultElement.appendChild(errorMessage);
        }
    });
});
