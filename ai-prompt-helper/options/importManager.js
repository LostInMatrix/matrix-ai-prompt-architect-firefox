'use strict';

class ImportManager {
    constructor() {
        this.defaultIcon = '📝';
    }

    async processImport(fileContent, targetCategoryId = null) {
        const data = this.validateImportData(fileContent);

        if (data.category) {
            return await this.importCategoryWithPhrases(data);
        } else {
            return await this.importPhrasesOnly(data, targetCategoryId);
        }
    }

    validateImportData(fileContent) {
        let data;
        try {
            data = JSON.parse(fileContent);
        } catch (error) {
            throw new Error('Invalid JSON format');
        }

        if (!data.phrases || !Array.isArray(data.phrases) || data.phrases.length === 0) {
            throw new Error('Import must contain at least one phrase');
        }

        const validTypes = ['workflow', 'phrase', 'system'];

        data.phrases.forEach((phrase, index) => {
            if (!phrase.label || !phrase.label.trim()) {
                throw new Error(`Phrase ${index + 1} is missing a label`);
            }
            if (!phrase.content || !phrase.content.trim()) {
                throw new Error(`Phrase ${index + 1} is missing content`);
            }
            if (!phrase.type || !validTypes.includes(phrase.type)) {
                throw new Error(`Phrase ${index + 1} must have a valid type: ${validTypes.join(', ')}`);
            }
        });

        if (data.category) {
            if (!data.category.name || !data.category.name.trim()) {
                throw new Error('Category is missing a name');
            }
            if (!data.category.icon) {
                data.category.icon = this.defaultIcon;
            }
        }

        return data;
    }

    async importCategoryWithPhrases(data) {
        const categoryName = data.category.name.trim();
        const categoryId = this.generateCategoryId(categoryName);

        await this.checkCategoryConflicts(categoryId, categoryName);

        const { atomicPhrases, buttonDefinitions } = await this.prepareButtonDefinitions(data.phrases, categoryId);

        const result = await browser.storage.local.get(['aiPromptHelperCategories', 'promptHelperCustomPhrases', 'promptHelperUserButtons']);
        const categories = result.aiPromptHelperCategories || {};
        const customPhrases = result.promptHelperCustomPhrases || {};
        const userButtons = result.promptHelperUserButtons || {};

        categories[categoryId] = {
            id: categoryId,
            name: categoryName,
            icon: data.category.icon
        };

        atomicPhrases.forEach(phrase => {
            customPhrases[phrase.id] = phrase.data;
        });

        buttonDefinitions.forEach(button => {
            userButtons[button.id] = button.data;
        });

        await browser.storage.local.set({
            aiPromptHelperCategories: categories,
            promptHelperCustomPhrases: customPhrases,
            promptHelperUserButtons: userButtons
        });

        return {
            success: true,
            categoryName: categoryName,
            phrasesCount: buttonDefinitions.length
        };
    }

    async importPhrasesOnly(data, targetCategoryId) {
        if (!targetCategoryId) {
            throw new Error('Target category must be selected for phrases-only import');
        }

        const { atomicPhrases, buttonDefinitions } = await this.prepareButtonDefinitions(data.phrases, targetCategoryId);

        const result = await browser.storage.local.get(['promptHelperCustomPhrases', 'promptHelperUserButtons']);
        const customPhrases = result.promptHelperCustomPhrases || {};
        const userButtons = result.promptHelperUserButtons || {};

        atomicPhrases.forEach(phrase => {
            customPhrases[phrase.id] = phrase.data;
        });

        buttonDefinitions.forEach(button => {
            userButtons[button.id] = button.data;
        });

        await browser.storage.local.set({
            promptHelperCustomPhrases: customPhrases,
            promptHelperUserButtons: userButtons
        });

        return {
            success: true,
            phrasesCount: buttonDefinitions.length
        };
    }

    async prepareButtonDefinitions(phrasesArray, categoryId) {
        const result = await browser.storage.local.get(['promptHelperCustomPhrases', 'promptHelperUserButtons']);
        const existingPhrases = result.promptHelperCustomPhrases || {};
        const existingButtons = result.promptHelperUserButtons || {};

        const atomicPhrases = [];
        const buttonDefinitions = [];

        for (const phrase of phrasesArray) {
            const atomicId = this.generatePhraseId(phrase.label);
            const buttonId = this.generateButtonId(phrase.label);

            if (existingPhrases[atomicId]) {
                throw new Error(`Atomic phrase "${phrase.label}" already exists`);
            }

            if (existingButtons[buttonId]) {
                throw new Error(`Button "${phrase.label}" already exists`);
            }

            atomicPhrases.push({
                id: atomicId,
                data: {
                    content: phrase.content.trim(),
                    label: atomicId,
                    isAtomicOverride: true
                }
            });

            buttonDefinitions.push({
                id: buttonId,
                data: {
                    label: phrase.label.trim(),
                    type: phrase.type,
                    atomicPhraseIds: [atomicId],
                    categoryId: categoryId,
                    isUserButton: true
                }
            });
        }

        return { atomicPhrases, buttonDefinitions };
    }

    async checkCategoryConflicts(categoryId, categoryName) {
        const result = await browser.storage.local.get('aiPromptHelperCategories');
        const categories = result.aiPromptHelperCategories || {};
        const defaultCategories = window.aiPromptHelper?.categories || {};

        if (categories[categoryId] || defaultCategories[categoryId]) {
            throw new Error(`Category ID "${categoryId}" already exists`);
        }

        const allCategories = { ...defaultCategories, ...categories };
        for (const category of Object.values(allCategories)) {
            if (category.name === categoryName) {
                throw new Error(`Category name "${categoryName}" already exists`);
            }
        }
    }

    generateCategoryId(categoryName) {
        return categoryName.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    }

    generatePhraseId(phraseLabel) {
        return phraseLabel.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    }

    generateButtonId(phraseLabel) {
        return 'btn_' + phraseLabel.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    }
}

window.ImportManager = ImportManager;