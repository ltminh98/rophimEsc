// 1. SET UP THE PERMANENT AD BLOCKER
const AD_RULES = [
    {
        "id": 1,
        "priority": 1,
        "action": { "type": "block" },
        "condition": {
            "urlFilter": "*pmolink*",
            "resourceTypes": ["xmlhttprequest", "media", "other"]
        }
    },
    {
        "id": 2,
        "priority": 1,
        "action": { "type": "block" },
        "condition": {
            "urlFilter": "*finallygotthexds.site*",
            "resourceTypes": ["xmlhttprequest", "media", "other"]
        }
    }
];

// Apply the rules as soon as the extension installs/updates
chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2], // Clean old rules
        addRules: AD_RULES
    });
    console.log("Ad-blocking rules activated.");
});

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        chrome.storage.local.get(['isCapturing'], (res) => {
            if (res.isCapturing && details.url.includes(".m3u8")) {

                // --- AD EXCLUSION LOGIC ---
                const isAd = details.url.includes("pmolink") ||
                    details.url.includes("finallygotthexds.site");

                if (isAd) {
                    console.log("Filtered out ad stream:", details.url);
                    return; // Ignore this request and keep listening
                }
                // --------------------------

                // Send the real movie URL to the popup
                chrome.runtime.sendMessage({
                    type: "URL_FOUND",
                    url: details.url
                });

                // Stop capturing automatically after finding the real one
                chrome.storage.local.set({ isCapturing: false });
            }
        });
    },
    { urls: ["<all_urls>"] }
);