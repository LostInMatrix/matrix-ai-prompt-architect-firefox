'use strict';

const STORAGE_KEY_BUTTON_STATUS = 'promptHelperButtonStatus';
const STORAGE_KEY_CUSTOM_PHRASES = 'promptHelperCustomPhrases';
const STORAGE_KEY_USER_BUTTONS = 'promptHelperUserButtons';
const STORAGE_KEY_ADDENDUM_SETTINGS = 'promptHelperAddendumSettings';

const addCustomPhraseForm = document.getElementById('addCustomPhraseForm');
const phraseIdInput = document.getElementById('phraseId');
const phraseLabelInput = document.getElementById('phraseLabel');
const phraseContentInput = document.getElementById('phraseContent');
const addPhraseButton = document.getElementById('addPhraseButton');
const statusMessage = document.getElementById('phraseStatusMessage');
const slidePanel = document.getElementById('slidePanel');
const panelOverlay = document.getElementById('panelOverlay');
const slidePanelTitle = document.getElementById('slidePanelTitle');
const closePanelBtn = document.getElementById('closePanelBtn');
const slidePanelContent = document.querySelector('.slide-panel-content');
const EXPORT_BTN_ID = 'exportPhrasesBtn';
const EXPORT_CATEGORY_SELECT_ID = 'exportCategorySelect';
const toggleAddPhraseFormBtn = document.getElementById('toggleAddPhraseForm');
const categoryTabsContainer = document.getElementById('categoryTabsContainer');
const categoryPanelsContainer = document.getElementById('categoryPanelsContainer');
let currentActiveCategoryId = null;


function loadInitialData() {
    console.log("Initial data check/load (if necessary)...");
    const categorySelect = document.getElementById('phraseCategorySelect');
    if (categorySelect) {
        populateCategoryDropdown(categorySelect);
    }
}

function displayButtonGroup(buttons, statuses, container) {
    buttons.forEach(button => {
        const enabled = statuses[button.label] !== false;

        const buttonRow = document.createElement('div');
        buttonRow.className = 'phrase-row';

        const labelElement = document.createElement('div');
        labelElement.className = 'column column-label';
        labelElement.textContent = button.label;

        const badgeColumn = document.createElement('div');
        badgeColumn.className = 'column column-badge';
        const badge = document.createElement('span');
        badge.className = 'badge';
        if (button.type === 'system') {
            badge.classList.add('system');
            badge.textContent = 'system';
        } else if (button.type === 'workflow') {
            badge.classList.add('workflow');
            badge.textContent = 'workflow';
        } else {
            badge.classList.add('phrase');
            badge.textContent = 'phrase';
        }
        badgeColumn.appendChild(badge);

        const previewColumn = document.createElement('div');
        previewColumn.className = 'column column-preview';
        const phrasesPreview = document.createElement('div');
        phrasesPreview.className = 'phrases-list-preview';
        if (button.atomicPhraseIds && button.atomicPhraseIds.length > 0) {
            const phrasesList = document.createElement('ul');
            button.atomicPhraseIds.forEach(id => {
                const atomicPhraseContent = window.aiPromptHelper?.phrases?.atomicPhrases?.[id];
                if (atomicPhraseContent) {
                    const phraseItem = document.createElement('li');
                    phraseItem.textContent = atomicPhraseContent;
                    phraseItem.title = atomicPhraseContent;
                    phrasesList.appendChild(phraseItem);
                } else {
                    console.warn(`Atomic phrase ID "${id}" not found for button "${button.label}"`);
                }
            });
            phrasesPreview.appendChild(phrasesList);
        }
        previewColumn.appendChild(phrasesPreview);

        const toggleColumn = document.createElement('div');
        toggleColumn.className = 'column column-toggle';
        const toggleLabel = document.createElement('label');
        toggleLabel.className = 'switch';
        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = enabled;
        toggleInput.addEventListener('change', () => {
            updateButtonStatus(button.label, toggleInput.checked);
        });
        const toggleSlider = document.createElement('span');
        toggleSlider.className = 'slider';
        toggleLabel.appendChild(toggleInput);
        toggleLabel.appendChild(toggleSlider);
        toggleColumn.appendChild(toggleLabel);

        buttonRow.appendChild(labelElement);
        buttonRow.appendChild(badgeColumn);
        buttonRow.appendChild(previewColumn);
        buttonRow.appendChild(toggleColumn);

        container.appendChild(buttonRow);
    });
}

function displayCustomPhrases(phrases, container) {

    Object.keys(phrases).forEach(id => {
        const phraseData = phrases[id];

        if (phraseData.isAtomicOverride) {
            return;
        }

        const phraseRow = document.createElement('div');
        phraseRow.className = 'phrase-row';

        const labelElement = document.createElement('div');
        labelElement.className = 'column column-label';
        labelElement.textContent = phraseData.label || id;
        labelElement.dataset.id = id;

        const badgeColumn = document.createElement('div');
        badgeColumn.className = 'column column-badge';
        const badge = document.createElement('span');
        badge.className = 'badge phrase';
        badge.textContent = 'custom';
        badgeColumn.appendChild(badge);

        const previewColumn = document.createElement('div');
        previewColumn.className = 'column column-preview';
        const contentPreview = document.createElement('div');
        contentPreview.className = 'phrase-preview';
        contentPreview.textContent = phraseData.content;
        contentPreview.title = phraseData.content;
        previewColumn.appendChild(contentPreview);

        const actionColumn = document.createElement('div');
        actionColumn.className = 'column column-toggle';
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'phrase-actions';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', () => {
            editCustomPhrase(id, phraseData);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => {
            deleteCustomPhrase(id);
        });

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        actionColumn.appendChild(buttonContainer);

        phraseRow.appendChild(labelElement);
        phraseRow.appendChild(badgeColumn);
        phraseRow.appendChild(previewColumn);
        phraseRow.appendChild(actionColumn);

        container.appendChild(phraseRow);
    });
}

function displayUserButtonGroup(buttons, statuses, container, allAtomicPhrases, customPhrases) {
    buttons.forEach(button => {
        const enabled = statuses[button.label] !== false;

        const buttonRow = document.createElement('div');
        buttonRow.className = 'phrase-row';

        const labelElement = document.createElement('div');
        labelElement.className = 'column column-label';
        labelElement.textContent = button.label;

        const badgeColumn = document.createElement('div');
        badgeColumn.className = 'column column-badge';
        const badge = document.createElement('span');
        badge.className = 'badge';
        if (button.type === 'system') {
            badge.classList.add('system');
            badge.textContent = 'imported system';
        } else if (button.type === 'workflow') {
            badge.classList.add('workflow');
            badge.textContent = 'imported workflow';
        } else {
            badge.classList.add('phrase');
            badge.textContent = 'imported phrase';
        }
        badgeColumn.appendChild(badge);

        const previewColumn = document.createElement('div');
        previewColumn.className = 'column column-preview';
        const phrasesPreview = document.createElement('div');
        phrasesPreview.className = 'phrases-list-preview';
        if (button.atomicPhraseIds && button.atomicPhraseIds.length > 0) {
            const phrasesList = document.createElement('ul');
            button.atomicPhraseIds.forEach(id => {
                let atomicPhraseContent = allAtomicPhrases[id];
                if (!atomicPhraseContent && customPhrases[id] && customPhrases[id].isAtomicOverride) {
                    atomicPhraseContent = customPhrases[id].content;
                }
                if (atomicPhraseContent) {
                    const phraseItem = document.createElement('li');
                    phraseItem.textContent = atomicPhraseContent;
                    phraseItem.title = atomicPhraseContent;
                    phrasesList.appendChild(phraseItem);
                } else {
                    console.warn(`Atomic phrase ID "${id}" not found for button "${button.label}"`);
                }
            });
            phrasesPreview.appendChild(phrasesList);
        }
        previewColumn.appendChild(phrasesPreview);

        const toggleColumn = document.createElement('div');
        toggleColumn.className = 'column column-toggle';
        const toggleLabel = document.createElement('label');
        toggleLabel.className = 'switch';
        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = enabled;
        toggleInput.addEventListener('change', () => {
            updateButtonStatus(button.label, toggleInput.checked);
        });
        const toggleSlider = document.createElement('span');
        toggleSlider.className = 'slider';
        toggleLabel.appendChild(toggleInput);
        toggleLabel.appendChild(toggleSlider);
        toggleColumn.appendChild(toggleLabel);

        buttonRow.appendChild(labelElement);
        buttonRow.appendChild(badgeColumn);
        buttonRow.appendChild(previewColumn);
        buttonRow.appendChild(toggleColumn);

        container.appendChild(buttonRow);
    });
}

