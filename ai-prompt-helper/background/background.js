'use strict';

const activeTabs = new Set();
const DOMAIN_PREFERENCES_KEY = 'aiPromptHelperDomainPreferences';
const SCRIPT_FILES = [
    "lib/storage.js",
    "data/phrases/expert.js",
    "data/phrases/critic.js",
    "data/phrases/coding.js",
    "data/phrases/adaptive.js",
    "data/phrases/engineering.js",
    "data/phrases/writing.js",
    "lib/phrases.js",
    "content_scripts/promptHelper.js"
];
const CSS_FILES = ["content_scripts/promptHelper.css"];

const ICONS = {
    ACTIVE: "icons/icon-48.png",
    INACTIVE: "icons/icon-48.png"
};

const TITLES = {
    ACTIVE: "Deactivate AI Prompt Helper on this site",
    INACTIVE: "Activate AI Prompt Helper on this site"
};

const AUTO_ENABLED_DOMAINS = [
    "claude.ai",
    "chatgpt.com",
    "aistudio.google.com",
    "gemini.google.com"
];

function shouldAutoEnable(url) {
    if (!url) return false;
    try {
        const hostname = new URL(url).hostname;
        return AUTO_ENABLED_DOMAINS.some(domain => hostname.includes(domain));
    } catch (e) {
        console.error(`[AI Helper BG] Error parsing URL: ${e.message}`);
        return false;
    }
}

async function shouldEnableDomain(url) {
    if (shouldAutoEnable(url)) {
        return true;
    }

    const domainPattern = getDomainPattern(url);
    if (!domainPattern) return false;

    try {
        const result = await browser.storage.local.get(DOMAIN_PREFERENCES_KEY);
        const preferences = result[DOMAIN_PREFERENCES_KEY] || {};

        if (preferences[domainPattern] === true) {
            console.log(`[AI Helper BG] Domain ${domainPattern} is enabled via stored preference`);
            return true;
        }
    } catch (e) {
        console.error(`[AI Helper BG] Error checking domain preferences: ${e.message}`);
    }

    return false;
}

async function saveDomainPreference(url, isEnabled) {
    if (shouldAutoEnable(url)) {
        console.log(`[AI Helper BG] Not saving preference for auto-enabled domain: ${url}`);
        return;
    }

    const domainPattern = getDomainPattern(url);
    if (!domainPattern) return;

    try {
        const result = await browser.storage.local.get(DOMAIN_PREFERENCES_KEY);
        const preferences = result[DOMAIN_PREFERENCES_KEY] || {};

        preferences[domainPattern] = isEnabled;

        await browser.storage.local.set({
            [DOMAIN_PREFERENCES_KEY]: preferences
        });

        console.log(`[AI Helper BG] Saved domain preference for ${domainPattern}: ${isEnabled}`);
    } catch (e) {
        console.error(`[AI Helper BG] Error saving domain preference: ${e.message}`);
    }
}


function getDomainPattern(url) {
    if (!url) return null;
    try {
        return new URL(url).hostname;
    } catch (e) {
        console.error(`[AI Helper BG] Error parsing URL: ${e.message}`);
        return null;
    }
}

async function injectScripts(tabId) {
    try {
        await browser.scripting.insertCSS({
            target: { tabId: tabId },
            files: CSS_FILES
        });
        console.log(`[AI Helper BG] Injected CSS into tab ${tabId}`);

        await browser.scripting.executeScript({
            target: { tabId: tabId },
            files: SCRIPT_FILES
        });
        console.log(`[AI Helper BG] Injected JS into tab ${tabId}`);

        return true;
    } catch (err) {
        if (err.message.includes("Missing host permission for the tab") ||
            err.message.includes("No window matching") ||
            err.message.includes("The extensions gallery cannot be scripted") ||
            err.message.includes("Reading manifest") ||
            err.message.includes("Unsupported protocol") ||
            err.message.includes("Cannot access")
        ) {
            console.warn(`[AI Helper BG] Could not inject script into tab ${tabId}: ${err.message}. This is often expected for protected pages.`);
        } else {
            console.error(`[AI Helper BG] Failed to inject script into tab ${tabId}:`, err);
        }
        return false;
    }
}

