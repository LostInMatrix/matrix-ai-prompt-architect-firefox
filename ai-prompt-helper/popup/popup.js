'use strict';

let isInitialized = false;

const toggleSiteBtn = document.getElementById('toggleSiteBtn');
const toggleText = document.getElementById('toggleText');
const resetPositionBtn = document.getElementById('resetPositionBtn');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const statusElement = document.getElementById('status');

const DOMAIN_PREFERENCES_KEY = 'aiPromptHelperDomainPreferences';
const STORAGE_KEY_BTN_POS = 'promptHelperBtnPos_v1';
const AUTO_ENABLED_DOMAINS = [
    "claude.ai",
    "chatgpt.com",
    "aistudio.google.com",
    "gemini.google.com"
];

function showStatus(message, type = 'success') {
    statusElement.textContent = message;
    statusElement.className = type;
    setTimeout(() => {
        statusElement.className = '';
    }, 2000);
}

async function getCurrentTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
}

function getDomainPattern(url) {
    if (!url) return null;
    try {
        return new URL(url).hostname;
    } catch (e) {
        console.error(`[AI Helper Popup] Error parsing URL: ${e.message}`);
        return null;
    }
}

function isAutoEnabled(url) {
    if (!url) return false;
    try {
        const hostname = new URL(url).hostname;
        return AUTO_ENABLED_DOMAINS.some(domain => hostname.includes(domain));
    } catch (e) {
        console.error(`[AI Helper Popup] Error parsing URL: ${e.message}`);
        return false;
    }
}

async function updateToggleState(tab) {
    const toggleIndicator = document.getElementById('toggleIndicator');

    if (!tab || !tab.url || tab.url.startsWith('about:') || tab.url.startsWith('moz-extension://')) {
        toggleSiteBtn.disabled = true;
        toggleText.textContent = 'Not available on this page';
        toggleIndicator.classList.remove('active');
        return;
    }

    const domainPattern = getDomainPattern(tab.url);
    if (!domainPattern) {
        toggleSiteBtn.disabled = true;
        toggleText.textContent = 'Not available on this page';
        toggleIndicator.classList.remove('active');
        return;
    }

    try {
        const result = await browser.storage.local.get(DOMAIN_PREFERENCES_KEY);
        const preferences = result[DOMAIN_PREFERENCES_KEY] || {};

        const isAuto = isAutoEnabled(tab.url);

        if (isAuto && preferences[domainPattern] === false) {
            toggleSiteBtn.disabled = false;
            toggleText.textContent = 'Disabled for this site';
            toggleIndicator.classList.remove('active');
            return;
        } else if (isAuto) {
            toggleSiteBtn.disabled = false;
            toggleText.textContent = 'Auto-enabled (Click to disable)';
            toggleIndicator.classList.add('active');
            return;
        }

        const isEnabled = preferences[domainPattern] === true;
        toggleSiteBtn.disabled = false;
        toggleText.textContent = isEnabled ? 'Enabled for this site' : 'Disabled for this site';

        if (isEnabled) {
            toggleIndicator.classList.add('active');
        } else {
            toggleIndicator.classList.remove('active');
        }
    } catch (e) {
        console.error(`[AI Helper Popup] Error checking domain preferences: ${e.message}`);
        toggleSiteBtn.disabled = true;
        toggleText.textContent = 'Error checking status';
        toggleIndicator.classList.remove('active');
    }
}

async function toggleSitePreference(tab) {
    if (!tab || !tab.url) return;

    const domainPattern = getDomainPattern(tab.url);
    if (!domainPattern) return;

    try {
        const result = await browser.storage.local.get(DOMAIN_PREFERENCES_KEY);
        const preferences = result[DOMAIN_PREFERENCES_KEY] || {};
        const isAuto = isAutoEnabled(tab.url);

        let newState;

        if (isAuto) {
            const isCurrentlyEnabled = document.getElementById('toggleIndicator').classList.contains('active');

            if (isCurrentlyEnabled) {
                preferences[domainPattern] = false;
                newState = false;

                document.getElementById('toggleIndicator').classList.remove('active');
                toggleText.textContent = 'Disabled for this site';
            } else {
                delete preferences[domainPattern];
                newState = true;

                document.getElementById('toggleIndicator').classList.add('active');
                toggleText.textContent = 'Auto-enabled (Click to disable)';
            }
        } else {
            const currentState = preferences[domainPattern] === true;
            preferences[domainPattern] = !currentState;
            newState = !currentState;

            if (newState) {
                document.getElementById('toggleIndicator').classList.add('active');
                toggleText.textContent = 'Enabled for this site';
            } else {
                document.getElementById('toggleIndicator').classList.remove('active');
                toggleText.textContent = 'Disabled for this site';
            }
        }

        await browser.storage.local.set({
            [DOMAIN_PREFERENCES_KEY]: preferences
        });

        await browser.runtime.sendMessage({
            action: newState ? 'enableSite' : 'disableSite',
            tabId: tab.id
        });

        showStatus(`AI Helper ${newState ? 'enabled' : 'disabled'} for this site`);
    } catch (e) {
        console.error(`[AI Helper Popup] Error toggling domain preference: ${e.message}`);
        showStatus('Error updating preference', 'error');
    }
}
async function resetPosition() {
    try {
        await browser.storage.local.remove(STORAGE_KEY_BTN_POS);
        showStatus('Button position reset');

        const tab = await getCurrentTab();
        if (tab && tab.id) {
            await browser.runtime.sendMessage({
                action: 'resetButtonPosition',
                tabId: tab.id
            });
        }
    } catch (e) {
        console.error(`[AI Helper Popup] Error resetting button position: ${e.message}`);
        showStatus('Error resetting position', 'error');
    }
}

function openSettings() {
    browser.runtime.openOptionsPage();
    window.close();
}

document.addEventListener('DOMContentLoaded', async () => {
    const tab = await getCurrentTab();
    await updateToggleState(tab);

    toggleSiteBtn.addEventListener('click', async () => {
        if (!toggleSiteBtn.disabled) {
            const tab = await getCurrentTab();
            await toggleSitePreference(tab);
        }
    });

    resetPositionBtn.addEventListener('click', resetPosition);

    openSettingsBtn.addEventListener('click', openSettings);
});