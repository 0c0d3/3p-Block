// 
const tabToUrlMap = new Map();

// 
browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.type === "main_frame") {
            try {
                const targetUrl = new URL(details.url);
                tabToUrlMap.set(details.tabId, targetUrl.hostname);
            } catch (e) {}
        }
        return {};
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

// 
browser.tabs.onRemoved.addListener((tabId) => {
    tabToUrlMap.delete(tabId);
});

// 
browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        // Dejar pasar la navegación principal (si hacés clic para ir a otra web)
        if (details.type === "main_frame") return {};

        try {
            const requestUrl = new URL(details.url);
            const topLevelHost = tabToUrlMap.get(details.tabId);

            //
            if (!topLevelHost) {
                const sourceUrlString = details.initiator || details.originUrl || details.documentUrl;
                if (!sourceUrlString) return {};
                const sourceUrl = new URL(sourceUrlString);
                if (requestUrl.hostname !== sourceUrl.hostname) {
                    return { cancel: true };
                }
                return {};
            }

            // 
            if (requestUrl.hostname !== topLevelHost) {
                console.log(`[BLOQUEADO 3PARTY] En: ${topLevelHost} -> Se denegó: ${requestUrl.hostname}`);
                return { cancel: true };
            }
        } catch (e) {}
        return {};
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);