async function removeScripts(tabId) {
    try {
        await browser.tabs.sendMessage(tabId, { action: 'deactivatePromptHelper' });
        console.log(`[AI Helper BG] Sent deactivation message to tab ${tabId}`);
        return true;
    } catch (err) {
        if (err.message.includes("Could not establish connection") ||
            err.message.includes("Receiving end does not exist")) {
            console.log(`[AI Helper BG] Content script likely not running in tab ${tabId} during deactivation attempt.`);
        } else {
            console.error(`[AI Helper BG] Failed to send deactivation message to tab ${tabId}:`, err);
        }
        return false;
    }
}

async function updateActionState(tabId, isActive) {
    try {
        await browser.action.setIcon({ tabId: tabId, path: isActive ? ICONS.ACTIVE : ICONS.INACTIVE });
        await browser.action.setTitle({ tabId: tabId, title: isActive ? TITLES.ACTIVE : TITLES.INACTIVE });
    } catch (err) {
        console.warn(`[AI Helper BG] Failed to update action state for tab ${tabId}: ${err.message}. Tab might be closed.`);
    }
}

browser.tabs.onRemoved.addListener((tabId) => {
    if (activeTabs.has(tabId)) {
        activeTabs.delete(tabId);
        console.log(`[AI Helper BG] Cleaned up state for closed tab ${tabId}`);
    }
});