function displayAtomicPhrases(atomicPhrases, customPhrases, container, phraseIdsToShow = null) {

    let phraseEntries = Object.entries(atomicPhrases);

    if (phraseIdsToShow && phraseIdsToShow instanceof Set) {
        phraseEntries = phraseEntries.filter(([id]) => phraseIdsToShow.has(id));
    } else {
        phraseEntries = [];
    }

    phraseEntries.sort(([idA], [idB]) => idA.localeCompare(idB));

    phraseEntries.forEach(([id, defaultContent]) => {
        const isOverridden = customPhrases[id] && customPhrases[id].isAtomicOverride;
        const currentContent = isOverridden ? customPhrases[id].content : defaultContent;
        const displayLabelText = isOverridden ? customPhrases[id].displayLabel || camelCaseToTitleCase(id) : camelCaseToTitleCase(id);

        const phraseRow = document.createElement('div');
        phraseRow.className = 'phrase-row';
        if (isOverridden) {
            phraseRow.classList.add('overridden-phrase');
        }

        const labelElement = document.createElement('div');
        labelElement.className = 'column column-label';
        labelElement.textContent = displayLabelText;
        labelElement.dataset.id = id;

        const badgeColumn = document.createElement('div');
        badgeColumn.className = 'column column-badge';
        const badge = document.createElement('span');
        badge.className = 'badge phrase';
        badge.textContent = isOverridden ? 'edited' : 'default';
        if (isOverridden) {
            badge.classList.add('edited');
        }
        badgeColumn.appendChild(badge);

        const previewColumn = document.createElement('div');
        previewColumn.className = 'column column-preview';
        const contentPreview = document.createElement('div');
        contentPreview.className = 'phrase-preview';
        contentPreview.textContent = currentContent;
        contentPreview.title = currentContent;
        previewColumn.appendChild(contentPreview);

        const actionColumn = document.createElement('div');
        actionColumn.className = 'column column-toggle';
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'phrase-actions';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', () => {
            editAtomicPhrase(id, currentContent);
        });
        buttonContainer.appendChild(editButton);

        if (isOverridden) {
            const resetButton = document.createElement('button');
            resetButton.textContent = 'Reset';
            resetButton.className = 'reset-btn';
            resetButton.addEventListener('click', () => {
                resetAtomicPhrase(id);
            });
            buttonContainer.appendChild(resetButton);
        }

        actionColumn.appendChild(buttonContainer);

        phraseRow.appendChild(labelElement);
        phraseRow.appendChild(badgeColumn);
        phraseRow.appendChild(previewColumn);
        phraseRow.appendChild(actionColumn);

        container.appendChild(phraseRow);
    });
}


function updateButtonStatus(label, enabled) {
    browser.storage.local.get({
        [STORAGE_KEY_BUTTON_STATUS]: {}
    }).then(result => {
        const statuses = result[STORAGE_KEY_BUTTON_STATUS];
        statuses[label] = enabled;
        browser.storage.local.set({
            [STORAGE_KEY_BUTTON_STATUS]: statuses
        }).then(() => {
            showStatus(`${label} ${enabled ? 'enabled' : 'disabled'}`);
        });
    });
}

function addCustomPhrase(event) {
    event.preventDefault();

    let id = phraseIdInput.value.trim();
    const label = phraseLabelInput.value.trim();
    const content = phraseContentInput.value.trim();
    const categorySelect = document.getElementById('phraseCategorySelect');
    const categoryId = categorySelect ? categorySelect.value : '';

    if (!id && label) {
        id = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }

    if (!id) {
        showStatus('Cannot create phrase without a Label (used to generate ID)', true);
        return;
    }
    if (!content || !label || !categoryId) {
        showStatus('Label, content, and category are required', true);
        return;
    }

    browser.storage.local.get({
        [STORAGE_KEY_CUSTOM_PHRASES]: {}
    }).then(result => {
        const customPhrases = result[STORAGE_KEY_CUSTOM_PHRASES];

        customPhrases[id] = {
            content: content,
            label: label,
            categoryId: categoryId,
            isAtomicOverride: false
        };

        browser.storage.local.set({
            [STORAGE_KEY_CUSTOM_PHRASES]: customPhrases
        }).then(() => {
            showStatus(`Custom phrase "${label}" added`);
            closeSlidePanel();
            if (currentActiveCategoryId === categoryId) {
                renderPanelContent(categoryId);
            }
        });
    });
}

function editCustomPhrase(id, phraseData) {
    if (!slidePanelContent.contains(addCustomPhraseForm)) {
        slidePanelContent.innerHTML = '';
        slidePanelContent.appendChild(addCustomPhraseForm);
    }

    phraseIdInput.value = id;
    phraseContentInput.value = phraseData.content;
    phraseLabelInput.value = phraseData.label || id;
    phraseLabelInput.disabled = false;

    addCustomPhraseForm.classList.remove('editing-atomic');

    openSlidePanel('Edit Custom Phrase');
    addPhraseButton.textContent = 'Update Phrase';

    const categorySelect = document.getElementById('phraseCategorySelect');
    if (categorySelect) {
        populateCategoryDropdown(categorySelect);

        setTimeout(() => {
            categorySelect.value = phraseData.categoryId || '';
            categorySelect.disabled = false;
        }, 50);
    }

    addCustomPhraseForm.onsubmit = function(event) {
        event.preventDefault();
        const updatedContent = phraseContentInput.value.trim();
        const updatedLabel = phraseLabelInput.value.trim();
        const updatedCategoryId = categorySelect ? categorySelect.value : '';

        if (!updatedContent || !updatedLabel || !updatedCategoryId) {
            showStatus('Label, content, and category are required', true);
            return;
        }

        browser.storage.local.get({[STORAGE_KEY_CUSTOM_PHRASES]: {}}).then(result => {
            const customPhrases = result[STORAGE_KEY_CUSTOM_PHRASES];

            const existingData = customPhrases[id] || {};

            customPhrases[id] = {
                ...existingData,
                content: updatedContent,
                label: updatedLabel,
                categoryId: updatedCategoryId,
                isAtomicOverride: false
            };

            browser.storage.local.set({[STORAGE_KEY_CUSTOM_PHRASES]: customPhrases}).then(() => {
                showStatus(`Custom phrase "${updatedLabel}" updated`);
                closeSlidePanel();
                if (currentActiveCategoryId === updatedCategoryId) {
                    renderPanelContent(updatedCategoryId);
                } else {
                    if(currentActiveCategoryId){
                        renderPanelContent(currentActiveCategoryId);
                    }
                }
            }).catch(error => {
                console.error("Error saving updated custom phrase:", error);
                showStatus(`Error saving phrase: ${error.message}`, true);
            });
        }).catch(error => {
            console.error("Error fetching custom phrases for update:", error);
            showStatus(`Error fetching data: ${error.message}`, true);
        });
    };
}


function deleteCustomPhrase(id) {
    browser.storage.local.get({[STORAGE_KEY_CUSTOM_PHRASES]: {}}).then(result => {
        const phraseData = result[STORAGE_KEY_CUSTOM_PHRASES]?.[id];
        const label = phraseData?.label || id;

        if (!confirm(`Are you sure you want to delete the custom phrase "${label}"?`)) {
            return;
        }

        const customPhrases = result[STORAGE_KEY_CUSTOM_PHRASES];
        if (customPhrases[id]) {
            const categoryId = customPhrases[id].categoryId;
            delete customPhrases[id];

            browser.storage.local.set({[STORAGE_KEY_CUSTOM_PHRASES]: customPhrases})
                .then(() => {
                    showStatus(`Custom phrase "${label}" deleted`);
                    if (currentActiveCategoryId === categoryId) {
                        renderPanelContent(categoryId);
                    }
                }).catch(error => {
                console.error("Error deleting custom phrase:", error);
                showStatus(`Error deleting phrase: ${error.message}`, true);
            });
        } else {
            showStatus(`Phrase "${label}" not found for deletion.`, true);
        }
    }).catch(error => {
        console.error("Error fetching custom phrase for deletion:", error);
        showStatus(`Error fetching data: ${error.message}`, true);
    });
}

function editAtomicPhrase(id, currentContent) {
    if (!slidePanelContent.contains(addCustomPhraseForm)) {
        slidePanelContent.innerHTML = '';
        slidePanelContent.appendChild(addCustomPhraseForm);
    }

    phraseIdInput.value = id;
    phraseContentInput.value = currentContent;

    browser.storage.local.get({[STORAGE_KEY_CUSTOM_PHRASES]: {}}).then(result => {
        const customPhrases = result[STORAGE_KEY_CUSTOM_PHRASES] || {};
        const overrideData = customPhrases[id];
        const displayLabel = overrideData?.displayLabel || camelCaseToTitleCase(id);

        phraseLabelInput.value = displayLabel;
        phraseLabelInput.disabled = true;

        addCustomPhraseForm.classList.add('editing-atomic');

        openSlidePanel('Edit Default Phrase');
        addPhraseButton.textContent = 'Update Atomic Phrase';

        const categorySelect = document.getElementById('phraseCategorySelect');
        if (categorySelect) {
            categorySelect.value = '';
            categorySelect.disabled = true;
        }

        addCustomPhraseForm.onsubmit = function(event) {
            event.preventDefault();
            const updatedContent = phraseContentInput.value.trim();

            if (!updatedContent) {
                showStatus('Content is required', true);
                return;
            }

            browser.storage.local.get({[STORAGE_KEY_CUSTOM_PHRASES]: {}}).then(res => {
                const phrases = res[STORAGE_KEY_CUSTOM_PHRASES];
                phrases[id] = {
                    content: updatedContent,
                    label: id,
                    displayLabel: displayLabel,
                    isAtomicOverride: true
                };

                browser.storage.local.set({[STORAGE_KEY_CUSTOM_PHRASES]: phrases}).then(() => {
                    showStatus(`Atomic phrase "${displayLabel}" updated`);
                    closeSlidePanel();
                    if (currentActiveCategoryId) {
                        renderPanelContent(currentActiveCategoryId);
                    }
                }).catch(error => {
                    console.error("Error saving atomic phrase override:", error);
                    showStatus(`Error saving override: ${error.message}`, true);
                });
            }).catch(error => {
                console.error("Error fetching phrases before saving atomic override:", error);
                showStatus(`Error fetching data: ${error.message}`, true);
            });
        };
    }).catch(error => {
        console.error("Error fetching override data for editing atomic phrase:", error);
        phraseLabelInput.value = camelCaseToTitleCase(id);
        phraseLabelInput.disabled = true;
        addCustomPhraseForm.classList.add('editing-atomic');
        openSlidePanel('Edit Default Phrase');
        addPhraseButton.textContent = 'Update Atomic Phrase';
        const categorySelect = document.getElementById('phraseCategorySelect');
        if (categorySelect) {
            categorySelect.value = '';
            categorySelect.disabled = true;
        }
    });
}

