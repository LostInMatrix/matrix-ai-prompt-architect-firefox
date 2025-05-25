'use strict';
console.log(`%c AI PROMPT HELPER SCRIPT START EXECUTION - ${new Date().toLocaleTimeString()}`, 'color: blue; font-weight: bold;');
const PANEL_ID = 'promptHelperPanel_v22';
const TOGGLE_BTN_ID = PANEL_ID + '_toggleButton';
const TOGGLE_BTN_HANDLE_ID = TOGGLE_BTN_ID + '_handle';
const TOGGLE_BTN_TEXT_ID = TOGGLE_BTN_ID + '_text';
const DROP_ZONE_ID = PANEL_ID + '_dropZone';
const DARK_MODE_BTN_ID = PANEL_ID + '_darkModeButton';
const STORAGE_KEY_BTN_POS = 'promptHelperBtnPos_v1';
const STORAGE_KEY_DARK_MODE = 'promptHelperDarkMode_v1';
const TARGET_ELEMENT_SELECTOR = '#prompt-textarea[contenteditable="true"], textarea, input[type="text"], input[type="search"], input[type="url"], input[type="email"], div[contenteditable="true"]';
const PANEL_MARGIN = 5;
const COMBO_BTN_CONTAINER_CLASS = 'promptHelperComboButtons';
const SINGLE_BTN_CONTAINER_CLASS = 'promptHelperSingleButtons';
const SECTION_HEADER_CLASS = 'promptHelperSectionHeader';
const DARK_MODE_CLASS = 'darkModeActive';
const HOTKEY_MODIFIER_LABEL = 'CTRL+ALT+';
const TAB_CONTAINER_ID = PANEL_ID + '_tabContainer';
const ACTIVE_TAB_CLASS = 'promptHelperActiveTab';
const ACTIVE_PANEL_CLASS = 'promptHelperActivePanel';
const SYSTEM_INSTRUCTIONS_CONTAINER_CLASS = 'promptHelperSystemInstructions';

let lastFocusedTextarea = null;
let isDragging = false;
let dragViewportOffsetX = 0;
let dragViewportOffsetY = 0;
let atomicPhrases = {};
let buttonDefinitions = [];
let phraseStatuses = {};
let customPhrases = {};
let messageListener = null;
let focusInListener = null;
let keyDownListener = null;
let dragEndListener = null;
let dropListener = null;
let isUIRendered = false;
let alertDebounceTimer = null;
let currentHighlightedDropTarget = null;

const PANEL_WIDTH_ESTIMATE = 270;
const PANEL_MAX_HEIGHT_ESTIMATE = window.innerHeight * 0.8;

const SUPPORTED_CHAT_NAV_DOMAINS = [
    'claude.ai',
    'chatgpt.com',
    'gemini.google.com'
    // Note: aistudio.google.com excluded due to virtual scrolling
];


console.log('AI Prompt Helper content script INJECTED (waiting for render command)');

function loadPhrases() {
    if (window.aiPromptHelper && window.aiPromptHelper.phrases) {
        return StorageAPI.get(['promptHelperButtonStatus', 'promptHelperCustomPhrases']).then(result => {
            atomicPhrases = {};
            const defaultPhrases = window.aiPromptHelper.phrases.atomicPhrases || {};
            const buttonStatuses = result.promptHelperButtonStatus || {};

            Object.keys(defaultPhrases).forEach(id => {
                atomicPhrases[id] = defaultPhrases[id];
            });

            customPhrases = result.promptHelperCustomPhrases || {};
            Object.keys(customPhrases).forEach(id => {
                if (customPhrases[id].isAtomicOverride) {
                    atomicPhrases[id] = customPhrases[id].content;
                } else {
                    atomicPhrases[id] = customPhrases[id].content;
                }
            });

            const customButtons = Object.keys(customPhrases)
                .filter(id => !customPhrases[id].isAtomicOverride)
                .map(id => {
                    return {
                        label: customPhrases[id].label || id,
                        atomicPhraseIds: [id],
                        isUserPhrase: true,
                        categoryId: customPhrases[id].categoryId
                    };
                });

            buttonDefinitions = [];
            if (window.aiPromptHelper.phrases.buttonDefinitions) {
                buttonDefinitions = (window.aiPromptHelper.phrases.buttonDefinitions || []).filter(btn => {
                    return buttonStatuses[btn.label] !== false;
                });
            }

            buttonDefinitions = buttonDefinitions.concat(customButtons);

            return buttonDefinitions;
        }).catch(error => {
            console.error("AI Prompt Helper: Failed to load phrases from storage:", error);
            atomicPhrases = {};
            buttonDefinitions = [];
            customPhrases = {};
            return Promise.resolve();
        });
    } else {
        console.error("AI Prompt Helper: Phrases definition object not found (window.aiPromptHelper.phrases missing)");
        atomicPhrases = {};
        buttonDefinitions = [];
        customPhrases = {};
        return Promise.resolve();
    }
}

function trackFocus(event) {
    if (event.target && typeof event.target.closest === 'function') {
        const matchedElement = event.target.closest(TARGET_ELEMENT_SELECTOR);
        if (matchedElement && !matchedElement.closest(`#${PANEL_ID}`) && !matchedElement.disabled && matchedElement.offsetParent !== null) {
            lastFocusedTextarea = matchedElement;
        }
    } else {
        if (event.target && event.target.matches && event.target.matches(TARGET_ELEMENT_SELECTOR)) {
            if (!event.target.closest(`#${PANEL_ID}`) && !event.target.disabled && event.target.offsetParent !== null) {
                lastFocusedTextarea = event.target;
            }
        }
    }
}

