'use strict';

const StorageAPI = {
    async get(keys) {
        try {
            return await browser.storage.local.get(keys);
        } catch (error) {
            console.error('Storage get error:', error);
            throw error;
        }
    },

    async set(data) {
        try {
            await browser.storage.local.set(data);
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            throw error;
        }
    },

    async remove(keys) {
        try {
            await browser.storage.local.remove(keys);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            throw error;
        }
    },

    async clear() {
        try {
            await browser.storage.local.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            throw error;
        }
    }
};

if (typeof browser === 'undefined' && typeof chrome !== 'undefined') {
    window.browser = {
        storage: {
            local: {
                get: (keys) => new Promise((resolve) => chrome.storage.local.get(keys, resolve)),
                set: (data) => new Promise((resolve) => chrome.storage.local.set(data, resolve)),
                remove: (keys) => new Promise((resolve) => chrome.storage.local.remove(keys, resolve)),
                clear: () => new Promise((resolve) => chrome.storage.local.clear(resolve))
            }
        }
    };
}