function resetAtomicPhrase(id) {
    browser.storage.local.get({[STORAGE_KEY_CUSTOM_PHRASES]: {}}).then(result => {
        const customPhrases = result[STORAGE_KEY_CUSTOM_PHRASES] || {};
        const overrideData = customPhrases[id];
        const displayLabel = overrideData?.displayLabel || camelCaseToTitleCase(id);

        if (!confirm(`Are you sure you want to reset the atomic phrase "${displayLabel}" to its default value?`)) {
            return;
        }

        if (overrideData && overrideData.isAtomicOverride) {
            delete customPhrases[id];

            browser.storage.local.set({[STORAGE_KEY_CUSTOM_PHRASES]: customPhrases})
                .then(() => {
                    showStatus(`Atomic phrase "${displayLabel}" reset to default`);
                    if (currentActiveCategoryId) {
                        renderPanelContent(currentActiveCategoryId);
                    }
                }).catch(error => {
                console.error("Error resetting atomic phrase:", error);
                showStatus(`Error resetting phrase: ${error.message}`, true);
            });
        } else {
            showStatus(`Phrase "${displayLabel}" is not currently overridden.`, 'info');
        }
    }).catch(error => {
        console.error("Error fetching phrases for resetting atomic phrase:", error);
        showStatus(`Error fetching data: ${error.message}`, true);
    });
}

function resetForm() {
    phraseIdInput.value = '';
    phraseContentInput.value = '';
    phraseLabelInput.value = '';
    phraseLabelInput.disabled = false;
    addPhraseButton.textContent = 'Add Phrase';
    addCustomPhraseForm.classList.remove('editing-atomic');
    addCustomPhraseForm.onsubmit = addCustomPhrase;

    const categorySelect = document.getElementById('phraseCategorySelect');
    if (categorySelect) {
        populateCategoryDropdown(categorySelect);
        categorySelect.value = '';
        categorySelect.disabled = false;
    }
}

function showStatus(message, type = 'info') {
    switch(type) {
        case 'success': AlertSystem.success(message); break;
        case 'error': AlertSystem.error(message); break;
        case 'warning': AlertSystem.warning(message); break;
        case 'info':
        default: AlertSystem.info(message); break;
    }
}

function camelCaseToTitleCase(camelCase) {
    if (!camelCase) return '';
    const spacedText = camelCase.replace(/([A-Z])/g, ' $1');
    return spacedText.charAt(0).toUpperCase() + spacedText.slice(1)
        .replace(/ A P I/g, ' API')
        .replace(/ J W T/g, ' JWT')
        .replace(/ X S S/g, ' XSS')
        .replace(/ S Q L/g, ' SQL')
        .replace(/ C S R F/g, ' CSRF')
        .replace(/ P S R/g, ' PSR')
        .replace(/ P H P/g, ' PHP')
        .replace(/ E S /g, ' ES ');
}

function getUsedAtomicPhraseIds() {
    const usedIds = new Set();
    const phrasesDef = window.aiPromptHelper?.phrases;
    if (!phrasesDef) return usedIds;

    (phrasesDef.buttonDefinitions || []).forEach(button => {
        button.atomicPhraseIds?.forEach(id => usedIds.add(id));
    });
    return usedIds;
}

function openSlidePanel(title) {
    slidePanelTitle.textContent = title || 'Add/Edit Phrase';
    slidePanel.classList.add('active');
    panelOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    const isEditingAtomic = addCustomPhraseForm.classList.contains('editing-atomic');
    const categorySelect = document.getElementById('phraseCategorySelect');

    if (!isEditingAtomic && categorySelect) {
        const phraseId = phraseIdInput.value;
        if (!phraseId && currentActiveCategoryId) {
            categorySelect.value = currentActiveCategoryId;
        }
    }
}


function closeSlidePanel() {
    slidePanel.classList.remove('active');
    panelOverlay.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
        slidePanelContent.innerHTML = '';
    }, 300);

    resetForm();
}


