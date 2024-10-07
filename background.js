// Define the resource types you want to block for third-party requests
const resourceTypesToBlock = ["script", "sub_frame", "font", "xmlhttprequest"];

// Function to identify third-party requests
function isThirdParty(details) {
    try {
        const requestUrl = new URL(details.url);
        const documentUrl = details.initiator || details.documentUrl;
        const documentHost = new URL(documentUrl).hostname;
        const requestHost = requestUrl.hostname;

        // Check if the request is to a different domain than the document origin (third-party)
        return requestHost !== documentHost;
    } catch (e) {
        return false;
    }
}

// Block third-party scripts, images, frames, and fonts
browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (isThirdParty(details)) {
            console.log(`Blocked third-party ${details.type} from: ${details.url}`);
            return { cancel: true }; // Block the request
        }
        return {};
    },
    { 
        urls: ["<all_urls>"],  // Apply to all URLs
        types: resourceTypesToBlock // Block specified resource types
    },
    ["blocking"]
);
// Block all third-party request headers
browser.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (isThirdParty(details)) {
            console.log(`Blocked third-party headers from: ${details.url}`);
            // Clear all headers for third-party requests
            return { requestHeaders: [] };
        }
        return {};
    },
    { 
        urls: ["<all_urls>"], // Apply to all URLs
    },
    ["blocking", "requestHeaders"]
);

// Block all third-party response headers
browser.webRequest.onHeadersReceived.addListener(
    function(details) {
        if (isThirdParty(details)) {
            console.log(`Blocked third-party response headers from: ${details.url}`);
            // Clear all response headers for third-party requests
            return { responseHeaders: [] };
        }
        return {};
    },
    { 
        urls: ["<all_urls>"], // Apply to all URLs
    },
    ["blocking", "responseHeaders"]
);