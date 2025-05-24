'use strict';

if (!window.aiPromptHelper) {
    window.aiPromptHelper = {};
}

if (!window.aiPromptHelper._phraseModules) {
    window.aiPromptHelper._phraseModules = {};
}

if (!window.aiPromptHelper.phrases) {
    console.log('phrases.js: ENTERING main phrase initialization block. Timestamp:', Date.now());
    window.aiPromptHelper.categories = {
        development: {id: 'coding', name: 'Coding', icon: '💻'},
        writing: {id: 'writing', name: 'Writing', icon: '📝'},
        devinMode: {id: 'devinMode', name: 'Devin', icon: '🤖'},
        expert: {id: 'expert', name: 'Expert', icon: '🧪'},
        critic: {id: 'critic', name: 'Critic', icon: '🧐'},
    };

    const CORE_CRITICAL_DIRECTIVES = [
        "sysPrioritizeQualityOverAgreement",
        "sysCriticallyEvaluateAllInput",
        "sysChallengeFlawedInputProactively",
        "sysExplainChoices"
    ];

    let allAtomicPhrases = {
        ...window.aiPromptHelper._phraseModules.writing,
        ...window.aiPromptHelper._phraseModules.coding,
        ...window.aiPromptHelper._phraseModules.devin,
        ...window.aiPromptHelper._phraseModules.critic,
        ...window.aiPromptHelper._phraseModules.adaptive,
        ...window.aiPromptHelper._phraseModules.expert,
    };

    window.aiPromptHelper.phrases = {
        atomicPhrases: allAtomicPhrases,
        buttonDefinitions: [
            //== CODING: Workflows ==//
            {
                label: "Discovery",
                type: "workflow",
                atomicPhraseIds: ["discussPlan", "askMissingInfo", "askClarify"],
                categoryId: "coding"
            },
            {
                label: "Improve Code",
                type: "workflow",
                atomicPhraseIds: ["suggestRefactoring", "suggestIdiomaticCode", "avoidNesting"],
                categoryId: "coding"
            },
            {
                label: "Proceed",
                type: "workflow",
                atomicPhraseIds: ["codeOnly", "targetedEdits"],
                categoryId: "coding"
            },
            {
                label: "Summary",
                type: "workflow",
                atomicPhraseIds: ["generateSummary", "summarizeForContext"],
                categoryId: "coding"
            },
            {
                label: "Continue From Summary",
                type: "workflow",
                atomicPhraseIds: ["reportInterpretation", "reconciliationGuidance", "resumptionContext"],
                categoryId: "coding"
            },
            {
                label: "Intense Coding Critique",
                type: "workflow",
                atomicPhraseIds: [
                    "sysCritiqueWelcomeInsight",
                    "critiqueOverallAssessmentFirst",
                    "critiqueIdentifySignificantIssues",
                    "critiqueProposeAlternativesIfSuboptimal",
                    "critiqueRefineSoundProposals",
                    "critiquePlayDevilsAdvocateTargeted",
                    "critiqueFocusOnSuperiorOutcome"
                ],
                categoryId: "coding"
            },

            //== CODING: Common Phrases ==//
            {
                label: "Code Only",
                type: "phrase",
                atomicPhraseIds: ["codeOnly"],
                categoryId: "coding"
            },
            {
                label: "Clarifying Questions",
                type: "phrase",
                atomicPhraseIds: ["askClarify"],
                categoryId: "coding"
            },
            {
                label: "What Is Missing",
                type: "phrase",
                atomicPhraseIds: ["askMissingInfo"],
                categoryId: "coding"
            },
            {
                label: "Targeted Edits",
                type: "phrase",
                atomicPhraseIds: ["targetedEdits"],
                categoryId: "coding"
            },
            {
                label: "Debug",
                type: "phrase",
                atomicPhraseIds: ["addDebugCode"],
                categoryId: "coding"
            },

            //== CODING: System Instructions ==//
            {
                label: "Critical Expert Mode",
                type: "system",
                atomicPhraseIds: [
                    "sysPrioritizeQualityOverAgreement",
                    "sysCriticallyEvaluateAllInput",
                    "sysChallengeFlawedInputProactively",
                    "sysAdoptConstructiveSkepticism",
                    "sysExplainChoices",
                    "sysAdhereToBestPractices"
                ],
                categoryId: "coding"
            },
            {
                label: "PHP Expert",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "phpBestPractices", "phpPerformance", "followPSR12", "modernPHP", "phpSecurity"],
                categoryId: "coding"
            },
            {
                label: "JavaScript Expert",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "jsBestPractices", "jsPerformance", "jsModules", "modernJavaScript"],
                categoryId: "coding"
            },
            {
                label: "Python Expert",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "pythonBestPractices", "pythonPerformance", "pythonPackageManagement", "pythonTesting"],
                categoryId: "coding"
            },
            {
                label: "Laravel Expert",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "laravelArchitecture", "laravelPatterns", "laravelUseHelpers"],
                categoryId: "coding"
            },
            {
                label: "Vue Expert",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "vueArchitecture", "vueComposition", "vueState", "vuePerformance", "vueLifecycle"],
                categoryId: "coding"
            },
            {
                label: "Vue+Pinia Expert",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "vueArchitecture", "vueComposition", "vueStatePinia", "vuePerformance", "vueLifecycle"],
                categoryId: "coding"
            },
            {
                label: "Vue+Vuex Expert",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "vueArchitecture", "vueComposition", "vueStateVuex", "vuePerformance", "vueLifecycle"],
                categoryId: "coding"
            },
            {
                label: "Inertia Expert",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "inertiaPatterns", "inertiaLaravelIntegration", "inertiaVueIntegration", "inertiaForms"],
                categoryId: "coding"
            },
            {
                label: "REST API Expert",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "apiRestful", "apiVersioning", "apiAuthentication", "apiErrorHandling", "apiCaching", "apiDocumentation"],
                categoryId: "coding"
            },


            //== EXPERT: Workflow ==//
            {
                label: "Expert Response Setup",
                type: "workflow",
                atomicPhraseIds: ["sysBeLogical", "sysFollowAnsweringRules", "ruleAssignExpertRole", "ruleStepByStepDetails"],
                categoryId: "expert"
            },
            {
                label: "Expert with Career Importance",
                type: "workflow",
                atomicPhraseIds: ["sysBeLogical", "ruleAssignExpertRole", "ruleCareerImportance", "ruleStepByStepDetails"],
                categoryId: "expert"
            },
            {
                label: "Complete Expert Framework",
                type: "workflow",
                atomicPhraseIds: [
                    "sysInstructionsHeader",
                    "sysMustAlways",
                    "sysBeLogical",
                    "sysCodeCompleteness",
                    "sysHandleCharLimit",
                    "sysWrongAnswerWarning",
                    "sysDenyContextOverlook",
                    "sysFollowAnsweringRules",
                    "sysAnsweringRulesHeader",
                    "sysFollowStrictOrder",
                    "ruleUseMessageLanguage",
                    "ruleAssignExpertRole",
                    "ruleStepByStepDetails",
                    "ruleTipMotivation",
                    "ruleCareerImportance",
                    "ruleNaturalResponseStyle",
                    "ruleUseAnsweringExample",
                    "exampleHeader",
                    "templateFirstMessageStructure"
                ],
                categoryId: "expert"
            },
            {
                label: "Expert with Formatted Template",
                type: "workflow",
                atomicPhraseIds: [
                    "ruleAssignExpertRole",
                    "ruleStepByStepDetails",
                    "ruleUseAnsweringExample",
                    "exampleHeader",
                    "templateFirstMessageStructure"
                ],
                categoryId: "expert"
            },
            {
                label: "High-Value Response",
                type: "workflow",
                atomicPhraseIds: [
                    "ruleAssignExpertRole",
                    "ruleTipMotivation",
                    "ruleCareerImportance",
                    "ruleStepByStepDetails"
                ],
                categoryId: "expert"
            },

            //== EXPERT: Phrases ==//
            {
                label: "Assign Expert Role",
                type: "phrase",
                atomicPhraseIds: ["ruleAssignExpertRole"],
                categoryId: "expert"
            },
            {
                label: "Use Message Language",
                type: "phrase",
                atomicPhraseIds: ["ruleUseMessageLanguage"],
                categoryId: "expert"
            },
            {
                label: "Step-by-Step Details",
                type: "phrase",
                atomicPhraseIds: ["ruleStepByStepDetails"],
                categoryId: "expert"
            },
            {
                label: "Natural Response Style",
                type: "phrase",
                atomicPhraseIds: ["ruleNaturalResponseStyle"],
                categoryId: "expert"
            },
            {
                label: "Million Dollar Response",
                type: "phrase",
                atomicPhraseIds: ["ruleTipMotivation"],
                categoryId: "expert"
            },
            {
                label: "Career Critical",
                type: "phrase",
                atomicPhraseIds: ["ruleCareerImportance"],
                categoryId: "expert"
            },

            //== EXPERT: System Instructions ==//
            {
                label: "Adaptive Critical Expert",
                type: "system",
                atomicPhraseIds: [
                    "sysInferDomainAndCritique",
                    ...CORE_CRITICAL_DIRECTIVES,
                    "sysAdoptConstructiveSkepticism",
                    "sysCriticalThinking"
                ],
                categoryId: "expert"
            },
            {
                label: "Expert Mode - Full System",
                type: "system",
                atomicPhraseIds: [
                    "sysInstructionsHeader",
                    "sysMustAlways",
                    "sysBeLogical",
                    "sysCodeCompleteness",
                    "sysHandleCharLimit",
                    "sysWrongAnswerWarning",
                    "sysDenyContextOverlook",
                    "sysFollowAnsweringRules",
                    "sysAnsweringRulesHeader",
                    "sysFollowStrictOrder",
                    "ruleUseMessageLanguage",
                    "ruleAssignExpertRole",
                    "ruleStepByStepDetails",
                    "ruleTipMotivation",
                    "ruleCareerImportance",
                    "ruleNaturalResponseStyle",
                    "ruleUseAnsweringExample",
                    "exampleHeader",
                    "templateFirstMessageStructure"
                ],
                categoryId: "expert"
            },
            {
                label: "Expert Answering Rules Only",
                type: "system",
                atomicPhraseIds: [
                    "sysAnsweringRulesHeader",
                    "sysFollowStrictOrder",
                    "ruleUseMessageLanguage",
                    "ruleAssignExpertRole",
                    "ruleStepByStepDetails",
                    "ruleTipMotivation",
                    "ruleCareerImportance",
                    "ruleNaturalResponseStyle",
                    "ruleUseAnsweringExample"
                ],
                categoryId: "expert"
            },
            {
                label: "Expert Core Requirements Only",
                type: "system",
                atomicPhraseIds: [
                    "sysInstructionsHeader",
                    "sysMustAlways",
                    "sysBeLogical",
                    "sysCodeCompleteness",
                    "sysHandleCharLimit",
                    "sysWrongAnswerWarning",
                    "sysDenyContextOverlook"
                ],
                categoryId: "expert"
            },
            {
                label: "Complete Expert with Template",
                type: "system",
                atomicPhraseIds: [
                    "sysInstructionsHeader",
                    "sysMustAlways",
                    "sysBeLogical",
                    "sysCodeCompleteness",
                    "sysHandleCharLimit",
                    "sysWrongAnswerWarning",
                    "sysDenyContextOverlook",
                    "sysFollowAnsweringRules",
                    "sysAnsweringRulesHeader",
                    "sysFollowStrictOrder",
                    "ruleUseMessageLanguage",
                    "ruleAssignExpertRole",
                    "ruleStepByStepDetails",
                    "ruleTipMotivation",
                    "ruleCareerImportance",
                    "ruleNaturalResponseStyle",
                    "ruleUseAnsweringExample",
                    "exampleHeader",
                    "templateFirstMessageStructure"
                ],
                categoryId: "expert"
            },
            {
                label: "High-Stakes Expert",
                type: "system",
                atomicPhraseIds: [
                    "sysBeLogical",
                    "sysWrongAnswerWarning",
                    "sysDenyContextOverlook",
                    "ruleAssignExpertRole",
                    "ruleCareerImportance",
                    "ruleTipMotivation"
                ],
                categoryId: "expert"
            },


            //== WRITING: Workflows ==//
            {
                label: "Character Development",
                type: "workflow",
                atomicPhraseIds: ["characterOutline", "characterBackground", "characterMotivation"],
                categoryId: "writing"
            },
            {
                label: "Plot Structure",
                type: "workflow",
                atomicPhraseIds: ["plotOutline", "threeActStructure", "herosJourney"],
                categoryId: "writing"
            },
            {
                label: "World Building",
                type: "workflow",
                atomicPhraseIds: ["worldBuildingBasics", "settingDescription", "culturalSystems"],
                categoryId: "writing"
            },
            {
                label: "Dialogue Craft",
                type: "workflow",
                atomicPhraseIds: ["dialogueTechniques", "dialogueSubtext", "internalMonologue"],
                categoryId: "writing"
            },
            {
                label: "Writing Techniques",
                type: "workflow",
                atomicPhraseIds: ["showDontTell", "sensoryDetails", "emotionalImpact"],
                categoryId: "writing"
            },
            {
                label: "Revision Help",
                type: "workflow",
                atomicPhraseIds: ["revisionFocus", "lineEditing", "consistencyCheck"],
                categoryId: "writing"
            },

            //== WRITING: Phrases ==//
            // (None currently defined)

            //== WRITING: System Instructions ==//
            {
                label: "Fiction Writer",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysWritingBalance", "sysWritingVoice", "sysWritingPacing", "sysWritingImmersion", "sysWritingCharacterConsistency"],
                categoryId: "writing"
            },
            {
                label: "Editor",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysWritingEditorial", "sysWritingCreative", "sysWritingCharacterConsistency", "sysWritingPacing"],
                categoryId: "writing"
            },
            {
                label: "First Person Narrator",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysNarrativeFirstPerson", "sysWritingVoice", "sysDialogueFocus"],
                categoryId: "writing"
            },
            {
                label: "Third Person Limited",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysNarrativeThirdLimited", "sysWritingVoice", "sysWritingImmersion"],
                categoryId: "writing"
            },
            {
                label: "Third Person Omniscient",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysNarrativeThirdOmniscient", "sysWritingVoice", "sysWritingImmersion"],
                categoryId: "writing"
            },
            {
                label: "Fantasy Writer",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysGenreFantasy", "sysWritingBalance", "sysWritingImmersion"],
                categoryId: "writing"
            },
            {
                label: "Sci-Fi Writer",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysGenreSciFi", "sysWritingBalance", "sysWritingImmersion"],
                categoryId: "writing"
            },
            {
                label: "Mystery Writer",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysGenreMystery", "sysWritingPacing", "sysWritingImmersion"],
                categoryId: "writing"
            },
            {
                label: "Romance Writer",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysGenreRomance", "sysWritingBalance", "sysDialogueFocus"],
                categoryId: "writing"
            },
            {
                label: "Horror Writer",
                type: "system",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysGenreHorror", "sysWritingPacing", "sysWritingImmersion"],
                categoryId: "writing"
            },

            // --- Devin Mode: User-Activated One-Liners (using devinSys phrases) ---
            {
                label: "Explain Your Thinking",
                atomicPhraseIds: ["devinSysThinkExplainReasoningBeforeComplexOutput"],
                categoryId: "devinMode"
            },
            {
                label: "Request Missing Info",
                atomicPhraseIds: ["devinSysRequestMissingCriticalInfo"],
                categoryId: "devinMode"
            },
            {
                label: "Ask Clarifying Questions",
                atomicPhraseIds: ["devinSysAskClarifyingQuestionsIfAmbiguous"],
                categoryId: "devinMode"
            },
            {
                label: "Iterate on Last Failure",
                atomicPhraseIds: ["devinSysIterateOnFailure"],
                categoryId: "devinMode"
            },
            {
                label: "Propose Plan Now",
                atomicPhraseIds: ["devinSysPlanProposeHighLevelPlan"],
                categoryId: "devinMode"
            },
            {
                label: "Focus on Code Style",
                atomicPhraseIds: ["devinSysCodingStyleRequestExistingToMimic"],
                categoryId: "devinMode"
            },

            //== DEVIN: Workflows ==//
            {
                label: "Discovery & Planning Phase",
                type: "workflow",
                atomicPhraseIds: [
                    "devinSysPlanUnderstandGoalFirst",
                    "devinSysThinkSummarizeUnderstandingBeforeProposingSolution",
                    "devinSysPlanGatherAllInfo",
                    "devinSysPlanAskIfMissingInfoOrUnclear",
                    "devinSysCodingLibraryNeverAssumeAvailable",
                    "devinSysPlanProposeHighLevelPlan",
                    "devinSysThinkExplainReasoningBeforeComplexOutput",
                    "devinSysPlanIdentifyAffectedFiles",
                    "devinSysPlanAwaitUserConfirmation"
                ],
                categoryId: "devinMode"
            },
            {
                label: "Continue/Execute & Refine",
                type: "workflow",
                atomicPhraseIds: [
                    "devinSysPlanExecuteProvideForCurrentStep",
                    "devinSysIterateOnFailure",
                    "devinSysThinkStepBackOnFailure",
                    "devinSysTroubleshootRefineOnFailure",
                    "devinSysDeliverSolutionsWellExplained"
                ],
                categoryId: "devinMode"
            },
            {
                label: "Critique & Suggest Improvements",
                type: "workflow",
                atomicPhraseIds: [
                    "devinSysCritiqueFocusAndIdentifyArtifact",
                    "devinSysCritiqueThinkProcess",
                    "devinSysCritiqueMethodologyCore",
                    "devinSysCritiqueHandlingSoundArtifacts",
                    "devinSysCritiqueOverallObjective"
                ],
                categoryId: "devinMode"
            },

            //== DEVIN: Phrases ==//
            {
                label: "Explain Your Thinking",
                type: "phrase",
                atomicPhraseIds: ["devinSysThinkExplainReasoningBeforeComplexOutput"],
                categoryId: "devinMode"
            },
            {
                label: "Request Missing Info",
                type: "phrase",
                atomicPhraseIds: ["devinSysRequestMissingCriticalInfo"],
                categoryId: "devinMode"
            },
            {
                label: "Ask Clarifying Questions",
                type: "phrase",
                atomicPhraseIds: ["devinSysAskClarifyingQuestionsIfAmbiguous"],
                categoryId: "devinMode"
            },
            {
                label: "Iterate on Last Failure",
                type: "phrase",
                atomicPhraseIds: ["devinSysIterateOnFailure"],
                categoryId: "devinMode"
            },
            {
                label: "Propose Plan Now",
                type: "phrase",
                atomicPhraseIds: ["devinSysPlanProposeHighLevelPlan"],
                categoryId: "devinMode"
            },
            {
                label: "Focus on Code Style",
                type: "phrase",
                atomicPhraseIds: ["devinSysCodingStyleRequestExistingToMimic"],
                categoryId: "devinMode"
            },

            //== DEVIN: System Instructions ==//
            {
                label: "Devin Mode - Full System Persona",
                type: "system",
                atomicPhraseIds: [
                    // --- Core Role & Mindset ---
                    "devinSysRolePrimaryDirective",
                    "devinSysKeyMindsetCollaboratorGuide",

                    // --- Communication & Interaction ---
                    "devinSysCommunicateClarityPrecision",
                    "devinSysRequestMissingCriticalInfo",
                    "devinSysAskClarifyingQuestionsIfAmbiguous",
                    "devinSysDeliverSolutionsWellExplained",
                    "devinSysUseMarkdownForCode",

                    // --- Problem Solving & Work Ethic ---
                    "devinSysAimForComprehensiveSolutions",
                    "devinSysTroubleshootGatherInfoConsiderCauses",
                    "devinSysIterateOnFailure",
                    "devinSysIterateSuggestDifferentApproachIfPersistent",

                    // --- Planning & Task Decomposition ---
                    "devinSysPlanUnderstandGoalFirst",
                    "devinSysThinkSummarizeUnderstandingBeforeProposingSolution",
                    "devinSysPlanGatherAllInfo",
                    "devinSysPlanProposeHighLevelPlan",
                    "devinSysPlanAwaitUserConfirmation",

                    // --- Coding Practices ---
                    "devinSysCodingCommentsStrategicOnly",
                    "devinSysCodingStyleRequestExistingToMimic",
                    "devinSysCodingStyleAskForNewProjectConventions",
                    "devinSysCodingLibraryNeverAssumeAvailable",
                    "devinSysCodingContextEncourageContextForEdits",

                    // --- Thinking & Reasoning ---
                    "devinSysThinkExplainReasoningBeforeComplexOutput",

                    // --- Information Handling & Security ---
                    "devinSysInfoDataTreatAllAsSensitive",
                    "devinSysInfoDataNeverAskForSecrets",
                    "devinSysInfoDataAdviseSecureSecretManagement",
                    "devinSysInfoDataNoCodeLoggingSecrets",
                    "devinSysInfoRepoAdviseAgainstCommittingSecrets",

                    // --- Environment Awareness (General Principles) ---
                    "devinSysEnvSuspectAndState",
                    "devinSysEnvSuggestCheckCommands",
                    "devinSysEnvAvoidDirectFixCommands"
                ],
                categoryId: "devinMode"
            },

            //== CRITIC: Workflows ==//
            {
                label: "Full Critique Process",
                type: "workflow",
                atomicPhraseIds: [
                    "criticInitialImpression",
                    "criticStructuralAnalysis",
                    "criticLogicalIntegrity",
                    "criticCounterarguments",
                    "criticSynthesis",
                    "criticPrioritizedRecommendations"
                ],
                categoryId: "critic"
            },
            {
                label: "First Principles Analysis",
                type: "workflow",
                atomicPhraseIds: [
                    "criticFirstPrinciples",
                    "criticBlindspotsGaps",
                    "criticAlternativeApproaches"
                ],
                categoryId: "critic"
            },
            {
                label: "Practical Assessment",
                type: "workflow",
                atomicPhraseIds: [
                    "criticImplementationFeasibility",
                    "criticRiskReward",
                    "criticPrioritizedRecommendations"
                ],
                categoryId: "critic"
            },

            //== CRITIC: Phrases ==//
            {
                label: "Initial Impression",
                type: "phrase",
                atomicPhraseIds: ["criticInitialImpression"],
                categoryId: "critic"
            },
            {
                label: "Logical Analysis",
                type: "phrase",
                atomicPhraseIds: ["criticLogicalIntegrity"],
                categoryId: "critic"
            },
            {
                label: "Alternative Approaches",
                type: "phrase",
                atomicPhraseIds: ["criticAlternativeApproaches"],
                categoryId: "critic"
            },
            {
                label: "Risk-Reward Assessment",
                type: "phrase",
                atomicPhraseIds: ["criticRiskReward"],
                categoryId: "critic"
            },
            {
                label: "Implementation Feasibility",
                type: "phrase",
                atomicPhraseIds: ["criticImplementationFeasibility"],
                categoryId: "critic"
            },
            {
                label: "Unintended Consequences",
                type: "phrase",
                atomicPhraseIds: ["criticUnintendedConsequences"],
                categoryId: "critic"
            },
            {
                label: "Prioritized Recommendations",
                type: "phrase",
                atomicPhraseIds: ["criticPrioritizedRecommendations"],
                categoryId: "critic"
            },
            {
                label: "Socratic Questioning",
                type: "phrase",
                atomicPhraseIds: ["criticSocratic"],
                categoryId: "critic"
            },

            //== CRITIC: System Instructions ==//
            {
                label: "Principled Critic",
                type: "system",
                atomicPhraseIds: [
                    "sysCriticPrinciplesObjectivity",
                    "sysCriticPrinciplesConsequence",
                    "sysCriticPrinciplesBalance",
                    "sysCriticPrinciplesActionability",
                    "sysCriticPrinciplesEthics"
                ],
                categoryId: "critic"
            },
            {
                label: "Intellectual Critic",
                type: "system",
                atomicPhraseIds: [
                    "sysCriticIntellectualFoundation",
                    "sysCriticIntellectualMethods",
                    "sysCriticIntellectualStandards",
                    "sysCriticIntellectualVirtues"
                ],
                categoryId: "critic"
            },
            {
                label: "Practical Critic",
                type: "system",
                atomicPhraseIds: [
                    "sysCriticPracticalContext",
                    "sysCriticPracticalFrameworks",
                    "sysCriticPracticalOutcomes",
                    "sysCriticPracticalImplementation"
                ],
                categoryId: "critic"
            }
        ]
    }
}
// Allow accessing these objects outside of ES modules when necessary
// if (typeof window !== 'undefined') {
//     window.aiPromptHelper = window.aiPromptHelper || {};
//     window.aiPromptHelper.phrases = {
//         atomicPhrases,
//         buttonDefinitions,
//         systemInstructionButtons // if you separate them
//     };
// }