async function renderPanelContent(categoryId, panelElement = null) {
    const panel = panelElement || document.querySelector(`.category-panel[data-category-id="${categoryId}"]`);

    if (!panel) {
        console.error(`[Debug] renderPanelContent: Panel element not found for categoryId: ${categoryId}`);
        return;
    }

    panel.innerHTML = '<p>Loading...</p>';

    try {
        const result = await browser.storage.local.get('aiPromptHelperCategories');
        const userCategories = result.aiPromptHelperCategories || {};
        const isUserCategory = !!userCategories[categoryId];

        const phrasesDef = window.aiPromptHelper?.phrases || {};
        const defaultButtonDefinitions = (phrasesDef.buttonDefinitions || []).filter(btn => btn.type !== 'system');
        const systemInstructionButtonDefinitions = (phrasesDef.buttonDefinitions || []).filter(btn => btn.type === 'system');
        const allAtomicPhrases = phrasesDef.atomicPhrases || {};

        const buttonData = await browser.storage.local.get({
            [STORAGE_KEY_BUTTON_STATUS]: {},
            [STORAGE_KEY_CUSTOM_PHRASES]: {},
            [STORAGE_KEY_USER_BUTTONS]: {}
        });
        const buttonStatuses = buttonData[STORAGE_KEY_BUTTON_STATUS];
        const customPhrases = buttonData[STORAGE_KEY_CUSTOM_PHRASES];
        const userButtons = buttonData[STORAGE_KEY_USER_BUTTONS];

        panel.innerHTML = '';

        await createAddendumSettingsUI(panel, categoryId);

        if (isUserCategory) {
            const deleteContainer = document.createElement('div');
            deleteContainer.className = 'category-delete-container';

            const categoryName = userCategories[categoryId].name;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-category-btn';
            deleteBtn.textContent = `Delete "${categoryName}" Category`;
            deleteBtn.onclick = () => deleteUserCategory(categoryId, categoryName);

            deleteContainer.appendChild(deleteBtn);
            panel.appendChild(deleteContainer);
        }

        async function createAddendumSettingsUI(panel, categoryId) {
            const result = await browser.storage.local.get([STORAGE_KEY_ADDENDUM_SETTINGS]);
            const addendumSettings = result[STORAGE_KEY_ADDENDUM_SETTINGS] || {};
            const categorySettings = addendumSettings[categoryId] || {};

            const phrasesDef = window.aiPromptHelper?.phrases || {};
            const defaultButtons = (phrasesDef.buttonDefinitions || []).filter(btn => btn.categoryId === categoryId);
            const userButtons = await browser.storage.local.get([STORAGE_KEY_USER_BUTTONS]);
            const categoryUserButtons = Object.values(userButtons[STORAGE_KEY_USER_BUTTONS] || {}).filter(btn => btn.categoryId === categoryId);

            const hasWorkflows = [...defaultButtons, ...categoryUserButtons].some(btn => btn.type === 'workflow');
            const hasSystemInstructions = [...defaultButtons, ...categoryUserButtons].some(btn => btn.type === 'system');

            if (!hasWorkflows && !hasSystemInstructions) return;

            const addendumContainer = document.createElement('div');
            addendumContainer.className = 'addendum-settings-container';
            addendumContainer.style.cssText = 'padding: 12px; background-color: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 15px;';

            const addendumTitleContainer = document.createElement('div');
            addendumTitleContainer.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin: 0 0 12px 0;';

            const addendumTitle = document.createElement('h4');
            addendumTitle.textContent = 'Enhancement Settings';
            addendumTitle.style.cssText = 'margin: 0; font-size: 14px; font-weight: 500; color: #333;';

            const helpIcon = document.createElement('span');
            helpIcon.textContent = '?';
            helpIcon.title = 'Automatically append motivational language or refocus instructions to your prompts. Workflows can be enhanced based on position (first/mid/last), while system instructions apply globally.';
            helpIcon.style.cssText = 'width: 16px; height: 16px; border-radius: 50%; background-color: #666; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; cursor: help; opacity: 0.7; transition: opacity 0.2s;';
            helpIcon.addEventListener('mouseenter', () => helpIcon.style.opacity = '1');
            helpIcon.addEventListener('mouseleave', () => helpIcon.style.opacity = '0.7');

            addendumTitleContainer.appendChild(addendumTitle);
            addendumTitleContainer.appendChild(helpIcon);
            addendumContainer.appendChild(addendumTitleContainer);

            if (hasWorkflows) {
                const workflowSection = document.createElement('div');
                workflowSection.style.marginBottom = '12px';

                const workflowLabel = document.createElement('div');
                workflowLabel.textContent = 'Workflow Enhancement:';
                workflowLabel.style.cssText = 'font-weight: 500; margin-bottom: 6px; font-size: 13px;';
                workflowSection.appendChild(workflowLabel);

                const currentPreset = getWorkflowPreset(categorySettings.workflows || {});

                const presetContainer = document.createElement('div');
                presetContainer.style.cssText = 'display: flex; gap: 15px; margin-bottom: 8px; flex-wrap: wrap;';

                ['none', 'light', 'standard', 'heavy', 'maximum'].forEach(preset => {
                    const presetLabel = document.createElement('label');
                    presetLabel.style.cssText = 'display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;';

                    const presetRadio = document.createElement('input');
                    presetRadio.type = 'radio';
                    presetRadio.name = `workflow-preset-${categoryId}`;
                    presetRadio.value = preset;
                    presetRadio.checked = currentPreset === preset;
                    presetRadio.addEventListener('change', () => applyWorkflowPreset(categoryId, preset));

                    presetLabel.appendChild(presetRadio);
                    presetLabel.appendChild(document.createTextNode(preset.charAt(0).toUpperCase() + preset.slice(1)));
                    presetContainer.appendChild(presetLabel);
                });

                workflowSection.appendChild(presetContainer);

                const advancedToggle = document.createElement('button');
                advancedToggle.textContent = '⚙️ Advanced';
                advancedToggle.style.cssText = 'background: none; border: 1px solid #666; border-radius: 3px; padding: 2px 6px; font-size: 11px; cursor: pointer; margin-bottom: 8px;';
                advancedToggle.onclick = () => toggleAdvancedWorkflow(categoryId);
                workflowSection.appendChild(advancedToggle);

                const advancedSection = document.createElement('div');
                advancedSection.id = `workflow-advanced-${categoryId}`;
                const workflowShouldBeOpen = window.promptHelperAdvancedState?.[categoryId]?.workflow || false;
                advancedSection.style.display = workflowShouldBeOpen ? 'block' : 'none';

                ['realign', 'rewards', 'penalties', 'empathy', 'authority', 'completeness', 'urgency', 'duty', 'precision', 'socialProof', 'reputation'].forEach(type => {
                    const typeContainer = document.createElement('div');
                    typeContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 4px; gap: 12px;';

                    const typeLabel = document.createElement('span');
                    typeLabel.textContent = type.charAt(0).toUpperCase() + type.slice(1) + ':';
                    typeLabel.style.cssText = 'min-width: 80px; font-size: 11px; cursor: help; border-bottom: 1px dashed #666; text-decoration: none;';
                    typeLabel.className = 'addendum-label';

                    const atomicPhrases = window.aiPromptHelper?.phrases?.atomicPhrases || {};
                    const phraseKey = type === 'rewards' ? 'ruleTipMotivation' : `addendum${type.charAt(0).toUpperCase() + type.slice(1)}`;
                    const phraseContent = atomicPhrases[phraseKey];
                    if (phraseContent) {
                        typeLabel.title = `Phrase appended: "${phraseContent}"`;
                    }

                    typeContainer.appendChild(typeLabel);

                    const positions = ['first', 'mid', 'last'];
                    positions.forEach(position => {
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = `workflow-${type}-${position}-${categoryId}`;
                        checkbox.checked = categorySettings.workflows?.[type]?.[position] || false;

                        if (type === 'realign' && position === 'first') {
                            checkbox.disabled = true;
                            checkbox.checked = false;
                        } else {
                            checkbox.addEventListener('change', () => saveAddendumSetting(categoryId, 'workflows', type, position, checkbox.checked));
                        }

                        const label = document.createElement('label');
                        label.htmlFor = checkbox.id;
                        label.style.cssText = `display: flex; align-items: center; gap: 2px; font-size: 10px; cursor: ${checkbox.disabled ? 'not-allowed' : 'pointer'}; opacity: ${checkbox.disabled ? '0.5' : '1'};`;
                        label.appendChild(checkbox);
                        label.appendChild(document.createTextNode(position.charAt(0).toUpperCase() + position.slice(1)));

                        typeContainer.appendChild(label);
                    });

                    advancedSection.appendChild(typeContainer);
                });

                workflowSection.appendChild(advancedSection);
                addendumContainer.appendChild(workflowSection);
            }

            if (hasSystemInstructions) {
                const systemSection = document.createElement('div');

                const systemLabel = document.createElement('div');
                systemLabel.textContent = 'System Instruction Enhancement:';
                systemLabel.style.cssText = 'font-weight: 500; margin-bottom: 6px; font-size: 13px;';
                systemSection.appendChild(systemLabel);

                const currentSystemPreset = getSystemPreset(categorySettings.systemInstructions || {});

                const systemPresetContainer = document.createElement('div');
                systemPresetContainer.style.cssText = 'display: flex; gap: 15px; margin-bottom: 8px; flex-wrap: wrap;';

                ['none', 'light', 'standard', 'heavy', 'maximum'].forEach(preset => {
                    const presetLabel = document.createElement('label');
                    presetLabel.style.cssText = 'display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;';

                    const presetRadio = document.createElement('input');
                    presetRadio.type = 'radio';
                    presetRadio.name = `system-preset-${categoryId}`;
                    presetRadio.value = preset;
                    presetRadio.checked = currentSystemPreset === preset;
                    presetRadio.addEventListener('change', () => applySystemPreset(categoryId, preset));

                    presetLabel.appendChild(presetRadio);
                    presetLabel.appendChild(document.createTextNode(preset.charAt(0).toUpperCase() + preset.slice(1)));
                    systemPresetContainer.appendChild(presetLabel);
                });

                systemSection.appendChild(systemPresetContainer);

                const systemAdvancedToggle = document.createElement('button');
                systemAdvancedToggle.textContent = '⚙️ Advanced';
                systemAdvancedToggle.style.cssText = 'background: none; border: 1px solid #666; border-radius: 3px; padding: 2px 6px; font-size: 11px; cursor: pointer; margin-bottom: 8px;';
                systemAdvancedToggle.onclick = () => toggleAdvancedSystem(categoryId);
                systemSection.appendChild(systemAdvancedToggle);

                const systemAdvancedSection = document.createElement('div');
                systemAdvancedSection.id = `system-advanced-${categoryId}`;
                const systemShouldBeOpen = window.promptHelperAdvancedState?.[categoryId]?.system || false;
                systemAdvancedSection.style.display = systemShouldBeOpen ? 'block' : 'none';

                ['rewards', 'penalties', 'empathy', 'authority', 'completeness', 'urgency', 'duty', 'precision', 'socialProof', 'reputation'].forEach(type => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `system-${type}-${categoryId}`;
                    checkbox.checked = categorySettings.systemInstructions?.[type] || false;
                    checkbox.addEventListener('change', () => saveAddendumSetting(categoryId, 'systemInstructions', type, null, checkbox.checked));

                    const labelText = document.createElement('span');
                    labelText.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                    labelText.style.cssText = 'cursor: help; border-bottom: 1px dashed #666; text-decoration: none;';
                    labelText.className = 'addendum-label';

                    const atomicPhrases = window.aiPromptHelper?.phrases?.atomicPhrases || {};
                    const phraseKey = type === 'rewards' ? 'ruleTipMotivation' : `addendum${type.charAt(0).toUpperCase() + type.slice(1)}`;
                    const phraseContent = atomicPhrases[phraseKey];
                    if (phraseContent) {
                        labelText.title = `Phrase appended: "${phraseContent}"`;
                    }

                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 11px; cursor: pointer; margin-bottom: 4px;';
                    label.appendChild(checkbox);
                    label.appendChild(labelText);

                    systemAdvancedSection.appendChild(label);
                });

                systemSection.appendChild(systemAdvancedSection);
                addendumContainer.appendChild(systemSection);
            }

            panel.appendChild(addendumContainer);
        }

        async function saveAddendumSetting(categoryId, contentType, addendumType, position, enabled) {
            const workflowAdvancedOpen = document.getElementById(`workflow-advanced-${categoryId}`)?.style.display === 'block';
            const systemAdvancedOpen = document.getElementById(`system-advanced-${categoryId}`)?.style.display === 'block';

            const result = await browser.storage.local.get([STORAGE_KEY_ADDENDUM_SETTINGS]);
            const addendumSettings = result[STORAGE_KEY_ADDENDUM_SETTINGS] || {};

            if (!addendumSettings[categoryId]) {
                addendumSettings[categoryId] = {};
            }
            if (!addendumSettings[categoryId][contentType]) {
                addendumSettings[categoryId][contentType] = {};
            }

            if (contentType === 'workflows') {
                if (!addendumSettings[categoryId][contentType][addendumType]) {
                    addendumSettings[categoryId][contentType][addendumType] = {};
                }
                addendumSettings[categoryId][contentType][addendumType][position] = enabled;
            } else {
                addendumSettings[categoryId][contentType][addendumType] = enabled;
            }

            await browser.storage.local.set({[STORAGE_KEY_ADDENDUM_SETTINGS]: addendumSettings});

            window.promptHelperAdvancedState = window.promptHelperAdvancedState || {};
            window.promptHelperAdvancedState[categoryId] = {
                workflow: workflowAdvancedOpen,
                system: systemAdvancedOpen
            };

            renderPanelContent(categoryId);
        }

        let usedAtomicIds = new Set();

        const createSection = (title, items, displayFunc) => {
            if (items.length > 0) {
                const header = document.createElement('h4');
                header.textContent = title;
                panel.appendChild(header);
                const listContainer = document.createElement('div');
                listContainer.className = 'phrases-list';
                displayFunc(items, buttonStatuses, listContainer);
                panel.appendChild(listContainer);
                items.forEach(btn => btn.atomicPhraseIds?.forEach(id => usedAtomicIds.add(id)));
            }
        };

        const createCustomSection = (title, phrasesObj, displayFunc) => {
            const phraseKeys = Object.keys(phrasesObj);
            if (phraseKeys.length > 0) {
                const header = document.createElement('h4');
                header.textContent = title;
                panel.appendChild(header);
                const listContainer = document.createElement('div');
                listContainer.className = 'phrases-list';
                displayFunc(phrasesObj, listContainer);
                panel.appendChild(listContainer);
            }
        };

        const categoryDefaultButtons = defaultButtonDefinitions.filter(btn => btn.categoryId === categoryId);
        const categorySystemButtons = systemInstructionButtonDefinitions.filter(btn => btn.categoryId === categoryId);
        const categoryUserButtons = Object.values(userButtons).filter(btn => btn.categoryId === categoryId);
        const categoryCustomPhrases = Object.entries(customPhrases)
            .filter(([id, data]) => data.categoryId === categoryId && !data.isAtomicOverride)
            .reduce((obj, [id, data]) => {
                obj[id] = data;
                return obj;
            }, {});

        const categoryUserWorkflows = categoryUserButtons.filter(btn => btn.type === 'workflow');
        const categoryUserPhrases = categoryUserButtons.filter(btn => btn.type === 'phrase');
        const categoryUserSystem = categoryUserButtons.filter(btn => btn.type === 'system');

        const createUserSection = (title, items) => {
            if (items.length > 0) {
                const header = document.createElement('h4');
                header.textContent = title;
                panel.appendChild(header);
                const listContainer = document.createElement('div');
                listContainer.className = 'phrases-list';
                displayUserButtonGroup(items, buttonStatuses, listContainer, allAtomicPhrases, customPhrases);
                panel.appendChild(listContainer);
                items.forEach(btn => btn.atomicPhraseIds?.forEach(id => usedAtomicIds.add(id)));
            }
        };

        createSection('Default Buttons', categoryDefaultButtons, displayButtonGroup);
        createUserSection('Imported Workflows', categoryUserWorkflows);
        createSection('System Instruction Buttons', categorySystemButtons, displayButtonGroup);
        createUserSection('Imported System Instructions', categoryUserSystem);
        createUserSection('Imported Phrases', categoryUserPhrases);
        createCustomSection('Custom Phrases', categoryCustomPhrases, displayCustomPhrases);

        if (usedAtomicIds.size > 0) {
            const header = document.createElement('h4');
            header.textContent = 'Related Atomic Phrases (Global Edits)';
            panel.appendChild(header);
            const listContainer = document.createElement('div');
            listContainer.className = 'phrases-list';
            displayAtomicPhrases(allAtomicPhrases, customPhrases, listContainer, usedAtomicIds);
            panel.appendChild(listContainer);
        }

        if (panel.childElementCount === (isUserCategory ? 1 : 0)) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No items defined for this category.';
            panel.appendChild(emptyMessage);
        }

    } catch (error) {
        console.error(`Error rendering panel for category ${categoryId}:`, error);
        panel.innerHTML = '<p style="color: red;">Error loading content. Check console.</p>';
        AlertSystem.error(`Failed to load content for ${categoryId}: ${error.message}`);
    }
}

