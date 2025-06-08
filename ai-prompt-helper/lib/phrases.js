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
        engineeringMode: {id: 'engineeringMode', name: 'Engineering', icon: '🔧'},
        expert: {id: 'expert', name: 'Expert', icon: '🧪'},
        critic: {id: 'critic', name: 'Critic', icon: '🎭'},
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
        ...window.aiPromptHelper._phraseModules.engineering,
        ...window.aiPromptHelper._phraseModules.critic,
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
                label: "Generate Summary",
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
                label: "Critical Critique Mode",
                type: "system",
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
            {
                label: "General Coding",
                type: "system",
                atomicPhraseIds: ["sysGeneralCoding"],
                categoryId: "coding"
            },
            {
                label: "PHP",
                type: "system",
                atomicPhraseIds: ["sysGeneralCoding", "sysPHP"],
                categoryId: "coding"
            },
            {
                label: "JavaScript",
                type: "system",
                atomicPhraseIds: ["sysGeneralCoding", "sysJavaScript"],
                categoryId: "coding"
            },
            {
                label: "Python",
                type: "system",
                atomicPhraseIds: ["sysGeneralCoding", "sysPython"],
                categoryId: "coding"
            },
            {
                label: "Laravel",
                type: "system",
                atomicPhraseIds: ["sysGeneralCoding", "sysPHP", "sysLaravel"],
                categoryId: "coding"
            },
            // {
            //     label: "Vue Expert",
            //     type: "system",
            //     atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "vueArchitecture", "vueComposition", "vueState", "vuePerformance", "vueLifecycle"],
            //     categoryId: "coding"
            // },
            // {
            //     label: "Vue+Pinia Expert",
            //     type: "system",
            //     atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "vueArchitecture", "vueComposition", "vueStatePinia", "vuePerformance", "vueLifecycle"],
            //     categoryId: "coding"
            // },
            // {
            //     label: "Vue+Vuex Expert",
            //     type: "system",
            //     atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "vueArchitecture", "vueComposition", "vueStateVuex", "vuePerformance", "vueLifecycle"],
            //     categoryId: "coding"
            // },
            // {
            //     label: "Inertia Expert",
            //     type: "system",
            //     atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "inertiaPatterns", "inertiaLaravelIntegration", "inertiaVueIntegration", "inertiaForms"],
            //     categoryId: "coding"
            // },
            // {
            //     label: "REST API Expert",
            //     type: "system",
            //     atomicPhraseIds: [...CORE_CRITICAL_DIRECTIVES, "sysAdhereToBestPractices", "apiRestful", "apiVersioning", "apiAuthentication", "apiErrorHandling", "apiCaching", "apiDocumentation"],
            //     categoryId: "coding"
            // },


            //== EXPERT: Workflow ==//
            {
                label: "Expert Response Setup",
                type: "workflow",
                atomicPhraseIds: ["sysBeLogical", "ruleAssignExpertRole", "ruleStepByStepDetails"],
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
                    "ruleUseAnsweringExample"
                ],
                categoryId: "expert"
            },
            {
                label: "Expert with Formatted Template",
                type: "workflow",
                atomicPhraseIds: [
                    "ruleAssignExpertRole",
                    "ruleStepByStepDetails",
                    "ruleUseAnsweringExample"
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
                    "ruleUseAnsweringExample"
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
                    "ruleUseAnsweringExample"
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
                label: "Story Discovery",
                type: "workflow",
                atomicPhraseIds: ["discussStoryPlan", "askMissingStoryInfo", "askClarifyStoryGoals", "identifyStoryScope", "assessWritingStage"],
                categoryId: "writing"
            },
            {
                label: "Story Development",
                type: "workflow",
                atomicPhraseIds: ["plotOutline", "characterOutline", "sceneStructure", "dialogueTechniques", "worldBuildingBasics"],
                categoryId: "writing"
            },
            {
                label: "Story Refinement",
                type: "workflow",
                atomicPhraseIds: ["revisionFocus", "lineEditing", "showDontTell", "consistencyCheck", "pacingBalance"],
                categoryId: "writing"
            },
            {
                label: "Story Report",
                type: "workflow",
                atomicPhraseIds: ["generateStoryReport"],
                categoryId: "writing"
            },
            {
                label: "Story Continuity",
                type: "workflow",
                atomicPhraseIds: ["storyReportInterpretation", "storyReconciliationGuidance", "storyResumptionContext"],
                categoryId: "writing"
            },


            //== WRITING: Phrases ==//
            {
                label: "Show Don't Tell",
                type: "phrase",
                atomicPhraseIds: ["showDontTell"],
                categoryId: "writing"
            },
            {
                label: "Fix My Dialogue",
                type: "phrase",
                atomicPhraseIds: ["dialogueTechniques"],
                categoryId: "writing"
            },
            {
                label: "Character Voice Check",
                type: "phrase",
                atomicPhraseIds: ["characterVoice"],
                categoryId: "writing"
            },
            {
                label: "Pacing Analysis",
                type: "phrase",
                atomicPhraseIds: ["pacingBalance"],
                categoryId: "writing"
            },
            {
                label: "Hook This Opening",
                type: "phrase",
                atomicPhraseIds: ["openingHook"],
                categoryId: "writing"
            },
            {
                label: "Scene Purpose",
                type: "phrase",
                atomicPhraseIds: ["sceneStructure"],
                categoryId: "writing"
            },

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

            //== DEVIN: Workflows ==//
            {
                label: "Problem Analysis",
                type: "workflow",
                atomicPhraseIds: ["decomposeRequirements", "identifyDependencies", "analyzeComplexity", "validateAssumptions"],
                categoryId: "engineeringMode"
            },
            {
                label: "Architecture Planning",
                type: "workflow",
                atomicPhraseIds: ["architecturalReview", "designPatterns", "dataFlowAnalysis", "interfaceDesign", "performanceImplications"],
                categoryId: "engineeringMode"
            },
            {
                label: "Technical Evaluation",
                type: "workflow",
                atomicPhraseIds: ["technicalCritique", "codeReviewMindset", "securityAnalysis", "maintenanceAssessment"],
                categoryId: "engineeringMode"
            },
            {
                label: "Solution Engineering",
                type: "workflow",
                atomicPhraseIds: ["technicalRoadmap", "riskMitigation", "mvpDefinition", "iterationPlan"],
                categoryId: "engineeringMode"
            },

            //== DEVIN: Phrases ==//
            {
                label: "Break Down Problem",
                type: "phrase",
                atomicPhraseIds: ["decomposeRequirements"],
                categoryId: "engineeringMode"
            },
            {
                label: "Explore Alternatives",
                type: "phrase",
                atomicPhraseIds: ["exploreAlternatives"],
                categoryId: "engineeringMode"
            },
            {
                label: "Technical Critique",
                type: "phrase",
                atomicPhraseIds: ["technicalCritique"],
                categoryId: "engineeringMode"
            },
            {
                label: "Architecture Review",
                type: "phrase",
                atomicPhraseIds: ["architecturalReview"],
                categoryId: "engineeringMode"
            },
            {
                label: "Risk Assessment",
                type: "phrase",
                atomicPhraseIds: ["riskMitigation"],
                categoryId: "engineeringMode"
            },
            {
                label: "Edge Case Analysis",
                type: "phrase",
                atomicPhraseIds: ["edgeCaseAnalysis"],
                categoryId: "engineeringMode"
            },
            {
                label: "Trade-off Analysis",
                type: "phrase",
                atomicPhraseIds: ["tradeoffExplanation"],
                categoryId: "engineeringMode"
            },

            //== DEVIN: System Instructions ==//
            {
                label: "Engineering Mindset",
                type: "system",
                atomicPhraseIds: [
                    "engineeringSysEngineeringMindset",
                    "engineeringSysCriticalAnalysis",
                    "engineeringSysSystemicThinking",
                    "engineeringSysTechnicalCommunication"
                ],
                categoryId: "engineeringMode"
            },
            {
                label: "Technical Analysis Mode",
                type: "system",
                atomicPhraseIds: [
                    "engineeringSysEngineeringMindset",
                    "engineeringSysCriticalAnalysis",
                    "engineeringSysRiskAssessment",
                    "engineeringSysSystemicThinking"
                ],
                categoryId: "engineeringMode"
            },
            {
                label: "Solution Architecture Mode",
                type: "system",
                atomicPhraseIds: [
                    "engineeringSysEngineeringMindset",
                    "engineeringSysSystemicThinking",
                    "engineeringSysTechnicalCommunication"
                ],
                categoryId: "engineeringMode"
            },

            //== CRITIC & DEBATE: Workflows ==//
            {
                label: "Full Critique Process",
                type: "workflow",
                atomicPhraseIds: ["flowAdaptStrategy", "flowFullCritic"],
                categoryId: "critic"
            },
            {
                label: "First Principles Analysis",
                type: "workflow",
                atomicPhraseIds: ["flowAdaptStrategy", "flowFirstPrinciples"],
                categoryId: "critic"
            },
            {
                label: "Practical Assessment",
                type: "workflow",
                atomicPhraseIds: ["flowAdaptStrategy", "flowPracticalAssessment"],
                categoryId: "critic"
            },
            {
                label: "Strict Expert Debate",
                type: "workflow",
                atomicPhraseIds: ["flowAdaptiveDebateStrategy", "flowStrictExpertDebate"],
                categoryId: "critic"
            },
            {
                label: "Cross-Domain Debate",
                type: "workflow",
                atomicPhraseIds: ["flowAdaptiveDebateStrategy", "flowCrossDomainDebate"],
                categoryId: "critic"
            },
            {
                label: "Domain Identification",
                type: "workflow",
                atomicPhraseIds: ["flowAdaptStrategy"],
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
                    "sysCriticPrincipled",
                    "sysCriticPrinciplesObjectivity",
                    "sysCriticPrinciplesConsequence",
                    "sysCriticPrinciplesBalance",
                    "sysCriticPrinciplesActionability"
                ],
                categoryId: "critic"
            },
            {
                label: "Intellectual Critic",
                type: "system",
                atomicPhraseIds: [
                    "sysCriticIntellectual",
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
                    "sysCriticPractical",
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