browser.action.onClicked.addListener(async (tab) => {
    console.log(`%c [AI Helper BG] ACTION CLICKED! - Tab ID: ${tab?.id} - ${new Date().toLocaleTimeString()}`, 'color: orange; font-weight: bold; font-size: 1.1em;');

    if (!tab || !tab.id || !tab.url || tab.url.startsWith("about:") || tab.url.startsWith("moz-extension://")) {
        console.log("[AI Helper BG] Action clicked on an invalid tab or unsupported page.");
        if (tab && tab.id) {
            await updateActionState(tab.id, false);
        }
        return;
    }

    const tabId = tab.id;
    console.log(`[AI Helper BG] Processing click for valid Tab ID: ${tabId}`);

    console.log(`[AI Helper BG] Current activeTabs Set BEFORE check:`, new Set(activeTabs));

    console.log(`[AI Helper BG] Checking activeTabs.has(${tabId})... Result: ${activeTabs.has(tabId)}`);
    if (activeTabs.has(tabId)) {
        console.log(`[AI Helper BG] Entering DEACTIVATION block for tab ${tabId}`);
        console.log(`   [Deactivation] activeTabs BEFORE delete:`, new Set(activeTabs));
        const removed = await removeScripts(tabId);
        console.log(`   [Deactivation] removeScripts attempted, result: ${removed}`);
        activeTabs.delete(tabId);

        await saveDomainPreference(tab.url, false);

        console.log(`   [Deactivation] activeTabs AFTER delete:`, new Set(activeTabs));
        await updateActionState(tabId, false);
        console.log(`   [Deactivation] updateActionState complete.`);
        if (!removed) {
            console.log(`   [Deactivation] Note: Deactivation message failed for tab ${tabId}.`);
        }
        console.log(`   [Deactivation] Block finished.`);

    } else {
        console.log(`[AI Helper BG] Entering ACTIVATION block for tab ${tabId}`);
        const injected = await injectScripts(tabId);
        console.log(`   [Activation] injectScripts attempted, result: ${injected}`);

        if (injected) {
            console.log(`   [Activation] Scripts injected. Waiting slightly before sending render message...`);

            setTimeout(async () => {
                console.log(`%c    [Activation] Attempting to send renderContentUI message...`, 'color: blue; font-weight: bold;');
                try {
                    const currentTab = await browser.tabs.get(tabId).catch(() => null);
                    if (!currentTab) {
                        console.warn(`   [Activation] Tab ${tabId} closed before render message could be sent.`);
                        if (activeTabs.has(tabId)) {
                            activeTabs.delete(tabId);
                        }
                        return;
                    }

                    await browser.tabs.sendMessage(tabId, { action: 'renderContentUI' });
                    console.log(`%c    [Activation] SUCCESS: Sent renderContentUI message.`, 'color: blue;');
                    console.log(`   [Activation] activeTabs BEFORE add:`, new Set(activeTabs));
                    activeTabs.add(tabId);

                    await saveDomainPreference(currentTab.url, true);

                    console.log(`   [Activation] activeTabs AFTER add:`, new Set(activeTabs));
                    await updateActionState(tabId, true);
                    console.log(`   [Activation] updateActionState complete.`);
                } catch (err) {
                    console.error(`   [Activation] Failed to send renderContentUI message after delay:`, err);
                    activeTabs.delete(tabId);
                    await updateActionState(tabId, false);
                }
            }, 150);

        } else {
            console.log(`   [Activation] Injection failed, keeping inactive state.`);
            await updateActionState(tabId, false);
        }
        console.log(`   [Activation] Block finished (message send scheduled).`);
    }
    console.log(`[AI Helper BG] Finished processing click for Tab ID: ${tabId}`);
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

    if (changeInfo.status === 'loading' || (changeInfo.url && activeTabs.has(tabId))) {
        if (activeTabs.has(tabId)) {
            console.log(`[AI Helper BG] Navigation/loading detected in active tab ${tabId}. Resetting state.`);
            activeTabs.delete(tabId);
            await updateActionState(tabId, false);
        } else if (changeInfo.status === 'loading') {
            await updateActionState(tabId, false);
        }
    }

    if (changeInfo.status === 'complete' && tab.url) {
        if (tab.url.startsWith("about:") || tab.url.startsWith("moz-extension://") || tab.url.startsWith("chrome:") || tab.url.startsWith("file:")) {
            console.log(`[AI Helper BG] Skipping enablement check for internal/disallowed URL: ${tab.url}`);
            await updateActionState(tabId, false);
            if(activeTabs.has(tabId)) activeTabs.delete(tabId);
            return;
        }

        console.log(`[AI Helper BG] Tab ${tabId} completed loading URL: ${tab.url}`);

        const enableThisDomain = await shouldEnableDomain(tab.url);
        console.log(`[AI Helper BG] Should enable for completed tab ${tabId} (${tab.url})? ${enableThisDomain}`);

        const isAlreadyActive = activeTabs.has(tabId);
        console.log(`[AI Helper BG] Is tab ${tabId} already in activeTabs? ${isAlreadyActive}`);

        if (enableThisDomain) {
            if (!isAlreadyActive) {
                console.log(`[AI Helper BG] Enabling (auto or stored) for completed tab: ${tab.url} ${tabId}`);

                const injected = await injectScripts(tabId);

                if (injected) {
                    console.log(`   [Enable Complete] Injection successful for tab ${tabId}.`);
                    try {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        await browser.tabs.sendMessage(tabId, { action: 'renderContentUI' });
                        console.log(`   [Enable Complete] Sent renderContentUI message to tab ${tabId}.`);
                        activeTabs.add(tabId);
                        await updateActionState(tabId, true);
                        console.log(`   [Enable Complete] Successfully enabled and updated state for tab ${tabId}`);
                    } catch (err) {
                        console.error(`[AI Helper BG] Failed to send render message or update state for COMPLETED tab ${tabId} after injection:`, err);
                        activeTabs.delete(tabId);
                        await updateActionState(tabId, false);
                    }
                } else {
                    console.warn(`[AI Helper BG] Injection failed for completed tab ${tabId}, keeping inactive.`);
                    await updateActionState(tabId, false);
                }
            } else {
                console.log(`[AI Helper BG] Tab ${tabId} should be enabled and is already marked active. Ensuring UI state.`);
                await updateActionState(tabId, true);
            }
        } else {
            console.log(`[AI Helper BG] Tab ${tabId} should NOT be enabled. Ensuring inactive state.`);
            if (isAlreadyActive) {
                console.log(`   [Deactivate Complete] Tab ${tabId} was active but should no longer be. Deactivating.`);
                activeTabs.delete(tabId);
            }
            await updateActionState(tabId, false);
        }
    }
});

async function detectExistingContentScript(tabId) {
    try {
        const response = await browser.tabs.sendMessage(tabId, { action: 'ping' });
        return response && response.success;
    } catch (err) {
        return false;
    }
}