function createTabsAndPanels() {
    loadCategories().then(categories => {
        const categoryIds = Object.keys(categories);

        if (!categoryTabsContainer || !categoryPanelsContainer) {
            console.error("Tab or panel container not found in the DOM.");
            return;
        }

        if (categoryIds.length === 0) {
            categoryTabsContainer.innerHTML = '<p>No categories defined. Create one to get started.</p>';
            return;
        }

        categoryTabsContainer.innerHTML = '';
        categoryPanelsContainer.innerHTML = '';

        const defaultCategoryIds = window.aiPromptHelper?.categories ?
            Object.keys(window.aiPromptHelper.categories) : [];

        categoryIds.forEach((categoryIdKey, index) => {
            const category = categories[categoryIdKey];
            if (!category) return;
            const id = category.id;
            const isUserCategory = !defaultCategoryIds.includes(id);

            const tabButton = document.createElement('button');
            tabButton.className = 'category-tab';
            if (isUserCategory) {
                tabButton.classList.add('user-category-tab');
            }
            tabButton.textContent = `${category.icon || ''} ${category.name}`;
            tabButton.dataset.categoryId = id;
            tabButton.setAttribute('role', 'tab');
            tabButton.setAttribute('aria-controls', `panel-${id}`);
            tabButton.setAttribute('aria-selected', 'false');
            tabButton.id = `tab-${id}`;

            const panelDiv = document.createElement('div');
            panelDiv.className = 'category-panel';
            panelDiv.id = `panel-${id}`;
            panelDiv.dataset.categoryId = id;
            panelDiv.setAttribute('role', 'tabpanel');
            panelDiv.setAttribute('aria-labelledby', `tab-${id}`);

            if (index === 0) {
                tabButton.classList.add('active');
                tabButton.setAttribute('aria-selected', 'true');
                panelDiv.classList.add('active');
                currentActiveCategoryId = id;
                setTimeout(() => {
                    renderPanelContent(id, panelDiv);
                }, 0);
            } else {
                panelDiv.style.display = 'none';
            }

            tabButton.addEventListener('click', () => {
                if (currentActiveCategoryId === id) return;

                const activeTab = categoryTabsContainer.querySelector('.category-tab.active');
                const activePanel = categoryPanelsContainer.querySelector('.category-panel.active');
                if(activeTab) {
                    activeTab.classList.remove('active');
                    activeTab.setAttribute('aria-selected', 'false');
                }
                if(activePanel) {
                    activePanel.classList.remove('active');
                    activePanel.style.display = 'none';
                }

                tabButton.classList.add('active');
                tabButton.setAttribute('aria-selected', 'true');
                panelDiv.classList.add('active');
                panelDiv.style.display = 'block';
                currentActiveCategoryId = id;

                setTimeout(() => {
                    renderPanelContent(id);
                }, 0);
            });

            categoryTabsContainer.appendChild(tabButton);
            categoryPanelsContainer.appendChild(panelDiv);
        });
    });
}

function deleteUserCategory(categoryId, categoryName) {
    if (!confirm(`Are you sure you want to delete the "${categoryName}" category and all its phrases?`)) {
        return;
    }

    browser.storage.local.get(['aiPromptHelperCategories', STORAGE_KEY_CUSTOM_PHRASES]).then(result => {
        const categories = result.aiPromptHelperCategories || {};
        const customPhrases = result[STORAGE_KEY_CUSTOM_PHRASES] || {};

        if (categories[categoryId]) {
            delete categories[categoryId];
        }

        const updatedPhrases = {};
        Object.keys(customPhrases).forEach(id => {
            if (customPhrases[id].categoryId !== categoryId) {
                updatedPhrases[id] = customPhrases[id];
            }
        });

        browser.storage.local.set({
            aiPromptHelperCategories: categories,
            [STORAGE_KEY_CUSTOM_PHRASES]: updatedPhrases
        }).then(() => {
            showStatus(`Category "${categoryName}" and its phrases deleted`);
            createTabsAndPanels();

            if (currentActiveCategoryId === categoryId) {
                const firstTab = categoryTabsContainer.querySelector('.category-tab');
                if (firstTab) {
                    firstTab.click();
                }
            }
        });
    });
}

function initCategoryManagement() {
    const existingSection = document.getElementById('categoryManagementSection');
    existingSection?.remove();

    const categorySection = document.createElement('div');
    categorySection.id = 'categoryManagementSection';
    categorySection.className = 'phrases-container';

    const categoryHeader = document.createElement('h3');
    categoryHeader.textContent = 'Manage Categories';
    categorySection.appendChild(categoryHeader);

    const description = document.createElement('p');
    description.className = 'description';
    description.textContent = 'Delete all custom phrases belonging to a specific category. This does not affect default buttons.';
    categorySection.appendChild(description);

    const categoryContainer = document.createElement('div');
    categoryContainer.style.display = 'flex';
    categoryContainer.style.alignItems = 'center';
    categoryContainer.style.gap = '10px';
    categoryContainer.style.marginBottom = '15px';

    const categorySelect = document.createElement('select');
    categorySelect.id = 'categoryDeleteSelect';
    categorySelect.style.padding = '6px';
    categorySelect.style.borderRadius = '4px';
    categorySelect.style.border = '1px solid #ccc';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a category...';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    categorySelect.appendChild(defaultOption);

    browser.storage.local.get({[STORAGE_KEY_CUSTOM_PHRASES]: {}}).then(result => {
        const currentPhrases = result[STORAGE_KEY_CUSTOM_PHRASES] || {};
        const categoriesInUse = new Set();
        Object.values(currentPhrases).forEach(phrase => {
            if (phrase.categoryId && !phrase.isAtomicOverride) {
                categoriesInUse.add(phrase.categoryId);
            }
        });

        const categoryDefinitions = window.aiPromptHelper?.categories || {};

        Array.from(categoriesInUse).sort().forEach(categoryId => {
            const option = document.createElement('option');
            option.value = categoryId;
            option.textContent = categoryDefinitions[categoryId]?.name || categoryId;
            categorySelect.appendChild(option);
        });
    });

    categoryContainer.appendChild(categorySelect);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Category Phrases';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = function() {
        const selectedCategory = categorySelect.value;
        if (selectedCategory) {
            const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
            deleteCategory(selectedCategory, categoryName);
        } else {
            AlertSystem.error('Please select a category to delete');
        }
    };

    categoryContainer.appendChild(deleteButton);
    categorySection.appendChild(categoryContainer);

    const importExportSection = document.querySelector('.section h2:last-of-type').closest('.section');
    if (importExportSection && importExportSection.parentNode) {
        importExportSection.parentNode.insertBefore(categorySection, importExportSection);
    } else {
        document.querySelector('.container').appendChild(categorySection);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
    createTabsAndPanels();
    initializeDarkMode();

    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    document.getElementById('createCategoryBtn').addEventListener('click', function() {
        resetForm();
        openCategoryCreationPanel();
    });

    document.getElementById('addPhraseBtn').addEventListener('click', function() {
        slidePanelContent.innerHTML = '';
        slidePanelContent.appendChild(addCustomPhraseForm);

        resetForm();
        openSlidePanel('Add New Phrase');

        const categorySelect = document.getElementById('phraseCategorySelect');
        if (categorySelect && currentActiveCategoryId) {
            categorySelect.value = currentActiveCategoryId;
        }

        addPhraseButton.textContent = 'Add Phrase';
        addCustomPhraseForm.onsubmit = addCustomPhrase;
    });

    document.getElementById('importPhrasesBtn').addEventListener('click', function() {
        slidePanelContent.innerHTML = '';
        openImportPanel();
    });

    document.getElementById('exportPhrasesBtn').addEventListener('click', function() {
        slidePanelContent.innerHTML = '';
        openExportPanel();
    });

    slidePanelContent.appendChild(addCustomPhraseForm);
    addCustomPhraseForm.onsubmit = addCustomPhrase;
    closePanelBtn.addEventListener('click', closeSlidePanel);
    panelOverlay.addEventListener('click', closeSlidePanel);

    document.getElementById('cancelButton').addEventListener('click', (e) => {
        e.preventDefault();
        closeSlidePanel();
    });
});