function addTextToTarget(textToAdd, isFromFile = false, fileName = '') {
    if (!lastFocusedTextarea || !document.body.contains(lastFocusedTextarea) || lastFocusedTextarea.offsetParent === null) {
        if (!alertDebounceTimer) {
            alert(`Prompt Helper: Please click into a *visible* text area or input field first, or ensure the previously selected one is still visible.`);
            lastFocusedTextarea = null;
            alertDebounceTimer = setTimeout(() => {
                alertDebounceTimer = null;
            }, 1000);
        }
        return;
    }

    const targetEl = lastFocusedTextarea;
    console.log('[Prompt Helper] Attempting to focus targetEl:', targetEl);
    const currentActiveElementBeforeFocus = document.activeElement;
    targetEl.focus();
    const currentActiveElementAfterFocus = document.activeElement;

    if (targetEl !== currentActiveElementAfterFocus) {
        console.warn(`[Prompt Helper] WARN: Programmatic focus on targetEl may not have succeeded or was lost.
        Target:`, targetEl,
            `Active Element Before:`, currentActiveElementBeforeFocus,
            `Active Element After:`, currentActiveElementAfterFocus);
    } else {
        console.log('[Prompt Helper] Programmatic focus on targetEl appears to have succeeded. Active Element:', currentActiveElementAfterFocus);
    }

    const preparedText = prepareTextContent(targetEl, textToAdd, isFromFile, fileName);

    if (targetEl.isContentEditable) {
        insertIntoContentEditable(targetEl, preparedText);
    } else if (typeof targetEl.value !== 'undefined') {
        insertIntoInputField(targetEl, preparedText);
    } else {
        console.warn("Prompt Helper: Focused element is neither contentEditable nor has a value property.", targetEl);
        alert(`Prompt Helper: Cannot determine how to add text to this element.`);
        lastFocusedTextarea = null;
        return;
    }

    if (typeof targetEl.scrollIntoView === 'function') {
        targetEl.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
}

function prepareTextContent(element, text, isFromFile, fileName) {
    const sep = ' ';
    const newline = '\n';
    const needsSeparator = element.isContentEditable
        ? element.textContent.length > 0 && !/\s$/.test(element.textContent)
        : element.value && element.value.substring(0, element.selectionStart).length > 0 &&
        !/\s$/.test(element.value.substring(0, element.selectionStart));

    if (!isFromFile) {
        return (needsSeparator ? sep : '') + text + newline;
    }

    const prefix = (needsSeparator ? newline : '') +
        `--- File Start: ${fileName} ---` + newline;
    return prefix + text + newline + `--- File End: ${fileName} ---` + newline;
}

function insertIntoContentEditable(element, text) {
    try {
        document.execCommand('insertText', false, text);
        element.dispatchEvent(new Event('input', {bubbles: true, cancelable: true}));
        element.dispatchEvent(new Event('change', {bubbles: true, cancelable: true}));
    } catch (e) {
        console.error("Prompt Helper: Error using execCommand:", e);
        alert("Prompt Helper: Could not insert text into the editable area.");
    }
}

function insertIntoInputField(element, text) {
    const currentValue = element.value;
    const selectionStart = element.selectionStart;
    const selectionEnd = element.selectionEnd;

    element.value = currentValue.substring(0, selectionStart) +
        text +
        currentValue.substring(selectionEnd);

    const newCursorPos = selectionStart + text.length;
    element.setSelectionRange(newCursorPos, newCursorPos);

    try {
        element.dispatchEvent(new Event('input', {bubbles: true, cancelable: true}));
        element.dispatchEvent(new Event('change', {bubbles: true, cancelable: true}));
    } catch (e) {
        console.error("Prompt Helper: Error dispatching input event:", e);
    }
}

function updateDragTargetHighlight(show, newTargetElement = null) {
    if (currentHighlightedDropTarget && (currentHighlightedDropTarget !== newTargetElement || !show)) {
        if (document.body.contains(currentHighlightedDropTarget)) {
            currentHighlightedDropTarget.classList.remove('prompt-helper-drop-target-highlight');
        }
        currentHighlightedDropTarget = null;
    }

    if (show && newTargetElement && document.body.contains(newTargetElement) && newTargetElement.offsetParent !== null) {
        newTargetElement.classList.add('prompt-helper-drop-target-highlight');
        currentHighlightedDropTarget = newTargetElement;
    }
}

function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = this;
    dropZone.classList.add('drag-active');

    if (lastFocusedTextarea && document.body.contains(lastFocusedTextarea) && lastFocusedTextarea.offsetParent !== null) {
        updateDragTargetHighlight(true, lastFocusedTextarea);
        dropZone.textContent = 'Drop to add file content to the highlighted input field.';
        dropZone.classList.remove('no-target');
        if (dropZone.style.borderColor === 'orange') {
            dropZone.style.borderColor = '';
        }
    } else {
        updateDragTargetHighlight(false);
        dropZone.textContent = 'Select a text field on the page first!';
        dropZone.classList.add('no-target');
        dropZone.style.borderColor = 'orange';
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = this;
    if (!dropZone.classList.contains('drag-active')) {
        dropZone.classList.add('drag-active');
    }

    if (lastFocusedTextarea && document.body.contains(lastFocusedTextarea) && lastFocusedTextarea.offsetParent !== null) {
        updateDragTargetHighlight(true, lastFocusedTextarea);
        dropZone.classList.remove('no-target');
        const targetMessage = 'Drop to add file content to the highlighted input field.';
        if (dropZone.textContent !== targetMessage) {
            dropZone.textContent = targetMessage;
        }
        if (dropZone.style.borderColor === 'orange') {
            dropZone.style.borderColor = '';
        }
    } else {
        updateDragTargetHighlight(false);
        dropZone.classList.add('no-target');
        const noTargetMessage = 'Select a text field on the page first!';
        if (dropZone.textContent !== noTargetMessage) {
            dropZone.textContent = noTargetMessage;
        }
        if (dropZone.style.borderColor !== 'orange') {
            dropZone.style.borderColor = 'orange';
        }
    }
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = this;
    dropZone.classList.remove('drag-active');
    dropZone.classList.remove('no-target');
    updateDragTargetHighlight(false);
    dropZone.textContent = 'Drop file(s) here';
    dropZone.style.borderColor = '';
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = this;
    dropZone.classList.remove('drag-active');
    updateDragTargetHighlight(false);

    resetDragStates();

    if (dropZone.style.borderColor === 'orange') {
        dropZone.style.borderColor = '';
    }

    if (!lastFocusedTextarea || !document.body.contains(lastFocusedTextarea) || lastFocusedTextarea.offsetParent === null) {
        alert(`Prompt Helper: Please click into a *visible* text area or input field *before* dropping files, or ensure the previously selected one is still visible.`);
        dropZone.textContent = 'Select visible input first!';
        dropZone.style.borderColor = 'red';
        setTimeout(() => {
            dropZone.textContent = 'Drop file(s) here';
            dropZone.style.borderColor = '';
        }, 3000);
        return;
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        let filesProcessed = 0, filesErrored = 0, nonTextFiles = 0;
        dropZone.textContent = `Reading ${files.length} file(s)...`;
        dropZone.style.borderColor = '#1890ff';

        const processFilesSequentially = async () => {
            for (const file of Array.from(files)) {
                if (isNonTextFile(file)) {
                    console.error(`Prompt Helper: File "${file.name}" appears to be a non-text file and will be skipped.`);
                    nonTextFiles++;
                    continue;
                }

                try {
                    const content = await readFileAsync(file);
                    addTextToTarget(content, true, file.name);
                    filesProcessed++;
                } catch (error) {
                    console.error(`Prompt Helper: Error reading file "${file.name}":`, error);
                    filesErrored++;
                }
            }
            completeProcessing();
        };

        const readFileAsync = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = e => reject(e);
                reader.readAsText(file);
            });
        };

        const completeProcessing = () => {
            let finalMsg, finalBorderColor;
            if (nonTextFiles > 0) {
                if (filesProcessed === 0) {
                    finalMsg = `No valid text files found. ${nonTextFiles} non-text file(s) skipped.`;
                    finalBorderColor = 'red';
                } else {
                    finalMsg = `Appended ${filesProcessed} text file(s). Skipped ${nonTextFiles} non-text file(s).`;
                    finalBorderColor = 'orange';
                }
            } else if (filesErrored > 0) {
                finalMsg = `Appended ${filesProcessed} file(s), ${filesErrored} error(s).`;
                finalBorderColor = 'orange';
            } else {
                finalMsg = `Appended ${files.length} file(s).`;
                finalBorderColor = 'green';
            }
            dropZone.textContent = finalMsg;
            dropZone.style.borderColor = finalBorderColor;

            resetDragStates();

            setTimeout(() => {
                dropZone.textContent = 'Drop file(s) here';
                dropZone.style.borderColor = '';
            }, 3000);
        };

        processFilesSequentially();
    } else {
        dropZone.textContent = 'No file detected!';
        setTimeout(() => {
            dropZone.textContent = 'Drop file(s) here';
        }, 2000);
    }
}

