'use strict';

const STORAGE_KEY_DARK_MODE = 'promptHelperDarkMode_v1';

function initializeDarkMode() {
    StorageAPI.get(STORAGE_KEY_DARK_MODE).then(result => {
        const isDarkMode = result[STORAGE_KEY_DARK_MODE] || false;
        applyDarkMode(isDarkMode);
        updateDarkModeToggle(isDarkMode);
    }).catch(error => {
        console.error("Failed to load dark mode setting:", error);
    });

    browser.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes[STORAGE_KEY_DARK_MODE]) {
            const isDarkMode = changes[STORAGE_KEY_DARK_MODE].newValue;
            applyDarkMode(isDarkMode);
            updateDarkModeToggle(isDarkMode);
        }
    });
}

function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('darkModeActive');
    } else {
        document.body.classList.remove('darkModeActive');
    }
}

function updateDarkModeToggle(isDarkMode) {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
        toggleBtn.textContent = isDarkMode ? '💡' : '🌙';
    }
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.contains('darkModeActive');
    const newDarkMode = !isDarkMode;

    applyDarkMode(newDarkMode);
    updateDarkModeToggle(newDarkMode);

    StorageAPI.set({[STORAGE_KEY_DARK_MODE]: newDarkMode});
}