function openImportPanel() {
    slidePanelTitle.textContent = 'Import Phrases';

    const importForm = document.createElement('div');
    importForm.id = 'slidePanelImportForm';
    importForm.className = 'phrase-form';

    importForm.innerHTML = `
        <h4>Import Phrases</h4>
        <div class="form-group">
            <label for="panelImportFile">Select JSON File:</label>
            <input type="file" id="panelImportFile" accept=".json" required>
        </div>
        <div class="form-group" id="panelImportCategoryGroup" style="display: none;">
            <label for="panelImportCategorySelect">Target Category:</label>
            <select id="panelImportCategorySelect">
                <option value="" disabled selected>-- Select target category --</option>
            </select>
        </div>
        <p class="description">Import custom phrases from a JSON file. Categories and phrases must not already exist.</p>
        <div class="form-actions">
            <button type="button" id="panelImportConfirmBtn" disabled>Import</button>
            <button type="button" id="panelCancelImportBtn">Cancel</button>
        </div>
    `;

    slidePanelContent.appendChild(importForm);

    const fileInput = document.getElementById('panelImportFile');
    const categoryGroup = document.getElementById('panelImportCategoryGroup');
    const categorySelect = document.getElementById('panelImportCategorySelect');
    const importBtn = document.getElementById('panelImportConfirmBtn');

    let fileData = null;
    let importData = null;

    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            fileData = await file.text();
            const importManager = new ImportManager();
            importData = importManager.validateImportData(fileData);

            if (importData.category) {
                categoryGroup.style.display = 'none';
                importBtn.disabled = false;
            } else {
                categoryGroup.style.display = 'block';
                populateCategorySelect(categorySelect);
                categorySelect.addEventListener('change', function() {
                    importBtn.disabled = !categorySelect.value;
                });
                importBtn.disabled = true;
            }
        } catch (error) {
            AlertSystem.error(`File validation failed: ${error.message}`);
            importBtn.disabled = true;
            categoryGroup.style.display = 'none';
        }
    });

    importBtn.addEventListener('click', async function() {
        if (!fileData || !importData) {
            AlertSystem.error('Please select a valid file first');
            return;
        }

        try {
            const importManager = new ImportManager();
            const targetCategoryId = categorySelect.value || null;
            const result = await importManager.processImport(fileData, targetCategoryId);

            if (result.success) {
                if (importData.category) {
                    AlertSystem.success(`Successfully imported category "${result.categoryName}" with ${result.phrasesCount} phrases`);
                } else {
                    AlertSystem.success(`Successfully imported ${result.phrasesCount} phrases`);
                }
                closeSlidePanel();
                createTabsAndPanels();
            }
        } catch (error) {
            AlertSystem.error(`Import failed: ${error.message}`);
        }
    });

    document.getElementById('panelCancelImportBtn').addEventListener('click', closeSlidePanel);

    slidePanel.classList.add('active');
    panelOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function populateCategorySelect(selectEl) {
    if (!selectEl) {
        console.warn("Cannot populate null select element");
        return;
    }

    while (selectEl.options.length > 0 && !selectEl.options[0].disabled) {
        selectEl.remove(0);
    }
    while (selectEl.options.length > 1) {
        selectEl.remove(1);
    }

    loadCategories().then(categories => {
        Object.values(categories).forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = `${category.icon || ''} ${category.name}`;
            selectEl.appendChild(option);
        });

        if (!selectEl.style.padding) {
            selectEl.style.padding = "6px";
            selectEl.style.borderRadius = "4px";
            selectEl.style.border = "1px solid var(--border-color)";
            selectEl.style.fontSize = "14px";
            selectEl.style.minWidth = "150px";
        }
    });
}

function openCategoryCreationPanel() {
    slidePanelTitle.textContent = 'Create New Category';
    slidePanelContent.innerHTML = '';

    const categoryForm = document.createElement('form');
    categoryForm.id = 'slidePanelCategoryForm';
    categoryForm.className = 'phrase-form';

    categoryForm.innerHTML = `
        <div class="form-group">
            <label for="panelCategoryName">Category Name:</label>
            <input type="text" id="panelCategoryName" placeholder="Display Name" required>
        </div>
        <div class="form-group">
            <label for="panelCategoryIcon">Icon:</label>
            <select id="panelCategoryIcon" required>
                <option value="📝" selected>📝 Note</option>
                <option value="🔍">🔍 Search</option>
                <option value="⚙️">⚙️ Settings</option>
                <option value="💡">💡 Idea</option>
                <option value="🛠️">🛠️ Tools</option>
                <option value="📊">📊 Data</option>
                <option value="🧠">🧠 AI</option>
                <option value="📚">📚 Learning</option>
                <option value="🎯">🎯 Goal</option>
                <option value="⚡">⚡ Quick</option>
                <option value="🔑">🔑 Key</option>
                <option value="📋">📋 List</option>
                <option value="🏷️">🏷️ Tag</option>
                <option value="🔧">🔧 Fix</option>
            </select>
        </div>
        <div class="form-actions">
            <button type="submit" id="panelCreateCategoryBtn">Create Category</button>
            <button type="button" id="panelCancelBtn">Cancel</button>
        </div>
    `;

    slidePanelContent.innerHTML = '';
    slidePanelContent.appendChild(categoryForm);

    categoryForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const categoryName = document.getElementById('panelCategoryName').value.trim();
        const categoryIcon = document.getElementById('panelCategoryIcon').value.trim();

        if (!categoryName) {
            showStatus('Category Name is required', 'error');
            return;
        }

        const categoryId = categoryName.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');

        if (!categoryId) {
            showStatus('Could not generate valid category ID from name', 'error');
            return;
        }

        createCategoryFromPanel(categoryId, categoryName, categoryIcon);
    });

    document.getElementById('panelCancelBtn').addEventListener('click', closeSlidePanel);

    slidePanel.classList.add('active');
    panelOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function createCategoryFromPanel(categoryId, categoryName, categoryIcon) {
    browser.storage.local.get('aiPromptHelperCategories').then(result => {
        const categories = result.aiPromptHelperCategories || {};

        if (categories[categoryId]) {
            showStatus(`Category "${categoryName}" already exists`, 'error');
            return;
        }

        categories[categoryId] = {
            id: categoryId,
            name: categoryName,
            icon: categoryIcon
        };

        browser.storage.local.set({ aiPromptHelperCategories: categories }).then(() => {
            showStatus(`Category "${categoryName}" created successfully`);
            closeSlidePanel();
            createTabsAndPanels();
            populateCategoryDropdown(document.getElementById('phraseCategorySelect'));
        });
    });
}