function resetDragStates() {
    updateDragTargetHighlight(false);

    document.querySelectorAll('.drag-over, .dragover, .drag-active, [data-drag-active="true"]').forEach(el => {
        if (!el.id.includes(PANEL_ID)) {
            el.classList.remove('drag-over', 'dragover', 'drag-active');
            if (el.hasAttribute('data-drag-active')) {
                el.setAttribute('data-drag-active', 'false');
            }
        } else if (el.id === DROP_ZONE_ID && !el.classList.contains('drag-active')) {
        }
    });

    document.body.classList.remove('drag-over', 'dragover', 'drag-active');

    const dragLeaveEvent = new Event('dragleave', {bubbles: true, cancelable: true});
    document.body.dispatchEvent(dragLeaveEvent);
}

function startDrag(event) {
    if (event.button !== 0) return;

    const panel = document.getElementById(PANEL_ID);
    if (panel && panel.style.display === 'block') {
        panel.style.display = 'none';
        updateToggleButtonText();
    }

    isDragging = true;
    const btnContainer = document.getElementById(TOGGLE_BTN_ID);
    const handle = document.getElementById(TOGGLE_BTN_HANDLE_ID);
    const btnRect = btnContainer.getBoundingClientRect();
    dragViewportOffsetX = event.clientX - btnRect.left;
    dragViewportOffsetY = event.clientY - btnRect.top;
    handle.classList.add('dragging');
    document.addEventListener('mousemove', dragMove, true);
    document.addEventListener('mouseup', stopDrag, true);
    event.preventDefault();
    event.stopPropagation();
}

function dragMove(event) {
    if (!isDragging) return;
    const btnContainer = document.getElementById(TOGGLE_BTN_ID);
    if (!btnContainer) {
        stopDrag(event);
        return;
    }
    let nX = event.clientX - dragViewportOffsetX, nY = event.clientY - dragViewportOffsetY;
    const mX = window.innerWidth - btnContainer.offsetWidth, mY = window.innerHeight - btnContainer.offsetHeight;
    nX = Math.max(0, Math.min(nX, mX));
    nY = Math.max(0, Math.min(nY, mY));
    btnContainer.style.left = nX + 'px';
    btnContainer.style.top = nY + 'px';
    btnContainer.style.right = 'auto';
    btnContainer.style.bottom = 'auto';
    event.preventDefault();
    event.stopPropagation();
}

function stopDrag(event) {
    if (!isDragging) return;
    isDragging = false;
    const btnContainer = document.getElementById(TOGGLE_BTN_ID);
    const handle = document.getElementById(TOGGLE_BTN_HANDLE_ID);
    if (btnContainer && handle) {
        handle.classList.remove('dragging');
        const pos = {left: btnContainer.style.left, top: btnContainer.style.top};
        if (pos.left && pos.top) {
            StorageAPI.set({[STORAGE_KEY_BTN_POS]: pos});
        }
    }
    document.removeEventListener('mousemove', dragMove, true);
    document.removeEventListener('mouseup', stopDrag, true);
}

function positionPanel() {
    const panel = document.getElementById(PANEL_ID);
    const mainToggleButton = document.getElementById(TOGGLE_BTN_ID);
    if (!panel || !mainToggleButton || panel.style.display === 'none') return;

    rebuildPhraseButtons(panel);
    recalculateAndApplyPanelHeight();
    const panelComputedStyle = window.getComputedStyle(panel);
    const panelHeight = Math.min(PANEL_MAX_HEIGHT_ESTIMATE, panel.scrollHeight + parseFloat(panelComputedStyle.paddingTop) + parseFloat(panelComputedStyle.paddingBottom));

    const panelWidth = PANEL_WIDTH_ESTIMATE;
    const viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    const scrollX = window.scrollX, scrollY = window.scrollY;
    const btnRect = mainToggleButton.getBoundingClientRect();
    const btnViewportTop = btnRect.top, btnViewportLeft = btnRect.left;
    const btnOffsetHeight = mainToggleButton.offsetHeight, btnOffsetWidth = mainToggleButton.offsetWidth;
    const btnViewportBottom = btnViewportTop + btnOffsetHeight, btnViewportRight = btnViewportLeft + btnOffsetWidth;

    let panelTop = scrollY + btnViewportBottom + PANEL_MARGIN, panelLeft = scrollX + btnViewportLeft;

    if (panelTop + panelHeight > scrollY + viewportHeight) {
        const panelTopAbove = scrollY + btnViewportTop - panelHeight - PANEL_MARGIN;
        if (panelTopAbove >= scrollY) {
            panelTop = panelTopAbove;
        } else {
            panelTop = scrollY + viewportHeight - panelHeight - 10;
            if (panelTop < scrollY) panelTop = scrollY + 10;
        }
    }
    if (panelTop < scrollY) {
        panelTop = scrollY + 10;
    }
    if (panelLeft + panelWidth > scrollX + viewportWidth) {
        panelLeft = scrollX + btnViewportRight - panelWidth;
        if (panelLeft < scrollX) {
            panelLeft = scrollX + 10;
        }
    }
    if (panelLeft < scrollX) {
        panelLeft = scrollX + 10;
    }

    panel.style.top = panelTop + 'px';
    panel.style.left = panelLeft + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    panel.style.width = `${PANEL_WIDTH_ESTIMATE}px`;
}

