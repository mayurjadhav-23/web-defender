let clickjackingVulnerable = false;
let iframeSuspicious = false;
let externalIframeDetected = false;
let frameBustingDetected = false;
let headersVulnerable = false;

function checkIframes() {
  let iframes = document.querySelectorAll('iframe');

  if (iframes.length > 0) {
    iframes.forEach(iframe => {
      let style = window.getComputedStyle(iframe);
      // Check if iframe is hidden or transparent
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
        iframeSuspicious = true;
      }
      // Check if iframe is loading content from a different domain
      let src = iframe.src;
      if (src && new URL(src).origin !== window.location.origin) {
        externalIframeDetected = true;
      }
    });
  }
}

function checkHeaders() {
  fetch(document.location.href, { method: 'HEAD' })
    .then(response => {
      let headers = response.headers;
      let xFrameOptions = headers.get('X-Frame-Options');
      let csp = headers.get('Content-Security-Policy');

      // Check X-Frame-Options for protection
      let xFrameOptionsSafe = xFrameOptions === 'DENY' || xFrameOptions === 'SAMEORIGIN';

      // Check CSP for frame-ancestors protection
      let cspSafe = csp ? csp.includes('frame-ancestors') : false;

      // Consider vulnerable if neither X-Frame-Options nor CSP is safe
      headersVulnerable = !(xFrameOptionsSafe || cspSafe);

      // Combine all the detection results
      analyzeResults();
    })
    .catch(() => {
      // Handle fetch errors (e.g., network issues) by considering headers unreliable
      headersVulnerable = false;
      analyzeResults();
    });
}

function checkFrameBusting() {
  try {
    if (window.top !== window.self) {
      // The website is being embedded in an iframe
      frameBustingDetected = true;
    }
  } catch (e) {
    // Access denied, the site might be blocking attempts to be framed
    frameBustingDetected = true;
  }
}

function analyzeResults() {
  // Determine overall vulnerability based on combined checks
  if ((iframeSuspicious || externalIframeDetected) && headersVulnerable && !frameBustingDetected) {
    clickjackingVulnerable = true;
  } else {
    clickjackingVulnerable = false;
  }

  // Send the result to the background script
  chrome.runtime.sendMessage({
    action: clickjackingVulnerable ? "clickjackingDetected" : "clickjackingNotDetected"
  });
}

// Run checks when the window loads
window.addEventListener("load", () => {
  checkIframes();
  checkFrameBusting();
  checkHeaders();
});