function openExportPanel() {
    slidePanelTitle.textContent = 'Export Phrases';

    const exportForm = document.createElement('div');
    exportForm.id = 'slidePanelExportForm';
    exportForm.className = 'phrase-form';

    exportForm.innerHTML = `
        <h4>Export Phrases</h4>
        <div class="form-group">
            <label for="panelExportCategorySelect">Select Category:</label>
            <select id="panelExportCategorySelect" required>
                <option value="" disabled selected>-- Select a category --</option>
            </select>
        </div>
        <div class="form-group">
            <label for="panelExportFormatSelect">Export Format:</label>
            <select id="panelExportFormatSelect" required>
                <option value="simplified" selected>Simplified (Import Compatible)</option>
                <option value="comprehensive">Comprehensive (Full Data)</option>
            </select>
        </div>
        <p class="description">Export your phrases as JSON files to share or backup. Simplified format is compatible with imports.</p>
        <div class="form-actions">
            <button type="button" id="panelExportConfirmBtn">Export</button>
            <button type="button" id="panelCancelExportBtn">Cancel</button>
        </div>
    `;

    slidePanelContent.innerHTML = '';
    slidePanelContent.appendChild(exportForm);

    populateCategorySelect(document.getElementById('panelExportCategorySelect'));

    document.getElementById('panelExportConfirmBtn').addEventListener('click', function() {
        const categorySelect = document.getElementById('panelExportCategorySelect');
        const formatSelect = document.getElementById('panelExportFormatSelect');

        if (!categorySelect || !categorySelect.value) {
            AlertSystem.error("Please select a category to export.");
            return;
        }

        const categoryId = categorySelect.value;
        const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
        const format = formatSelect.value;

        if (format === 'simplified') {
            exportPhrasesSimplified(categoryId, categoryName);
        } else {
            exportPhrasesFromPanel(categoryId, categoryName);
        }
    });

    document.getElementById('panelCancelExportBtn').addEventListener('click', closeSlidePanel);

    slidePanel.classList.add('active');
    panelOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function exportPhrasesSimplified(categoryId, categoryName) {
    Promise.all([
        browser.storage.local.get([STORAGE_KEY_CUSTOM_PHRASES, STORAGE_KEY_USER_BUTTONS]),
        browser.storage.local.get('aiPromptHelperCategories')
    ]).then(([phraseData, categoryData]) => {
        const customPhrases = phraseData[STORAGE_KEY_CUSTOM_PHRASES] || {};
        const userButtons = phraseData[STORAGE_KEY_USER_BUTTONS] || {};
        const userCategories = categoryData.aiPromptHelperCategories || {};
        const defaultCategories = window.aiPromptHelper?.categories || {};
        const defaultButtons = window.aiPromptHelper?.phrases?.buttonDefinitions || [];
        const allAtomicPhrases = window.aiPromptHelper?.phrases?.atomicPhrases || {};

        const allCategories = { ...defaultCategories, ...userCategories };
        const categoryInfo = allCategories[categoryId];

        const phrases = [];

        defaultButtons.forEach(button => {
            if (button.categoryId === categoryId) {
                const content = button.atomicPhraseIds?.map(id => {
                    const override = customPhrases[id];
                    if (override && override.isAtomicOverride) {
                        return override.content;
                    }
                    return allAtomicPhrases[id] || '';
                }).filter(text => text.trim()).join(' ') || '';

                if (content) {
                    phrases.push({
                        label: button.label,
                        type: button.type,
                        content: content
                    });
                }
            }
        });

        Object.values(userButtons).forEach(button => {
            if (button.categoryId === categoryId) {
                const content = button.atomicPhraseIds?.map(id => {
                    const override = customPhrases[id];
                    if (override && override.isAtomicOverride) {
                        return override.content;
                    }
                    return allAtomicPhrases[id] || '';
                }).filter(text => text.trim()).join(' ') || '';

                if (content) {
                    phrases.push({
                        label: button.label,
                        type: button.type,
                        content: content
                    });
                }
            }
        });

        Object.values(customPhrases).forEach(phrase => {
            if (phrase.categoryId === categoryId && !phrase.isAtomicOverride) {
                phrases.push({
                    label: phrase.label,
                    type: 'phrase',
                    content: phrase.content
                });
            }
        });

        const exportData = {
            category: {
                name: categoryInfo?.name || categoryName.replace(/^[^\s]*\s/, ''),
                icon: categoryInfo?.icon || '📝'
            },
            phrases: phrases
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileName = `${categoryId}-simple-export-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);

        AlertSystem.success(`Exported ${phrases.length} phrases for category "${categoryName}" in simplified format.`);
        closeSlidePanel();
    }).catch(error => {
        console.error("[Export Error] Error during simplified export:", error);
        AlertSystem.error(`Export failed: ${error.message}`);
    });
}

function exportPhrasesFromPanel(categoryId, categoryName) {
    browser.storage.local.get({
        [STORAGE_KEY_CUSTOM_PHRASES]: {}
    }).then(result => {
        const customPhrases = result[STORAGE_KEY_CUSTOM_PHRASES] || {};
        const phrasesDef = window.aiPromptHelper?.phrases || {};
        const defaultAtomicPhrases = phrasesDef.atomicPhrases || {};
        const defaultButtons = (phrasesDef.buttonDefinitions || []).filter(btn => btn.type !== 'system');
        const systemButtons = (phrasesDef.buttonDefinitions || []).filter(btn => btn.type === 'system');

        const exportedAtomicOverrides = {};
        const exportedReferencedAtomics = {};
        const exportedCustomPhrases = {};
        const exportedDefaultButtons = [];
        const exportedSystemButtons = [];
        let usedAtomicIdsInCategory = new Set();

        defaultButtons.forEach(btn => {
            if (btn.categoryId === categoryId) {
                exportedDefaultButtons.push(btn);
                btn.atomicPhraseIds?.forEach(id => usedAtomicIdsInCategory.add(id));
            }
        });

        systemButtons.forEach(btn => {
            if (btn.categoryId === categoryId) {
                exportedSystemButtons.push(btn);
                btn.atomicPhraseIds?.forEach(id => usedAtomicIdsInCategory.add(id));
            }
        });

        Object.keys(customPhrases).forEach(id => {
            const phrase = customPhrases[id];
            if (phrase.categoryId === categoryId && !phrase.isAtomicOverride) {
                exportedCustomPhrases[id] = phrase;
            }
        });

        usedAtomicIdsInCategory.forEach(id => {
            const overrideData = customPhrases[id];
            if (overrideData && overrideData.isAtomicOverride === true) {
                exportedAtomicOverrides[id] = overrideData.content;
            } else {
                const defaultContent = defaultAtomicPhrases[id];
                if (defaultContent !== undefined) {
                    exportedReferencedAtomics[id] = defaultContent;
                }
            }
        });

        const exportData = {
            version: '1.2',
            timestamp: new Date().toISOString(),
            category: { id: categoryId, name: categoryName },
            data: {
                atomicOverrides: exportedAtomicOverrides,
                referencedAtomicDefaults: exportedReferencedAtomics,
                customPhrases: exportedCustomPhrases,
                buttonDefinitions: exportedDefaultButtons,
                systemInstructionButtons: exportedSystemButtons
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileName = `${categoryId}-phrases-export-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);

        const totalExported = Object.keys(exportedAtomicOverrides).length +
            Object.keys(exportedCustomPhrases).length +
            exportedDefaultButtons.length +
            exportedSystemButtons.length;

        AlertSystem.success(`Exported ${totalExported} items for category "${categoryName}" (including referenced defaults/overrides).`);
        closeSlidePanel();
    }).catch(error => {
        console.error("[Export Error] Error during export process:", error);
        AlertSystem.error(`Export failed: ${error.message}`);
    });
}

function exportPhrases() {
    const categorySelect = document.getElementById(EXPORT_CATEGORY_SELECT_ID);
    if (!categorySelect || !categorySelect.value) {
        AlertSystem.error("Please select a category to export.");
        return;
    }
    const categoryId = categorySelect.value;
    const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

    browser.storage.local.get({
        [STORAGE_KEY_CUSTOM_PHRASES]: {}
    }).then(result => {
        const customPhrases = result[STORAGE_KEY_CUSTOM_PHRASES] || {};
        const phrasesDef = window.aiPromptHelper?.phrases || {};
        const defaultAtomicPhrases = phrasesDef.atomicPhrases || {};
        const defaultButtons = phrasesDef.buttonDefinitions || [];
        const systemButtons = phrasesDef.systemInstructionButtons || [];

        const exportedAtomicOverrides = {};
        const exportedReferencedAtomics = {};
        const exportedCustomPhrases = {};
        const exportedDefaultButtons = [];
        const exportedSystemButtons = [];
        let usedAtomicIdsInCategory = new Set();

        defaultButtons.forEach(btn => {
            if (btn.categoryId === categoryId) {
                exportedDefaultButtons.push(btn);
                btn.atomicPhraseIds?.forEach(id => usedAtomicIdsInCategory.add(id));
            }
        });

        systemButtons.forEach(btn => {
            if (btn.categoryId === categoryId) {
                exportedSystemButtons.push(btn);
                btn.atomicPhraseIds?.forEach(id => usedAtomicIdsInCategory.add(id));
            }
        });

        Object.keys(customPhrases).forEach(id => {
            const phrase = customPhrases[id];
            if (phrase.categoryId === categoryId && !phrase.isAtomicOverride) {
                exportedCustomPhrases[id] = phrase;
            }
        });

        usedAtomicIdsInCategory.forEach(id => {
            const overrideData = customPhrases[id];
            if (overrideData && overrideData.isAtomicOverride === true) {
                exportedAtomicOverrides[id] = overrideData.content;
            } else {
                const defaultContent = defaultAtomicPhrases[id];
                if (defaultContent !== undefined) {
                    exportedReferencedAtomics[id] = defaultContent;
                }
            }
        });

        const exportData = {
            version: '1.2',
            timestamp: new Date().toISOString(),
            category: { id: categoryId, name: categoryName },
            data: {
                atomicOverrides: exportedAtomicOverrides,
                referencedAtomicDefaults: exportedReferencedAtomics,
                customPhrases: exportedCustomPhrases,
                buttonDefinitions: exportedDefaultButtons,
                systemInstructionButtons: exportedSystemButtons
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileName = `${categoryId}-phrases-export-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);

        const totalExported = Object.keys(exportedAtomicOverrides).length +
            Object.keys(exportedCustomPhrases).length +
            exportedDefaultButtons.length +
            exportedSystemButtons.length;

        AlertSystem.success(`Exported ${totalExported} items for category "${categoryName}" (including referenced defaults/overrides).`);

    }).catch(error => {
        console.error("[Export Error] Error during export process:", error);
        AlertSystem.error(`Export failed: ${error.message}`);
    });
}

function loadCategories() {
    return StorageAPI.get(['aiPromptHelperCategories']).then(result => {
        const customCategories = result.aiPromptHelperCategories || {};
        const defaultCategories = window.aiPromptHelper?.categories || {};
        return { ...defaultCategories, ...customCategories };
    }).catch(error => {
        console.error("AI Prompt Helper: Failed to load categories from storage:", error);
        return window.aiPromptHelper?.categories || {};
    });
}

function populateCategoryDropdown(selectEl) {
    while (selectEl.options.length > 0 && !selectEl.options[0].disabled) {
        selectEl.remove(0);
    }
    while (selectEl.options.length > 1) {
        selectEl.remove(1);
    }

    loadCategories().then(categories => {
        Object.values(categories).forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = `${category.icon || ''} ${category.name}`;
            selectEl.appendChild(option);
        });

        selectEl.style.padding = "6px";
        selectEl.style.borderRadius = "4px";
        selectEl.style.border = "1px solid var(--border-color)";
        selectEl.style.fontSize = "14px";
        selectEl.style.minWidth = "150px";
    });
}

function deleteCategory(categoryId, categoryName) {
    if (!categoryId) {
        AlertSystem.error('No category specified for deletion');
        return;
    }
    const confirmName = categoryName || categoryId;

    if (!confirm(`This will delete ALL custom phrases in the "${confirmName}" category. Default buttons and atomic phrase overrides will NOT be affected.\n\nAre you sure? This cannot be undone.`)) {
        return;
    }

    browser.storage.local.get({
        [STORAGE_KEY_CUSTOM_PHRASES]: {}
    }).then(result => {
        const currentPhrases = result[STORAGE_KEY_CUSTOM_PHRASES] || {};
        let deletedCount = 0;
        const updatedPhrases = {};

        Object.keys(currentPhrases).forEach(id => {
            if (currentPhrases[id].categoryId !== categoryId || currentPhrases[id].isAtomicOverride) {
                updatedPhrases[id] = currentPhrases[id];
            } else {
                deletedCount++;
            }
        });

        if (deletedCount === 0) {
            AlertSystem.info(`No custom phrases found in category "${confirmName}" to delete.`);
            return;
        }

        browser.storage.local.set({
            [STORAGE_KEY_CUSTOM_PHRASES]: updatedPhrases
        }).then(() => {
            AlertSystem.success(`Deleted ${deletedCount} custom phrases from category "${confirmName}"`);

            initCategoryManagement();
            const categorySelectExport = document.getElementById(EXPORT_CATEGORY_SELECT_ID);
            if (categorySelectExport) populateCategorySelect(categorySelectExport);

            const tabToRemove = categoryTabsContainer.querySelector(`.category-tab[data-category-id="${categoryId}"]`);
            const panelToRemove = categoryPanelsContainer.querySelector(`.category-panel[data-category-id="${categoryId}"]`);

            let tabWasActive = false;
            if (tabToRemove && tabToRemove.classList.contains('active')) {
                tabWasActive = true;
            }

            tabToRemove?.remove();
            panelToRemove?.remove();

            if (tabWasActive) {
                const firstTab = categoryTabsContainer.querySelector('.category-tab');
                if (firstTab) {
                    firstTab.click();
                } else {
                    categoryTabsContainer.innerHTML = '<p>No categories defined.</p>';
                    categoryPanelsContainer.innerHTML = '';
                    currentActiveCategoryId = null;
                }
            } else if (!categoryTabsContainer.querySelector('.category-tab')) {
                categoryTabsContainer.innerHTML = '<p>No categories defined.</p>';
                categoryPanelsContainer.innerHTML = '';
                currentActiveCategoryId = null;
            }

        }).catch(err => {
            console.error("Error saving after category deletion:", err);
            AlertSystem.error(`Error deleting category phrases: ${err.message}`);
        });
    }).catch(err => {
        console.error("Error fetching phrases for category deletion:", err);
        AlertSystem.error(`Error accessing storage: ${err.message}`);
    });
}

function getWorkflowPreset(workflowSettings) {
    const hasEmpathy = ['first', 'mid', 'last'].some(pos => workflowSettings.empathy?.[pos]);
    const hasRewards = ['first', 'mid', 'last'].some(pos => workflowSettings.rewards?.[pos]);
    const hasPenalties = ['first', 'mid', 'last'].some(pos => workflowSettings.penalties?.[pos]);
    const hasAuthority = ['first', 'mid', 'last'].some(pos => workflowSettings.authority?.[pos]);
    const hasRealign = ['mid', 'last'].some(pos => workflowSettings.realign?.[pos]);

    const hasCompleteness = ['first', 'mid', 'last'].some(pos => workflowSettings.completeness?.[pos]);
    const hasUrgency = ['first', 'mid', 'last'].some(pos => workflowSettings.urgency?.[pos]);
    const hasDuty = ['first', 'mid', 'last'].some(pos => workflowSettings.duty?.[pos]);
    const hasPrecision = ['first', 'mid', 'last'].some(pos => workflowSettings.precision?.[pos]);
    const hasSocialProof = ['first', 'mid', 'last'].some(pos => workflowSettings.socialProof?.[pos]);
    const hasReputation = ['first', 'mid', 'last'].some(pos => workflowSettings.reputation?.[pos]);

    const activeCount = [hasEmpathy, hasRewards, hasPenalties, hasAuthority, hasRealign, hasCompleteness, hasUrgency, hasDuty, hasPrecision, hasSocialProof, hasReputation].filter(Boolean).length;

    if (activeCount === 0) return 'none';
    if (activeCount === 2 && hasEmpathy && hasRealign) return 'light';
    if (activeCount === 3 && hasEmpathy && hasRewards && hasRealign) return 'standard';
    if (activeCount === 5 && hasEmpathy && hasRewards && hasPenalties && hasAuthority && hasRealign) return 'heavy';
    if (activeCount === 11) return 'maximum';

    return 'custom';
}

function getSystemPreset(systemSettings) {
    const allTypes = ['rewards', 'penalties', 'empathy', 'authority', 'completeness', 'urgency', 'duty', 'precision', 'socialProof', 'reputation'];
    const activeTypes = allTypes.filter(type => systemSettings[type]);

    if (activeTypes.length === 0) return 'none';
    if (activeTypes.length === 1 && activeTypes.includes('empathy')) return 'light';
    if (activeTypes.length === 2 && activeTypes.includes('empathy') && activeTypes.includes('rewards')) return 'standard';
    if (activeTypes.length === 4 && activeTypes.includes('empathy') && activeTypes.includes('rewards') && activeTypes.includes('penalties') && activeTypes.includes('authority')) return 'heavy';
    if (activeTypes.length === allTypes.length) return 'maximum';
    return 'custom';
}

async function applyWorkflowPreset(categoryId, preset) {
    const workflowAdvancedOpen = document.getElementById(`workflow-advanced-${categoryId}`)?.style.display === 'block';
    const systemAdvancedOpen = document.getElementById(`system-advanced-${categoryId}`)?.style.display === 'block';

    const presetMappings = {
        none: [],
        light: ['empathy', 'realign'],
        standard: ['empathy', 'rewards', 'realign'],
        heavy: ['empathy', 'rewards', 'penalties', 'authority', 'realign'],
        maximum: ['realign', 'rewards', 'penalties', 'empathy', 'authority', 'completeness', 'urgency', 'duty', 'precision', 'socialProof', 'reputation']
    };

    const result = await browser.storage.local.get([STORAGE_KEY_ADDENDUM_SETTINGS]);
    const addendumSettings = result[STORAGE_KEY_ADDENDUM_SETTINGS] || {};

    if (!addendumSettings[categoryId]) addendumSettings[categoryId] = {};
    addendumSettings[categoryId].workflows = {};

    const activeTypes = presetMappings[preset] || [];
    const allTypes = ['realign', 'rewards', 'penalties', 'empathy', 'authority', 'completeness', 'urgency', 'duty', 'precision', 'socialProof', 'reputation'];

    allTypes.forEach(type => {
        const isActive = activeTypes.includes(type);
        addendumSettings[categoryId].workflows[type] = {};

        ['first', 'mid', 'last'].forEach(position => {
            if (type === 'realign' && position === 'first') {
                addendumSettings[categoryId].workflows[type][position] = false;
            } else {
                addendumSettings[categoryId].workflows[type][position] = isActive;
            }
        });
    });

    await browser.storage.local.set({[STORAGE_KEY_ADDENDUM_SETTINGS]: addendumSettings});

    window.promptHelperAdvancedState = window.promptHelperAdvancedState || {};
    window.promptHelperAdvancedState[categoryId] = {
        workflow: workflowAdvancedOpen,
        system: systemAdvancedOpen
    };

    renderPanelContent(categoryId);
}

async function applySystemPreset(categoryId, preset) {
    const workflowAdvancedOpen = document.getElementById(`workflow-advanced-${categoryId}`)?.style.display === 'block';
    const systemAdvancedOpen = document.getElementById(`system-advanced-${categoryId}`)?.style.display === 'block';

    const presetMappings = {
        none: [],
        light: ['empathy'],
        standard: ['empathy', 'rewards'],
        heavy: ['empathy', 'rewards', 'penalties', 'authority'],
        maximum: ['rewards', 'penalties', 'empathy', 'authority', 'completeness', 'urgency', 'duty', 'precision', 'socialProof', 'reputation']
    };

    const result = await browser.storage.local.get([STORAGE_KEY_ADDENDUM_SETTINGS]);
    const addendumSettings = result[STORAGE_KEY_ADDENDUM_SETTINGS] || {};

    if (!addendumSettings[categoryId]) addendumSettings[categoryId] = {};
    addendumSettings[categoryId].systemInstructions = {};

    const activeTypes = presetMappings[preset] || [];
    const allTypes = ['rewards', 'penalties', 'empathy', 'authority', 'completeness', 'urgency', 'duty', 'precision', 'socialProof', 'reputation'];

    allTypes.forEach(type => {
        addendumSettings[categoryId].systemInstructions[type] = activeTypes.includes(type);
    });

    await browser.storage.local.set({[STORAGE_KEY_ADDENDUM_SETTINGS]: addendumSettings});

    window.promptHelperAdvancedState = window.promptHelperAdvancedState || {};
    window.promptHelperAdvancedState[categoryId] = {
        workflow: workflowAdvancedOpen,
        system: systemAdvancedOpen
    };

    renderPanelContent(categoryId);
}

function toggleAdvancedWorkflow(categoryId) {
    const advancedSection = document.getElementById(`workflow-advanced-${categoryId}`);
    if (advancedSection) {
        advancedSection.style.display = advancedSection.style.display === 'none' ? 'block' : 'none';
    }
}

function toggleAdvancedSystem(categoryId) {
    const advancedSection = document.getElementById(`system-advanced-${categoryId}`);
    if (advancedSection) {
        advancedSection.style.display = advancedSection.style.display === 'none' ? 'block' : 'none';
    }
}

function createCategory(event) {
    event.preventDefault();

    const categoryName = document.getElementById('categoryName').value.trim();
    const categoryIcon = document.getElementById('categoryIcon').value.trim();

    if (!categoryName) {
        showStatus('Category Name is required', 'error');
        return;
    }

    const categoryId = categoryName.toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');

    if (!categoryId) {
        showStatus('Could not generate valid category ID from name', 'error');
        return;
    }

    browser.storage.local.get('aiPromptHelperCategories').then(result => {
        const categories = result.aiPromptHelperCategories || {};

        if (categories[categoryId]) {
            showStatus(`Category "${categoryName}" already exists`, 'error');
            return;
        }

        categories[categoryId] = {
            id: categoryId,
            name: categoryName,
            icon: categoryIcon
        };

        browser.storage.local.set({ aiPromptHelperCategories: categories }).then(() => {
            showStatus(`Category "${categoryName}" created successfully`);
            document.getElementById('categoryName').value = '';
            document.getElementById('categoryIcon').value = '';

            createTabsAndPanels();
            populateCategoryDropdown(document.getElementById('phraseCategorySelect'));
            populateCategorySelect(document.getElementById(EXPORT_CATEGORY_SELECT_ID));
        });
    });
}

