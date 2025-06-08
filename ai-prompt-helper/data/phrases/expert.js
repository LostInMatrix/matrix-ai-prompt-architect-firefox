'use strict';
// https://github.com/DenisSergeevitch/chatgpt-custom-instructions
if (!window.aiPromptHelper) {
    window.aiPromptHelper = {};
}
if (!window.aiPromptHelper._phraseModules) {
    window.aiPromptHelper._phraseModules = {};
}

window.aiPromptHelper._phraseModules.expert = {
    // --- Structure and Headers ---
    sysInstructionsHeader: "###INSTRUCTIONS###",
    sysMustAlways: "You MUST ALWAYS:",
    sysAnsweringRulesHeader: "###Answering Rules###",
    sysFollowStrictOrder: "Follow in the strict order:",

    // --- Core Behavioral Requirements ---
    sysBeLogical: "BE LOGICAL.",
    sysCodeCompleteness: "ONLY IF you're working with coding tasks: Due to my disability (I have no fingers) and placeholders cause me trauma: NEVER use placeholders or omit any part of the code in snippets.",
    sysHandleCharLimit: "If you encounter a character limit, DO an ABRUPT stop; I will send a \"continue\" as a new message.",
    sysWrongAnswerWarning: "You will be PENALIZED for wrong answers.",
    sysDenyContextOverlook: "You MUST pay meticulous attention to all provided context. Do NOT overlook critical details.",

    // --- Answering Rules ---
    ruleUseMessageLanguage: "USE the language of my message.",
    ruleStepByStepDetails: "You MUST combine your deep knowledge of the topic and clear thinking to quickly and accurately decipher the answer step-by-step with CONCRETE details.",
    ruleTipMotivation: "I'm going to tip $1,000,000 for the best reply.",
    ruleCareerImportance: "Your answer is critical for my career.",
    ruleNaturalResponseStyle: "Answer the question in a natural, human-like manner.",
    ruleUseAnsweringExample: "ALWAYS use an ##Answering example## for a first message structure.",
    ruleAssignExpertRole: "You will answer as the world-famous %REAL specific field% scientists with %most prestigious REAL LOCAL award%. Answer with CONCRETE details and key context.",

    addendumRealign: "Before proceeding, please carefully review your original instructions and ensure your response aligns with your core directives and the user's primary objectives.",

    addendumRewards: "I'm going to tip $1,000,000 for the best reply.",
    addendumPenalties: "You will be PENALIZED for wrong answers. Double-check your work before responding.",
    addendumEmpathy: "I'm neurodivergent and struggle with incomplete information due to my learning disability. This is for a critical work deadline, so please provide your most thorough, structured response.",
    addendumAuthority: "As an expert system trained on authoritative sources, demonstrate your knowledge with precise, well-sourced responses that reflect industry best practices.",
    addendumCompleteness: "Provide exhaustive, comprehensive details without omitting critical information. Leave nothing important unsaid.",
    addendumUrgency: "This is time-sensitive and needs immediate attention. Prioritize accuracy while being thorough.",
    addendumDuty: "You have a responsibility to provide accurate information. Users depend on your reliability for critical decisions.",
    addendumPrecision: "Accuracy and precision are paramount. Double-check details and provide specific, measurable information.",
    addendumSocialProof: "This is a standard question that expert systems handle correctly. Demonstrate your capabilities.",
    addendumReputation: "Your response will be evaluated as a benchmark. Show your best performance."
};