function rebuildPhraseButtons(panel) {
    const comboCont = panel.querySelector('.' + COMBO_BTN_CONTAINER_CLASS);
    const singleCont = panel.querySelector('.' + SINGLE_BTN_CONTAINER_CLASS);
    const comboHeader = panel.querySelector('.' + SECTION_HEADER_CLASS + '[data-section="workflow"]');
    const singleHeader = panel.querySelector('.' + SECTION_HEADER_CLASS + '[data-section="singles"]');
    const userCont = panel.querySelector('.promptHelperUserButtons');
    const userHeader = panel.querySelector('.' + SECTION_HEADER_CLASS + '[data-section="userPhrases"]');
    const systemCont = panel.querySelector('.' + SYSTEM_INSTRUCTIONS_CONTAINER_CLASS);
    const systemHeader = panel.querySelector('.' + SECTION_HEADER_CLASS + '[data-section="systemInstructions"]');

    if (!comboCont || !singleCont || !comboHeader || !singleHeader || !userCont || !userHeader || !systemCont || !systemHeader) {
        console.error("Prompt Helper: Critical UI elements missing during rebuild.");
        return;
    }

    comboCont.innerHTML = '';
    singleCont.innerHTML = '';
    userCont.innerHTML = '';
    systemCont.innerHTML = '';

    comboHeader.style.display = 'none';
    singleHeader.style.display = 'none';
    userHeader.style.display = 'none';
    systemHeader.style.display = 'none';
    comboCont.style.display = 'none';
    singleCont.style.display = 'none';
    userCont.style.display = 'none';
    systemCont.style.display = 'none';
    singleCont.style.borderTop = '';
    singleCont.style.marginTop = '';
    singleCont.style.paddingTop = '';
    comboCont.style.marginBottom = '';
    userCont.style.borderTop = '';
    userCont.style.marginTop = '';
    userCont.style.paddingTop = '';

    let comboCount = 0, singleCount = 0;
    let userCount = 0;
    let systemCount = 0;
    const hotkeyedItemCount = 9;

    const activeCategory = panel.querySelector('.categoryBtn.active');
    const activeCategoryId = activeCategory ? activeCategory.dataset.category : 'all';

    const categoryHotkeyIndices = {};

    buttonDefinitions.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'phraseBtn';
        btn.innerHTML = '';

        if (item.categoryId) {
            btn.dataset.categoryId = item.categoryId;
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = 'phraseLabel';
        labelSpan.textContent = item.label;
        btn.appendChild(labelSpan);

        let hotkeyTitleInfo = '';
        let keyNum = -1;

        if (item.categoryId && !categoryHotkeyIndices[item.categoryId]) {
            categoryHotkeyIndices[item.categoryId] = 0;
        }

        if (item.categoryId && categoryHotkeyIndices[item.categoryId] < hotkeyedItemCount) {
            keyNum = categoryHotkeyIndices[item.categoryId] + 1;
            hotkeyTitleInfo = ` (Hotkey: Alt+Ctrl+${keyNum})`;
            const badgeSpan = document.createElement('span');
            badgeSpan.className = 'hotkeyBadge';
            badgeSpan.textContent = `${HOTKEY_MODIFIER_LABEL}${keyNum}`;
            btn.appendChild(badgeSpan);
            categoryHotkeyIndices[item.categoryId]++;
        }

        if (item.atomicPhraseIds && Array.isArray(item.atomicPhraseIds) && item.atomicPhraseIds.length > 0) {
            const phrases = [];
            item.atomicPhraseIds.forEach(id => {
                if (atomicPhrases[id]) {
                    phrases.push(atomicPhrases[id]);
                } else {
                    console.warn(`Prompt Helper: Atomic phrase ID "${id}" not found or disabled for button "${item.label}".`);
                }
            });

            if (phrases.length > 0) {
                btn.title = `Insert: ${item.label}\n(${item.atomicPhraseIds.join(' + ')})\n\n---\n${phrases.join('\n---\n')}${hotkeyTitleInfo}`;
                btn.onclick = function () {
                    phrases.forEach(p => addTextToTarget(p, false));
                };
                btn.addEventListener('mouseenter', function() {
                    if (lastFocusedTextarea && document.body.contains(lastFocusedTextarea) && lastFocusedTextarea.offsetParent !== null) {
                        updateDragTargetHighlight(true, lastFocusedTextarea);
                    }
                });
                btn.addEventListener('mouseleave', function() {
                    updateDragTargetHighlight(false);
                });

                if (item.isUserPhrase) {
                    userCont.appendChild(btn);
                    userCount++;
                } else if (item.type === "workflow") {
                    comboCont.appendChild(btn);
                    comboCount++;
                } else if (item.type === "phrase") {
                    singleCont.appendChild(btn);
                    singleCount++;
                } else if (item.type === "system") {
                    systemCont.appendChild(btn);
                    systemCount++;
                }
            }
        } else {
            labelSpan.textContent = item.label + " (Error: Invalid Definition)";
            btn.disabled = true;
            btn.title = `Error: Item has no valid 'atomicPhraseIds' array.${hotkeyTitleInfo}`;
            btn.style.cursor = 'not-allowed';
            btn.classList.add('errorButton');
            singleCont.appendChild(btn);
            singleCount++;
        }
    });

    if (comboCount > 0) {
        comboHeader.style.display = 'block';
        comboCont.style.display = 'block';
    }
    if (singleCount > 0) {
        singleHeader.style.display = 'block';
        singleCont.style.display = 'block';
    }
    if (userCount > 0) {
        userHeader.style.display = 'block';
        userCont.style.display = 'block';
    }
    if (systemCount > 0) {
        systemHeader.style.display = 'block';
        systemCont.style.display = 'block';
    }


    const dropZone = panel.querySelector(`#${DROP_ZONE_ID}`);
    if (dropZone) {
        if (comboCount > 0 || singleCount > 0 || userCount > 0) {
            dropZone.style.marginTop = '10px';
        } else {
            dropZone.style.marginTop = '5px';
        }
    }

    const activeCategoryBtn = panel.querySelector('.categoryBtn.active');
    if (activeCategoryBtn) {
        filterByCategory(activeCategoryBtn.dataset.category);
    }
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