async function initializeTabStates() {
    console.log("[AI Helper BG] Initializing tab states.");
    try {
        const tabs = await browser.tabs.query({});

        for (const tab of tabs) {
            if (tab.id && tab.url) {
                const hasExistingScript = await detectExistingContentScript(tab.id);

                if (hasExistingScript) {
                    console.log(`[AI Helper BG] Found existing content script in tab ${tab.id}, reconnecting`);
                    activeTabs.add(tab.id);
                    await updateActionState(tab.id, true);
                    try {
                        await browser.tabs.sendMessage(tab.id, { action: 'reconnectBackground' });
                    } catch (err) {
                        console.error(`[AI Helper BG] Failed to reconnect to existing script in tab ${tab.id}:`, err);
                    }
                    continue;
                }

                let shouldEnable = shouldAutoEnable(tab.url);

                if (!shouldEnable) {
                    const domainPattern = getDomainPattern(tab.url);
                    if (domainPattern) {
                        try {
                            const result = await browser.storage.local.get(DOMAIN_PREFERENCES_KEY);
                            const preferences = result[DOMAIN_PREFERENCES_KEY] || {};

                            if (preferences[domainPattern] === true) {
                                shouldEnable = true;
                                console.log(`[AI Helper BG] Found stored preference for ${domainPattern}: enabled`);
                            }
                        } catch (e) {
                            console.error(`[AI Helper BG] Error checking stored preferences: ${e.message}`);
                        }
                    }
                }

                if (shouldEnable && !activeTabs.has(tab.id)) {
                    console.log(`[AI Helper BG] Auto-enabling for domain at startup: ${tab.url}`);
                    const injected = await injectScripts(tab.id);
                    if (injected) {
                        try {
                            await browser.tabs.sendMessage(tab.id, { action: 'renderContentUI' });
                            activeTabs.add(tab.id);
                            await updateActionState(tab.id, true);
                        } catch (err) {
                            console.error(`[AI Helper BG] Failed to auto-enable tab ${tab.id} at startup:`, err);
                        }
                    }
                } else {
                    const isActive = activeTabs.has(tab.id);
                    await updateActionState(tab.id, isActive);
                }
            }
        }
    } catch (err) {
        console.error("[AI Helper BG] Error initializing tab states:", err);
    }
}

initializeTabStates();

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getInitialState') {
        browser.storage.local.get([STORAGE_KEYS.DARK_MODE, STORAGE_KEYS.BUTTON_POSITION])
            .then(data => sendResponse({ success: true, data: data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'ping') {
        sendResponse({ success: true });
        return true;
    }

    if (message.action === 'getInitialState') {
        browser.storage.local.get([STORAGE_KEYS.DARK_MODE, STORAGE_KEYS.BUTTON_POSITION])
            .then(data => sendResponse({ success: true, data: data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (message.action === 'enableSite' && message.tabId) {
        const tab = await browser.tabs.get(message.tabId);
        if (tab) {
            console.log(`[AI Helper BG] Enabling for tab ${message.tabId} from popup`);
            const injected = await injectScripts(message.tabId);

            if (injected) {
                setTimeout(async () => {
                    try {
                        await browser.tabs.sendMessage(message.tabId, { action: 'renderContentUI' });
                        activeTabs.add(message.tabId);
                        await updateActionState(message.tabId, true);
                    } catch (err) {
                        console.error(`[AI Helper BG] Failed to send renderContentUI message:`, err);
                    }
                }, 150);
            }
        }
    }

    if (message.action === 'disableSite' && message.tabId) {
        console.log(`[AI Helper BG] Disabling for tab ${message.tabId} from popup`);
        if (activeTabs.has(message.tabId)) {
            await removeScripts(message.tabId);
            activeTabs.delete(message.tabId);
            await updateActionState(message.tabId, false);
        }
    }

    if (message.action === 'resetButtonPosition' && message.tabId) {
        if (activeTabs.has(message.tabId)) {
            try {
                await browser.tabs.sendMessage(message.tabId, { action: 'resetButtonPosition' });
            } catch (err) {
                console.error(`[AI Helper BG] Failed to send resetButtonPosition message:`, err);
            }
        }
    }
});

const STORAGE_KEYS = {
    DARK_MODE: 'promptHelperDarkMode_v1',
    BUTTON_POSITION: 'promptHelperBtnPos_v1'
};

console.log("[AI Helper BG] Background script loaded.");