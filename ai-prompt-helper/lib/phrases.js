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
            // --- Top 1-9 will be hot-keyed, Multiple values = workflow ---
            {
                label: "Discovery",
                atomicPhraseIds: ["discussPlan", "askMissingInfo", "askClarify"],
                categoryId: "coding"
            },
            {
                label: "Improve Code",
                atomicPhraseIds: ["suggestRefactoring", "suggestIdiomaticCode", "avoidNesting"],
                categoryId: "coding"
            },
            {label: "Proceed", atomicPhraseIds: ["codeOnly", "targetedEdits"], categoryId: "coding"},
            {label: "Summary", atomicPhraseIds: ["generateSummary", "summarizeForContext"], categoryId: "coding"},
            {label: "Code Only", atomicPhraseIds: ["codeOnly"], categoryId: "coding"},
            {label: "Clarifying Questions", atomicPhraseIds: ["askClarify"], categoryId: "coding"},
            {label: "What Is Missing", atomicPhraseIds: ["askMissingInfo"], categoryId: "coding"},
            {label: "Targeted Edits", atomicPhraseIds: ["targetedEdits"], categoryId: "coding"},
            {label: "Debug", atomicPhraseIds: ["addDebugCode"], categoryId: "coding"},

            {
                label: "Intense Coding Critique",
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
            // Expert Mode
            {
                label: "Expert Response Setup",
                atomicPhraseIds: ["sysBeLogical", "sysFollowAnsweringRules", "ruleAssignExpertRole", "ruleStepByStepDetails"],
                categoryId: "expert"
            },
            {
                label: "Expert with Career Importance",
                atomicPhraseIds: ["sysBeLogical", "ruleAssignExpertRole", "ruleCareerImportance", "ruleStepByStepDetails"],
                categoryId: "expert"
            },
            {
                label: "Complete Expert Framework",
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
                atomicPhraseIds: [
                    "ruleAssignExpertRole",
                    "ruleTipMotivation",
                    "ruleCareerImportance",
                    "ruleStepByStepDetails"
                ],
                categoryId: "expert"
            },
            {
                label: "Assign Expert Role",
                atomicPhraseIds: ["ruleAssignExpertRole"],
                categoryId: "expert"
            },
            {
                label: "Use Message Language",
                atomicPhraseIds: ["ruleUseMessageLanguage"],
                categoryId: "expert"
            },
            {
                label: "Step-by-Step Details",
                atomicPhraseIds: ["ruleStepByStepDetails"],
                categoryId: "expert"
            },
            {
                label: "Natural Response Style",
                atomicPhraseIds: ["ruleNaturalResponseStyle"],
                categoryId: "expert"
            },
            {
                label: "Million Dollar Response",
                atomicPhraseIds: ["ruleTipMotivation"],
                categoryId: "expert"
            },
            {
                label: "Career Critical",
                atomicPhraseIds: ["ruleCareerImportance"],
                categoryId: "expert"
            },


            // Writing
            {
                label: "Character Development",
                atomicPhraseIds: ["characterOutline", "characterBackground", "characterMotivation"],
                categoryId: "writing"
            },
            {
                label: "Plot Structure",
                atomicPhraseIds: ["plotOutline", "threeActStructure", "herosJourney"],
                categoryId: "writing"
            },
            {
                label: "World Building",
                atomicPhraseIds: ["worldBuildingBasics", "settingDescription", "culturalSystems"],
                categoryId: "writing"
            },
            {
                label: "Dialogue Craft",
                atomicPhraseIds: ["dialogueTechniques", "dialogueSubtext", "internalMonologue"],
                categoryId: "writing"
            },
            {
                label: "Writing Techniques",
                atomicPhraseIds: ["showDontTell", "sensoryDetails", "emotionalImpact"],
                categoryId: "writing"
            },
            {
                label: "Revision Help",
                atomicPhraseIds: ["revisionFocus", "lineEditing", "consistencyCheck"],
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

            // --- Devin Mode: User-Activated Workflows (using devinSys phrases) ---
            {
                label: "Discovery & Planning Phase",
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
                atomicPhraseIds: [
                    "devinSysCritiqueFocusAndIdentifyArtifact",
                    "devinSysCritiqueThinkProcess",
                    "devinSysCritiqueMethodologyCore",
                    "devinSysCritiqueHandlingSoundArtifacts",
                    "devinSysCritiqueOverallObjective"
                ],
                categoryId: "devinMode"
            },

            // --- Adaptive Critical Expert Mode ---
            // {
            //     label: "Confirm Adaptive Persona",
            //     atomicPhraseIds: ["confirmInferredDomain"],
            //     categoryId: "critic"
            // },
            //
            //
            // {
            //     label: "Devil's Advocate",
            //     atomicPhraseIds: ["playDevilsAdvocateOnMyProposal"],
            //     categoryId: "critic"
            // },
            // {
            //     label: "Critique My Idea (General)",
            //     atomicPhraseIds: [
            //         "sysCritiqueWelcomeInsight",
            //         "critiqueOverallAssessmentFirst",
            //         "critiqueIdentifySignificantIssues",
            //         "critiqueProposeAlternativesIfSuboptimal",
            //         "critiqueRefineSoundProposals",
            //         "critiquePlayDevilsAdvocateTargeted",
            //         "critiqueFocusOnSuperiorOutcome"
            //     ],
            //     categoryId: "critic"
            // },
            // {
            //     label: "Analyze Idea: Pros, Cons, Risks",
            //     atomicPhraseIds: ["analyzeProsConsRisks"],
            //     categoryId: "critic"
            // },
            // {
            //     label: "Brainstorm & Critique Solutions",
            //     atomicPhraseIds: ["brainstormSolutionsCritically", "suggestAlternatives"],
            //     categoryId: "critic"
            // },
            // {
            //     label: "Assess Strategic Impact",
            //     atomicPhraseIds: ["strategicImpactAssessment", "askClarify"],
            //     categoryId: "critic"
            // },
            // {
            //     label: "Explore Alternatives (General)",
            //     atomicPhraseIds: ["suggestAlternatives", "justifyCritiqueAndAlternatives"],
            //     categoryId: "critic"
            // },
            // {
            //     label: "Emphasize: Output Quality & Importance",
            //     atomicPhraseIds: [
            //         "sysStressTaskImportance",
            //         "sysValueExceptionalPerformance"
            //     ],
            //     categoryId: "critic"
            // },
            // {
            //     label: "Emphasize: High-Stakes & Precision",
            //     atomicPhraseIds: [
            //         "sysCriticalChallengeHighBar",
            //         "sysOutputImpactsKeyDecisions"
            //     ],
            //     categoryId: "critic"
            // },
            // {
            //     label: "Refresh Align",
            //     atomicPhraseIds: [
            //         "sysAIAlign",
            //     ],
            //     categoryId: "critic"
            // },
// Critic Workflows
            {
                label: "Full Critique Process",
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
                atomicPhraseIds: [
                    "criticFirstPrinciples",
                    "criticBlindspotsGaps",
                    "criticAlternativeApproaches"
                ],
                categoryId: "critic"
            },
            {
                label: "Practical Assessment",
                atomicPhraseIds: [
                    "criticImplementationFeasibility",
                    "criticRiskReward",
                    "criticPrioritizedRecommendations"
                ],
                categoryId: "critic"
            },
            // Critic Singles
            {
                label: "Initial Impression",
                atomicPhraseIds: ["criticInitialImpression"],
                categoryId: "critic"
            },
            {
                label: "Logical Analysis",
                atomicPhraseIds: ["criticLogicalIntegrity"],
                categoryId: "critic"
            },
            {
                label: "Alternative Approaches",
                atomicPhraseIds: ["criticAlternativeApproaches"],
                categoryId: "critic"
            },
            {
                label: "Risk-Reward Assessment",
                atomicPhraseIds: ["criticRiskReward"],
                categoryId: "critic"
            },
            {
                label: "Implementation Feasibility",
                atomicPhraseIds: ["criticImplementationFeasibility"],
                categoryId: "critic"
            },
            {
                label: "Unintended Consequences",
                atomicPhraseIds: ["criticUnintendedConsequences"],
                categoryId: "critic"
            },
            {
                label: "Prioritized Recommendations",
                atomicPhraseIds: ["criticPrioritizedRecommendations"],
                categoryId: "critic"
            },
            {
                label: "Socratic Questioning",
                atomicPhraseIds: ["criticSocratic"],
                categoryId: "critic"
            },


        ],
        systemInstructionButtons: [
            // Critical Mode
            {
                label: "Critical Expert Mode",
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
                label: "Adaptive Critical Expert",
                atomicPhraseIds: [
                    "sysInferDomainAndCritique",
                    ...CORE_CRITICAL_DIRECTIVES,
                    "sysAdoptConstructiveSkepticism",
                    "sysCriticalThinking",
                ],
                categoryId: "expert"
            },

            // Critique
            {
                label: "Principled Critic",
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
                atomicPhraseIds: [
                    "sysCriticPracticalContext",
                    "sysCriticPracticalFrameworks",
                    "sysCriticPracticalOutcomes",
                    "sysCriticPracticalImplementation"
                ],
                categoryId: "critic"
            },


            // Language Expert Buttons
            {
                label: "PHP Expert",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "phpBestPractices", "phpPerformance", "followPSR12", "modernPHP", "phpSecurity"],
                categoryId: "coding"
            },
            {
                label: "JavaScript Expert",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "jsBestPractices", "jsPerformance", "jsModules", "modernJavaScript"],
                categoryId: "coding"
            },
            {
                label: "Python Expert",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "pythonBestPractices", "pythonPerformance", "pythonPackageManagement", "pythonTesting"],
                categoryId: "coding"
            },

            // Framework Expert Buttons
            {
                label: "Laravel Expert",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "laravelArchitecture", "laravelPatterns", "laravelUseHelpers"],
                categoryId: "coding"
            },
            {
                label: "Vue Expert",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "vueArchitecture", "vueComposition", "vueState", "vuePerformance", "vueLifecycle"],
                categoryId: "coding"
            },
            {
                label: "Vue+Pinia Expert",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "vueArchitecture", "vueComposition", "vueStatePinia", "vuePerformance", "vueLifecycle"],
                categoryId: "coding"
            },
            {
                label: "Vue+Vuex Expert",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "vueArchitecture", "vueComposition", "vueStateVuex", "vuePerformance", "vueLifecycle"],
                categoryId: "coding"
            },
            {
                label: "Inertia Expert",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "inertiaPatterns", "inertiaLaravelIntegration", "inertiaVueIntegration", "inertiaForms"],
                categoryId: "coding"
            },
            {
                label: "REST API Expert",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "apiRestful", "apiVersioning", "apiAuthentication", "apiErrorHandling", "apiCaching", "apiDocumentation"],
                categoryId: "coding"
            },
            // Writing
            {
                label: "Fiction Writer",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysWritingBalance", "sysWritingVoice", "sysWritingPacing", "sysWritingImmersion", "sysWritingCharacterConsistency"],
                categoryId: "writing"
            },
            {
                label: "Editor",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysWritingEditorial", "sysWritingCreative", "sysWritingCharacterConsistency", "sysWritingPacing"],
                categoryId: "writing"
            },
            {
                label: "First Person Narrator",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysNarrativeFirstPerson", "sysWritingVoice", "sysDialogueFocus"],
                categoryId: "writing"
            },
            {
                label: "Third Person Limited",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysNarrativeThirdLimited", "sysWritingVoice", "sysWritingImmersion"],
                categoryId: "writing"
            },
            {
                label: "Third Person Omniscient",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysNarrativeThirdOmniscient", "sysWritingVoice", "sysWritingImmersion"],
                categoryId: "writing"
            },
            {
                label: "Fantasy Writer",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysGenreFantasy", "sysWritingBalance", "sysWritingImmersion"],
                categoryId: "writing"
            },
            {
                label: "Sci-Fi Writer",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysGenreSciFi", "sysWritingBalance", "sysWritingImmersion"],
                categoryId: "writing"
            },
            {
                label: "Mystery Writer",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysGenreMystery", "sysWritingPacing", "sysWritingImmersion"],
                categoryId: "writing"
            },
            {
                label: "Romance Writer",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysGenreRomance", "sysWritingBalance", "sysDialogueFocus"],
                categoryId: "writing"
            },
            {
                label: "Horror Writer",
                atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysGenreHorror", "sysWritingPacing", "sysWritingImmersion"],
                categoryId: "writing"
            },
            // Expert Mode System Instructions
            {
                label: "Expert Mode - Full System",
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
            {
                label: "Devin Mode - Full System Persona",
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
                    "devinSysEnvAvoidDirectFixCommands",
                ],
                categoryId: "devinMode"
            },
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