function filterByCategory(categoryId) {
    document.querySelectorAll('.categoryBtn').forEach(btn => {
        if (btn.dataset.category === categoryId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const buttons = document.querySelectorAll('.phraseBtn');
    let hasVisibleButtons = false;

    buttons.forEach(btn => {
        const btnCategoryId = btn.dataset.categoryId;

        if (categoryId === 'all' || btnCategoryId === categoryId) {
            btn.style.display = '';
            hasVisibleButtons = true;
        } else {
            btn.style.display = 'none';
        }
    });

    recalculateAndApplyPanelHeight();
}

function toggleDarkMode() {
    const panel = document.getElementById(PANEL_ID);
    const dropZone = document.getElementById(DROP_ZONE_ID);
    const toggleBtn = document.getElementById(DARK_MODE_BTN_ID);
    if (!panel || !toggleBtn || !dropZone) return;
    panel.classList.toggle(DARK_MODE_CLASS);
    dropZone.classList.toggle(DARK_MODE_CLASS);
    const isDarkMode = panel.classList.contains(DARK_MODE_CLASS);
    toggleBtn.textContent = isDarkMode ? '💡' : '🌙';
    StorageAPI.set({[STORAGE_KEY_DARK_MODE]: isDarkMode});
    const singleCont = panel.querySelector('.' + SINGLE_BTN_CONTAINER_CLASS);
    if (singleCont) {
        const isDarkModeActive = panel.classList.contains(DARK_MODE_CLASS);
        const comboCont = panel.querySelector('.' + COMBO_BTN_CONTAINER_CLASS);
        const comboVisible = comboCont && comboCont.style.display !== 'none';
        if (comboVisible && singleCont.style.display !== 'none') {
            singleCont.style.borderTopColor = isDarkModeActive ? '#444' : '#e0e0e0';
        } else {
            singleCont.style.borderTopColor = '';
        }
    }
}

function createOrUpdatePanel() {
    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
        panel = document.createElement('div');
        panel.id = PANEL_ID;

        const title = document.createElement('div');
        title.className = 'promptHelperTitle';
        title.textContent = 'AI Prompt Helper';
        panel.appendChild(title);

        const categoryFilter = document.createElement('div');
        categoryFilter.className = 'promptHelperCategoryFilter';
        panel.appendChild(categoryFilter);

        const tabContainer = document.createElement('div');
        tabContainer.id = TAB_CONTAINER_ID;
        tabContainer.className = 'promptHelperTabContainer';

        const promptsTab = document.createElement('div');
        promptsTab.className = 'promptHelperTab ' + ACTIVE_TAB_CLASS;
        promptsTab.dataset.target = 'prompts';
        promptsTab.textContent = 'Prompts';
        promptsTab.addEventListener('click', () => switchTab('prompts'));

        const systemTab = document.createElement('div');
        systemTab.className = 'promptHelperTab';
        systemTab.dataset.target = 'system';
        systemTab.textContent = 'System Instructions';
        systemTab.addEventListener('click', () => switchTab('system'));

        tabContainer.appendChild(promptsTab);
        tabContainer.appendChild(systemTab);

        panel.appendChild(tabContainer);

        const promptsPanel = document.createElement('div');
        promptsPanel.className = 'promptHelperPanel ' + ACTIVE_PANEL_CLASS;
        promptsPanel.dataset.panel = 'prompts';

        const comboHeader = document.createElement('div');
        comboHeader.className = SECTION_HEADER_CLASS;
        comboHeader.textContent = 'Workflows';
        comboHeader.dataset.section = "workflow";
        promptsPanel.appendChild(comboHeader);

        const comboBtns = document.createElement('div');
        comboBtns.className = COMBO_BTN_CONTAINER_CLASS;
        promptsPanel.appendChild(comboBtns);

        const singleHeader = document.createElement('div');
        singleHeader.className = SECTION_HEADER_CLASS;
        singleHeader.textContent = 'Phrases';
        singleHeader.dataset.section = "singles";
        promptsPanel.appendChild(singleHeader);

        const singleBtns = document.createElement('div');
        singleBtns.className = SINGLE_BTN_CONTAINER_CLASS;
        promptsPanel.appendChild(singleBtns);

        const userHeader = document.createElement('div');
        userHeader.className = SECTION_HEADER_CLASS;
        userHeader.textContent = 'User Phrases';
        userHeader.dataset.section = "userPhrases";
        promptsPanel.appendChild(userHeader);

        const userBtns = document.createElement('div');
        userBtns.className = 'promptHelperUserButtons';
        promptsPanel.appendChild(userBtns);

        panel.appendChild(promptsPanel);

        const systemPanel = document.createElement('div');
        systemPanel.className = 'promptHelperPanel';
        systemPanel.dataset.panel = 'system';

        const systemHeader = document.createElement('div');
        systemHeader.className = SECTION_HEADER_CLASS;
        systemHeader.textContent = 'System Instructions';
        systemHeader.dataset.section = "systemInstructions";
        systemPanel.appendChild(systemHeader);

        const systemBtns = document.createElement('div');
        systemBtns.className = SYSTEM_INSTRUCTIONS_CONTAINER_CLASS;
        systemPanel.appendChild(systemBtns);

        panel.appendChild(systemPanel);

        const chatNavPanel = document.createElement('div');

        chatNavPanel.className = 'promptHelperPanel';
        chatNavPanel.dataset.panel = 'chatNav';

        const chatNavHeader = document.createElement('div');
        chatNavHeader.className = SECTION_HEADER_CLASS;
        chatNavHeader.textContent = 'Recent Messages';
        chatNavPanel.appendChild(chatNavHeader);

        const chatNavContent = document.createElement('div');
        chatNavContent.className = 'promptHelperChatNav';
        chatNavPanel.appendChild(chatNavContent);

        panel.appendChild(chatNavPanel);

        const dropZone = document.createElement('div');
        dropZone.id = DROP_ZONE_ID;
        dropZone.textContent = 'Drop file(s) here';
        panel.appendChild(dropZone);
        dropZone.addEventListener('dragenter', handleDragEnter, false);
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('dragleave', handleDragLeave, false);
        dropZone.addEventListener('drop', handleDrop, false);

        const foot = document.createElement('div');
        foot.className = 'promptHelperFooter';

        const hostname = window.location.hostname;
        const isChatNavSupported = SUPPORTED_CHAT_NAV_DOMAINS.some(domain => hostname.includes(domain));

        if (isChatNavSupported) {
            const chatNavButton = document.createElement('button');
            chatNavButton.textContent = '💬';
            chatNavButton.title = "Toggle Chat Navigation";
            chatNavButton.onclick = function() {
                const currentMode = this.dataset.mode === 'chatNav' ? 'prompts' : 'chatNav';
                this.dataset.mode = currentMode;
                this.textContent = currentMode === 'chatNav' ? '📝' : '💬';
                this.title = currentMode === 'chatNav' ? "Show Prompt Helper" : "Show Chat Navigation";
                switchHeaderMode(currentMode);
            };
            chatNavButton.dataset.mode = 'prompts';
            foot.appendChild(chatNavButton);
        }

        const darkModeButton = document.createElement('button');
        darkModeButton.id = DARK_MODE_BTN_ID;
        darkModeButton.textContent = '🌙';
        darkModeButton.title = "Toggle Dark/Light Mode";
        darkModeButton.onclick = toggleDarkMode;
        foot.appendChild(darkModeButton);

        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.title = "Close Panel";
        closeButton.onclick = function () {
            const p = document.getElementById(PANEL_ID);
            if (p) p.style.display = 'none';
            updateToggleButtonText();
        };
        foot.appendChild(closeButton);

        panel.appendChild(foot);
        document.body.appendChild(panel);

        loadCategories().then(categories => {
            const categoryFilter = panel.querySelector('.promptHelperCategoryFilter');
            if (!categoryFilter) return;

            categoryFilter.innerHTML = '';
            const categoryArray = Object.values(categories);
            let defaultCategoryId = null;

            categoryArray.forEach((category, index) => {
                const btn = document.createElement('button');
                btn.textContent = `${category.icon || ''} ${category.name}`;
                btn.className = 'categoryBtn';

                if (index === 0) {
                    btn.classList.add('active');
                    defaultCategoryId = category.id;
                }

                btn.dataset.category = category.id;
                btn.addEventListener('click', () => filterByCategory(category.id));
                categoryFilter.appendChild(btn);
            });

            loadPhrases().then(() => {
                rebuildPhraseButtons(panel);
                if (defaultCategoryId) {
                    filterByCategory(defaultCategoryId);
                }
            });
        });

        StorageAPI.get(STORAGE_KEY_DARK_MODE).then(result => {
            const isDarkModeSaved = result[STORAGE_KEY_DARK_MODE] || false;
            const dmBtn = document.getElementById(DARK_MODE_BTN_ID);
            if (isDarkModeSaved) {
                panel.classList.add(DARK_MODE_CLASS);
                dropZone.classList.add(DARK_MODE_CLASS);
                if (dmBtn) dmBtn.textContent = '💡';
            } else {
                if (dmBtn) dmBtn.textContent = '🌙';
            }
        });
    } else {
        loadPhrases().then(() => {
            rebuildPhraseButtons(panel);
            const activeCategory = panel.querySelector('.categoryBtn.active');
            if (activeCategory) {
                filterByCategory(activeCategory.dataset.category);
            }
        });
    }

    return panel;
}

function switchTab(tabId) {
    const tabs = document.querySelectorAll('.promptHelperTab');
    const panels = document.querySelectorAll('.promptHelperPanel');

    tabs.forEach(tab => {
        if (tab.dataset.target === tabId) {
            tab.classList.add(ACTIVE_TAB_CLASS);
        } else {
            tab.classList.remove(ACTIVE_TAB_CLASS);
        }
    });

    panels.forEach(panel => {
        if (panel.dataset.panel === tabId) {
            panel.classList.add(ACTIVE_PANEL_CLASS);
        } else {
            panel.classList.remove(ACTIVE_PANEL_CLASS);
        }
    });

    recalculateAndApplyPanelHeight();
    setTimeout(() => positionPanel(), 0);
}

function switchHeaderMode(mode) {
    const categoryFilter = document.querySelector('.promptHelperCategoryFilter');
    const tabContainer = document.getElementById(TAB_CONTAINER_ID);
    const contentPanels = document.querySelectorAll('.promptHelperPanel[data-panel="prompts"], .promptHelperPanel[data-panel="system"]');
    const chatNavPanel = document.querySelector('.promptHelperPanel[data-panel="chatNav"]');
    const dropZone = document.getElementById(DROP_ZONE_ID);

    if (mode === 'prompts') {
        if (categoryFilter) categoryFilter.style.display = 'flex';
        if (tabContainer) tabContainer.style.display = 'flex';
        contentPanels.forEach(panel => {
            panel.style.display = '';
        });
        if (chatNavPanel) chatNavPanel.style.display = 'none';
        if (dropZone) dropZone.style.display = 'block';
    } else if (mode === 'chatNav') {
        if (categoryFilter) categoryFilter.style.display = 'none';
        if (tabContainer) tabContainer.style.display = 'none';
        contentPanels.forEach(panel => panel.style.display = 'none');
        if (dropZone) dropZone.style.display = 'none';
        if (chatNavPanel) {
            chatNavPanel.style.display = 'block';
            updateChatNavContent();
        }
    }

    recalculateAndApplyPanelHeight();
    setTimeout(() => positionPanel(), 0);
}

function detectMessages() {
    const messages = [];
    const siteConfigs = {
        'claude.ai': {
            userSelector: '[data-testid="user-message"]',
            contentSelector: '.whitespace-pre-wrap'
        },
        'chatgpt.com': {
            userSelector: '[data-message-author-role="user"]',
            contentSelector: '.whitespace-pre-wrap'
        },
        'gemini.google.com': {
            userSelector: '.user-query-bubble-with-background',
            contentSelector: '.query-text-line'
        }
    };

    const hostname = window.location.hostname;
    const config = Object.entries(siteConfigs).find(([domain]) => hostname.includes(domain));

    if (!config) return messages;

    const [, selectors] = config;
    const userMessages = document.querySelectorAll(selectors.userSelector);

    userMessages.forEach((msg, index) => {
        const contentEl = msg.querySelector(selectors.contentSelector);
        if (contentEl && contentEl.textContent.trim().length > 20) {
            const text = contentEl.textContent.trim();
            const preview = text.length > 80 ? text.substring(0, 77) + '...' : text;
            messages.push({
                element: msg,
                text: text,
                preview: preview,
                index: index
            });
        }
    });

    return messages.reverse();
}

function scrollToMessage(messageElement) {
    messageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    messageElement.style.transition = 'background-color 0.3s ease';
    messageElement.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';

    setTimeout(() => {
        messageElement.style.backgroundColor = '';
    }, 2000);
}

function updateChatNavContent() {
    const chatNavContent = document.querySelector('.promptHelperChatNav');
    if (!chatNavContent) return;

    const messages = detectMessages();
    chatNavContent.innerHTML = '';

    if (messages.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'chatNavEmpty';
        emptyMsg.textContent = 'No messages found in this conversation.';
        chatNavContent.appendChild(emptyMsg);
        return;
    }

    messages.forEach((message, index) => {
        const messageItem = document.createElement('div');
        messageItem.className = 'chatNavItem';

        const messageText = document.createElement('div');
        messageText.className = 'chatNavText';
        messageText.textContent = message.preview;
        messageText.title = message.text;

        const messageIndex = document.createElement('div');
        messageIndex.className = 'chatNavIndex';
        messageIndex.textContent = `#${messages.length - index}`;

        messageItem.appendChild(messageText);
        messageItem.appendChild(messageIndex);

        messageItem.addEventListener('click', () => {
            scrollToMessage(message.element);
            const panel = document.getElementById(PANEL_ID);
            if (panel) panel.style.display = 'none';
            updateToggleButtonText();
        });

        chatNavContent.appendChild(messageItem);
    });
}

function handleHotkey(event) {
    if (event.altKey && event.ctrlKey && !event.shiftKey && !event.metaKey && event.key >= '1' && event.key <= '9') {
        const activeEl = document.activeElement;
        if (activeEl && activeEl.matches(TARGET_ELEMENT_SELECTOR) && !activeEl.closest(`#${PANEL_ID}`)) {
            const index = parseInt(event.key) - 1;
            const hotkeyedItemCount = 9;

            const activeCategory = document.querySelector('.categoryBtn.active');
            const activeCategoryId = activeCategory ? activeCategory.dataset.category : 'coding';

            const categoryButtons = buttonDefinitions.filter(btn => btn.categoryId === activeCategoryId);

            if (index >= 0 && index < categoryButtons.length && index < hotkeyedItemCount) {
                event.preventDefault();
                event.stopPropagation();
                lastFocusedTextarea = activeEl;
                const item = categoryButtons[index];

                if (item.atomicPhraseIds && Array.isArray(item.atomicPhraseIds) && item.atomicPhraseIds.length > 0) {
                    const phrasesToInsert = [];
                    let allFound = true;
                    item.atomicPhraseIds.forEach(id => {
                        const phrase = atomicPhrases[id];
                        if (phrase) {
                            phrasesToInsert.push(phrase);
                        } else {
                            console.warn(`Prompt Helper Hotkey: Atomic phrase ID "${id}" not found for hotkeyed item "${item.label}".`);
                            allFound = false;
                        }
                    });

                    if (allFound) {
                        phrasesToInsert.forEach(p => addTextToTarget(p, false));
                    } else {
                        alert(`Prompt Helper Hotkey: Failed to execute action for "${item.label}" completely. Some parts missing. Check console.`);
                    }
                } else {
                    console.warn(`Prompt Helper Hotkey: Item index ${index} ("${item.label}") has invalid definition (missing or empty atomicPhraseIds).`);
                }
            }
        }
    }
}

function updateToggleButtonText() {
    const panel = document.getElementById(PANEL_ID);
    const textBtn = document.getElementById(TOGGLE_BTN_TEXT_ID);
    if (textBtn) {
        const isPanelVisible = panel && panel.style.display !== 'none';
        textBtn.textContent = isPanelVisible ? 'Hide AI Helper' : 'Show AI Helper';
        textBtn.title = isPanelVisible ? 'Hide AI Helper Panel' : 'Show AI Helper Panel';
    }
}

async function initializePrompHelper() {
    if (document.getElementById(PANEL_ID)) {
        console.log('AI Prompt Helper: Already initialized. Skipping.');
        return;
    }
    console.log('AI Prompt Helper: Initializing...');

    focusInListener = trackFocus;
    document.addEventListener('focusin', focusInListener, true);

    try {
        await loadPhrases();
        console.log("AI Prompt Helper: Phrases loaded.");
    } catch (error) {
        console.error("AI Prompt Helper: Critical error during phrase loading.", error);
    }

    keyDownListener = handleHotkey;
    document.addEventListener('keydown', keyDownListener, true);

    dragEndListener = function(e) { resetDragStates(); };
    document.addEventListener('dragend', dragEndListener, true);

    dropListener = function(e) {
        if (!e.target.closest(`#${DROP_ZONE_ID}`)) {
            setTimeout(resetDragStates, 100);
        }
    };
    document.addEventListener('drop', dropListener, true);

    const toggleButtonContainer = document.createElement('div');
    toggleButtonContainer.id = TOGGLE_BTN_ID;

    const dragHandle = document.createElement('div');
    dragHandle.id = TOGGLE_BTN_HANDLE_ID;
    dragHandle.innerHTML = '⋮⋮';
    dragHandle.title = 'Drag to reposition';

    const textButton = document.createElement('div');
    textButton.id = TOGGLE_BTN_TEXT_ID;
    textButton.textContent = 'Show AI Helper';
    textButton.title = 'Click to show/hide the AI Helper panel';

    toggleButtonContainer.appendChild(dragHandle);
    toggleButtonContainer.appendChild(textButton);

    const textButtonClickHandler = function () {
        let panel = document.getElementById(PANEL_ID);
        if (!panel) {
            panel = createOrUpdatePanel();
        }
        if (!panel) return;

        const isCurrentlyVisible = panel.style.display === 'block';
        if (isCurrentlyVisible) {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
            loadPhrases().then(() => {
                rebuildPhraseButtons(panel);
                positionPanel();
            }).catch(err => {
                console.error("Error loading phrases:", err);
            });
        }
        updateToggleButtonText();
    };

    StorageAPI.get(STORAGE_KEY_BTN_POS).then(result => {
        const savedPos = result[STORAGE_KEY_BTN_POS] || null;
        if (savedPos && savedPos.left && savedPos.top) {
            toggleButtonContainer.style.left = savedPos.left;
            toggleButtonContainer.style.top = savedPos.top;
            toggleButtonContainer.style.right = 'auto';
            toggleButtonContainer.style.bottom = 'auto';
        } else {
            toggleButtonContainer.style.top = '20px';
            toggleButtonContainer.style.right = '15px';
        }

        dragHandle.addEventListener('mousedown', startDrag);
        textButton.addEventListener('click', textButtonClickHandler);

        document.body.appendChild(toggleButtonContainer);

        const initialPanel = createOrUpdatePanel();
        if (initialPanel) {
            initialPanel.style.display = 'none';
        }
        updateToggleButtonText();

    }).catch(error => {
        console.error("AI Prompt Helper: Failed to get button position from storage. Using defaults.", error);
        toggleButtonContainer.style.top = '20px';
        toggleButtonContainer.style.right = '15px';

        dragHandle.addEventListener('mousedown', startDrag);
        textButton.addEventListener('click', textButtonClickHandler);

        document.body.appendChild(toggleButtonContainer);

        const initialPanel = createOrUpdatePanel();
        if (initialPanel) {
            initialPanel.style.display = 'none';
        }
        updateToggleButtonText();
    });

    messageListener = (message, sender, sendResponse) => {
        if (message.action === 'deactivatePromptHelper') {
            deactivatePromptHelper();
        }
    };
    if (browser && browser.runtime && browser.runtime.onMessage) {
        browser.runtime.onMessage.addListener(messageListener);
    } else {
        console.error("AI Prompt Helper: browser.runtime.onMessage is not available.");
    }
}

function deactivatePromptHelper() {
    console.log('%c AI Prompt Helper: Deactivating...', 'color: red; font-weight: bold;');
    isUIRendered = false;

    const panel = document.getElementById(PANEL_ID);
    if (panel) {
        panel.remove();
        console.log("    Removed Panel element.");
    } else {
        console.log("    Panel element not found to remove.");
    }
    const toggleButton = document.getElementById(TOGGLE_BTN_ID);
    if (toggleButton) {
        toggleButton.remove();
        console.log("    Removed Toggle Button element.");
    } else {
        console.log("    Toggle Button element not found to remove.");
    }

    console.log("    Keeping event listeners intact for future reactivation.");

    console.log("    Keeping message listener intact for reactivation.");

    atomicPhrases = {};
    buttonDefinitions = [];
    customPhrases = {};
    lastFocusedTextarea = null;
    console.log("    Reset state variables.");

    console.log("    Keeping aiPromptHelperInitialized flag for reactivation.");

    console.log('%c AI Prompt Helper: Deactivated successfully.', 'color: red; font-weight: bold;');
}

async function renderUIAndAttachListeners() {
    if (isUIRendered || document.getElementById(TOGGLE_BTN_ID)) {
        console.log('AI Prompt Helper: UI render requested, but already rendered or toggle button exists. Skipping.');
        return;
    }
    console.log('AI Prompt Helper: Rendering UI and attaching listeners...');

    try {
        await loadPhrases();
        console.log("AI Prompt Helper: Phrases loaded for rendering.");
    } catch (error) {
        console.error("AI Prompt Helper: Critical error during phrase loading. UI might be incomplete.", error);
    }

    if (!focusInListener) {
        focusInListener = trackFocus;
        document.addEventListener('focusin', focusInListener, true);
    }
    if (!keyDownListener) {
        keyDownListener = handleHotkey;
        document.addEventListener('keydown', keyDownListener, true);
    }
    if (!dragEndListener) {
        dragEndListener = function(e) { resetDragStates(); };
        document.addEventListener('dragend', dragEndListener, true);
    }
    if (!dropListener) {
        dropListener = function(e) {
            if (!e.target.closest(`#${DROP_ZONE_ID}`)) {
                setTimeout(resetDragStates, 100);
            }
        };
        document.addEventListener('drop', dropListener, true);
    }

    const toggleButtonContainer = document.createElement('div');
    toggleButtonContainer.id = TOGGLE_BTN_ID;
    const dragHandle = document.createElement('div');
    dragHandle.id = TOGGLE_BTN_HANDLE_ID;
    dragHandle.innerHTML = '⋮⋮';
    dragHandle.title = 'Drag to reposition';
    const textButton = document.createElement('div');
    textButton.id = TOGGLE_BTN_TEXT_ID;
    textButton.textContent = 'Show AI Helper';
    textButton.title = 'Click to show/hide the AI Helper panel';
    toggleButtonContainer.appendChild(dragHandle);
    toggleButtonContainer.appendChild(textButton);

    const textButtonClickHandler = function () {
        let panel = document.getElementById(PANEL_ID);
        if (!panel) {
            panel = createOrUpdatePanel();
        }
        if (!panel) return;

        const ensurePhrasesAndToggle = async () => {
            try {
                if (!Object.keys(atomicPhrases).length && !Object.keys(customPhrases).length) {
                    await loadPhrases();
                }
                rebuildPhraseButtons(panel);

                const isCurrentlyVisible = panel.style.display === 'block';
                if (isCurrentlyVisible) {
                    panel.style.display = 'none';
                } else {
                    panel.style.display = 'block';
                    positionPanel();
                }
                updateToggleButtonText();
            } catch (err) {
                console.error("AI Prompt Helper: Error loading phrases during panel toggle:", err);
                alert("AI Prompt Helper: Error loading data. Panel might not work correctly.");
            }
        };
        ensurePhrasesAndToggle();
    };

    StorageAPI.get(STORAGE_KEY_BTN_POS).then(result => {
        const savedPos = result[STORAGE_KEY_BTN_POS] || null;
        if (savedPos && savedPos.left && savedPos.top) {
            toggleButtonContainer.style.left = savedPos.left;
            toggleButtonContainer.style.top = savedPos.top;
        } else {
            toggleButtonContainer.style.top = '20px';
            toggleButtonContainer.style.right = '15px';
        }
        toggleButtonContainer.style.right = savedPos?.left ? 'auto' : toggleButtonContainer.style.right;
        toggleButtonContainer.style.bottom = savedPos?.top ? 'auto' : toggleButtonContainer.style.bottom;
    }).catch(error => {
        console.error("AI Prompt Helper: Failed to get button position, using defaults.", error);
        toggleButtonContainer.style.top = '20px';
        toggleButtonContainer.style.right = '15px';
    }).finally(() => {
        if (!document.getElementById(TOGGLE_BTN_ID)) {
            document.body.appendChild(toggleButtonContainer);
            dragHandle.addEventListener('mousedown', startDrag);
            textButton.addEventListener('click', textButtonClickHandler);

            const initialPanel = createOrUpdatePanel();
            if (initialPanel) initialPanel.style.display = 'none';
            updateToggleButtonText();
            isUIRendered = true;
            console.log('AI Prompt Helper: UI Rendered.');
        }
    });
}

function initializePromptHelper() {
    console.log(`%c >> initializePromptHelper called - ${new Date().toLocaleTimeString()}`, 'color: green;');

    if (window.aiPromptHelperInitialized) {
        console.log('%c AI Prompt Helper: Listener setup already done (aiPromptHelperInitialized=true). Skipping.', 'color: orange;');
        return;
    }
    window.aiPromptHelperInitialized = true;
    console.log(`%c    Set window.aiPromptHelperInitialized = true - ${new Date().toLocaleTimeString()}`, 'color: green;');

    console.log(`%c    Setting up message listener... - ${new Date().toLocaleTimeString()}`, 'color: green;');

    messageListener = (message, sender, sendResponse) => {
        console.log(`%c    >> Message Listener Received: ${message.action} - ${new Date().toLocaleTimeString()}`, 'color: purple; font-weight: bold;');
        if (message.action === 'renderContentUI') {
            console.log("       >> Calling renderUIAndAttachListeners...");
            renderUIAndAttachListeners();
        } else if (message.action === 'deactivatePromptHelper') {
            console.log("       >> Calling deactivatePromptHelper...");
            deactivatePromptHelper();
        }
        else if (message.action === 'resetButtonPosition') {
            console.log("       >> Resetting button position...");
            const toggleBtn = document.getElementById(TOGGLE_BTN_ID);
            if (toggleBtn) {
                toggleBtn.style.top = '20px';
                toggleBtn.style.right = '15px';
                toggleBtn.style.left = 'auto';
                toggleBtn.style.bottom = 'auto';
                StorageAPI.remove(STORAGE_KEY_BTN_POS);
            }
        }
    };

    if (browser?.runtime?.onMessage) {
        try {
            console.log(`%c       Attempting browser.runtime.onMessage.addListener...`, 'color: cyan;');
            browser.runtime.onMessage.addListener(messageListener);
            console.log(`%c       SUCCESS: Message listener added. - ${new Date().toLocaleTimeString()}`, 'color: green; font-weight: bold;');
        } catch (error) {
            console.error(`%c       ERROR adding message listener:`, 'color: red; font-weight: bold;', error);
            window.aiPromptHelperInitialized = false;
        }
    } else {
        console.error("AI Prompt Helper: browser.runtime.onMessage is not available. Cannot receive commands.");
        window.aiPromptHelperInitialized = false;
    }
    console.log(`%c << initializePromptHelper finished - ${new Date().toLocaleTimeString()}`, 'color: green;');
}

function isNonTextFile(file) {
    const MAX_TEXT_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_TEXT_FILE_SIZE) {
        console.warn(`Prompt Helper: File "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(2)}MB, which exceeds the 10MB limit for text files.`);
        return true;
    }

    const nonTextMimeTypes = [
        'image/', 'audio/', 'video/', 'application/pdf',
        'application/zip', 'application/x-zip',
        'application/x-zip-compressed', 'application/octet-stream',
        'application/x-msdownload', 'application/vnd.ms-',
        'application/x-executable', 'application/x-deb',
        'application/x-rpm', 'application/x-ms-installer',
        'application/x-shockwave-flash', 'application/java-archive',
        'application/x-7z-compressed', 'application/x-rar-compressed'
    ];

    if (file.type) {
        return nonTextMimeTypes.some(type =>
            type.endsWith('/') ? file.type.startsWith(type) : file.type === type
        );
    }

    const nonTextExtensions = [
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.ico', '.svg',
        '.mp3', '.wav', '.ogg', '.mp4', '.avi', '.mov', '.wmv',
        '.pdf', '.zip', '.rar', '.7z', '.tar', '.gz', '.exe',
        '.dll', '.bin', '.dat', '.db', '.mdb', '.accdb',
        '.iso', '.dmg', '.apk', '.app', '.msi', '.deb', '.rpm'
    ];

    const fileName = file.name.toLowerCase();
    return nonTextExtensions.some(ext => fileName.endsWith(ext));
}

function recalculateAndApplyPanelHeight() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel || panel.style.display === 'none') return;

    panel.style.height = 'auto';
    panel.style.maxHeight = `${PANEL_MAX_HEIGHT_ESTIMATE}px`;
    const panelComputedStyle = window.getComputedStyle(panel);
    const contentHeight = panel.scrollHeight +
        parseFloat(panelComputedStyle.paddingTop) +
        parseFloat(panelComputedStyle.paddingBottom);
    const newHeight = Math.min(PANEL_MAX_HEIGHT_ESTIMATE, contentHeight);
    panel.style.height = `${newHeight - parseFloat(panelComputedStyle.paddingTop) - parseFloat(panelComputedStyle.paddingBottom)}px`;
}

initializePromptHelper();