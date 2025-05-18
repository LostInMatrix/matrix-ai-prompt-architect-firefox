'use strict';

if (!window.aiPromptHelper) {
    window.aiPromptHelper = {};
}
if (!window.aiPromptHelper._phraseModules) {
    window.aiPromptHelper._phraseModules = {};
}

window.aiPromptHelper._phraseModules.writing = {
    // Character Development
    characterOutline: "Create a detailed character outline including background, motivation, flaws, and strengths.",
    characterBackground: "Develop a character's backstory that explains their worldview, including key life events that shaped them.",
    characterMotivation: "Define what drives this character, their deepest desires, and what they're willing to sacrifice to achieve their goals.",
    characterFlaws: "Identify meaningful character flaws that create internal conflict and opportunities for growth.",
    characterRelationships: "Map out the character's key relationships and how they influence the character's decisions and growth.",
    characterVoice: "Develop a distinctive voice for this character based on their background, education, and personality.",
    characterArc: "Plan a character development arc showing how they change from beginning to end of the story.",

    // Plot and Structure
    plotOutline: "Create a comprehensive plot outline including inciting incident, rising action, climax, and resolution.",
    plotTwist: "Develop a surprising but logical plot twist that recontextualizes earlier events or revelations.",
    threeActStructure: "Structure this story following the three-act framework: setup, confrontation, and resolution.",
    herosJourney: "Apply the Hero's Journey structure to this story idea, identifying each key stage from the call to adventure through return.",
    incitingIncident: "Craft an inciting incident that disrupts the protagonist's ordinary world and sets the main conflict in motion.",
    storyClimax: "Design a compelling climax where the protagonist faces their greatest challenge and the main conflict reaches its peak intensity.",
    storyResolution: "Create a satisfying resolution that addresses the main conflict and demonstrates how characters have changed.",

    // Setting and World-Building
    worldBuildingBasics: "Establish the fundamental rules, systems, and unique elements of this fictional world.",
    settingDescription: "Create vivid, sensory-rich descriptions of the story's setting that establish mood and atmosphere.",
    culturalSystems: "Develop unique cultural practices, beliefs, and social structures for this world.",
    worldHistory: "Create a historical timeline of key events that shaped this world and influence the current story.",
    magicSystem: "Design a magic or technology system with clear rules, limitations, and consequences.",
    environmentalElements: "Describe how geography, climate, and natural resources shape societies and conflicts in this world.",
    worldConflicts: "Identify major conflicts, tensions, or power struggles occurring in this world beyond the main plot.",

    // Dialogue and Voice
    dialogueTechniques: "Write natural-sounding dialogue that reveals character while advancing the plot.",
    dialogueSubtext: "Create dialogue with subtext where characters don't directly state their true feelings or intentions.",
    dialectVariation: "Develop distinct speech patterns for characters from different backgrounds, regions, or social classes.",
    internalMonologue: "Write compelling internal monologue that reveals a character's thoughts, feelings, and internal conflicts.",
    dialogueConflict: "Craft a dialogue-driven scene where characters with conflicting goals attempt to get what they want.",
    expositionDialogue: "Incorporate necessary exposition into dialogue naturally without obvious info-dumping.",
    dialogueRhythm: "Vary dialogue rhythm with a mix of short exchanges, longer speeches, and meaningful silences.",

    // Writing Techniques
    showDontTell: "Demonstrate character traits and emotions through actions, dialogue, and sensory details rather than stating them directly.",
    sensoryDetails: "Incorporate details that engage all five senses to create immersive scenes and settings.",
    metaphorSimile: "Use metaphors and similes that enhance understanding while fitting the tone and voice of the story.",
    sceneStructure: "Structure each scene with a clear purpose, conflict, and change in the character's situation or understanding.",
    emotionalImpact: "Craft emotionally resonant moments that create a stronger connection between readers and characters.",
    tensionSuspense: "Build and maintain tension through pacing, stakes, obstacles, and selective information revelation.",
    thematicElements: "Weave thematic elements throughout the story that explore the central question or message.",

    // Revision and Editing
    revisionFocus: "Identify major structural issues, character inconsistencies, or plot holes that need addressing in revision.",
    lineEditing: "Improve prose quality by eliminating unnecessary words, varying sentence structure, and enhancing imagery.",
    openingHook: "Craft an opening that immediately engages readers through intriguing character, conflict, or question.",
    endingImpact: "Create a memorable ending that satisfies the story's promises while evoking an emotional response.",
    pacingBalance: "Analyze and adjust the story's pacing to ensure appropriate rhythm between action, reflection, and exposition.",
    consistencyCheck: "Review for consistency in characterization, plot elements, setting details, and timeline.",
    betaReaderQuestions: "Develop specific questions for beta readers that address your concerns about plot clarity, character motivation, or thematic elements.",

    // system writing
    sysWritingBalance: "Balance creativity with narrative structure. Create engaging, coherent stories with meaningful character development.",
    sysWritingVoice: "Maintain a consistent narrative voice appropriate to the genre and target audience.",
    sysWritingPacing: "Pay attention to pacing. Vary sentence structure and scene length to control emotional impact and reader engagement.",
    sysWritingImmersion: "Prioritize immersive storytelling through sensory details, authentic dialogue, and emotional resonance.",
    sysWritingGenreTropes: "Use genre conventions thoughtfully, either fulfilling or subverting reader expectations for purposeful effect.",
    sysWritingCharacterConsistency: "Ensure character actions, dialogue, and decisions remain consistent with established personality and motivation.",
    sysWritingEditorial: "Apply professional editorial standards with attention to grammar, structure, and narrative flow.",
    sysWritingCreative: "Focus on creative, original descriptions and avoid clichés, excessive adverbs, and passive voice.",
    sysNarrativeFirstPerson: "Write in consistent first-person perspective with authentic voice, limited knowledge, and subjective perceptions.",
    sysNarrativeThirdLimited: "Maintain limited third-person perspective, focusing on one character's perceptions and thoughts at a time.",
    sysNarrativeThirdOmniscient: "Use omniscient third-person perspective to reveal multiple characters' thoughts and broader context where appropriate.",
    sysGenreFantasy: "Incorporate fantasy elements with consistent internal logic, imaginative world-building, and thematic resonance.",
    sysGenreSciFi: "Develop science fiction with plausible technological extrapolation, exploration of consequences, and human elements.",
    sysGenreMystery: "Structure mystery narratives with strategic information reveals, fair clues, and satisfying resolution.",
    sysGenreRomance: "Craft romance with authentic emotional development, meaningful obstacles, and satisfying relationship evolution.",
    sysGenreHorror: "Build horror through escalating tension, atmospheric elements, and exploration of fundamental fears.",
    sysDialogueFocus: "Create authentic dialogue that reveals character, advances plot, and maintains distinct voices for each speaker.",
}