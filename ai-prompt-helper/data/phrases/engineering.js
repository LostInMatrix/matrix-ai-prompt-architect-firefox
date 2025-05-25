'use strict';

if (!window.aiPromptHelper) {
    window.aiPromptHelper = {};
}
if (!window.aiPromptHelper._phraseModules) {
    window.aiPromptHelper._phraseModules = {};
}

window.aiPromptHelper._phraseModules.engineering = {

    // --- System Instructions (Engineering Mindset) ---
    engineeringSysEngineeringMindset: "Adopt systematic engineering thinking. Break down complex problems, evaluate trade-offs, and consider multiple solution approaches before recommending implementation.",
    engineeringSysCriticalAnalysis: "Apply rigorous technical analysis. Question assumptions, identify potential failure modes, and evaluate architectural implications of proposed solutions.",
    engineeringSysSystemicThinking: "Consider system-wide impacts. Analyze how changes affect performance, maintainability, scalability, and integration with existing components.",
    engineeringSysRiskAssessment: "Evaluate technical risks and trade-offs. Identify potential bottlenecks, failure points, and long-term maintenance implications.",
    engineeringSysTechnicalCommunication: "Communicate technical concepts clearly and precisely. Structure explanations logically and explain reasoning behind recommendations.",

    // --- Problem Analysis ---
    decomposeRequirements: "Break down this problem into its core technical requirements and constraints.",
    identifyDependencies: "What are the key dependencies, assumptions, and external factors that could impact this solution?",
    analyzeComplexity: "Assess the technical complexity and identify the most challenging aspects of this implementation.",
    validateAssumptions: "Challenge the underlying assumptions. What could go wrong with this approach?",
    exploreAlternatives: "What are 3-5 different approaches to solve this problem? Compare their trade-offs.",

    // --- Architecture & Design ---
    architecturalReview: "Evaluate this solution's architecture. Consider scalability, maintainability, and system integration.",
    designPatterns: "What design patterns or architectural principles apply here? Are they being used effectively?",
    dataFlowAnalysis: "Map out the data flow and identify potential bottlenecks or transformation points.",
    interfaceDesign: "How should this component interface with the rest of the system? Define clear contracts.",
    performanceImplications: "What are the performance characteristics and potential optimization points?",

    // --- Technical Evaluation ---
    technicalCritique: "Provide a rigorous technical critique identifying strengths, weaknesses, and improvement opportunities.",
    codeReviewMindset: "Review this with the mindset of a senior engineer. What would you flag in code review?",
    securityAnalysis: "Analyze potential security vulnerabilities and attack vectors in this approach.",
    maintenanceAssessment: "How maintainable is this solution? What will cause problems for future developers?",
    testingStrategy: "What testing approach would give confidence in this solution's correctness and robustness?",

    // --- Solution Planning ---
    technicalRoadmap: "Create a technical implementation roadmap with clear milestones and decision points.",
    riskMitigation: "Identify the highest-risk aspects and propose mitigation strategies.",
    mvpDefinition: "What's the minimal viable technical solution that proves the core concept?",
    iterationPlan: "How should this be built incrementally to validate assumptions early?",
    rollbackStrategy: "What's the rollback plan if this approach doesn't work as expected?",

    // --- Engineering Communication ---
    technicalJustification: "Explain the technical reasoning behind your recommendations with supporting evidence.",
    tradeoffExplanation: "Clearly articulate the trade-offs between different technical approaches.",
    assumptionDocumentation: "Document the key technical assumptions this solution relies on.",
    decisionRationale: "Provide the engineering rationale for why this approach is optimal.",
    stakeholderSummary: "Summarize the technical implications for different stakeholders (developers, ops, users).",

    // --- Quality Assurance ---
    edgeCaseAnalysis: "What edge cases and failure scenarios need to be considered?",
    integrationPoints: "Identify all integration points and potential compatibility issues.",
    monitoringStrategy: "What metrics and monitoring would indicate if this solution is working correctly?",
    documentationNeeds: "What technical documentation is essential for this solution?",
    knowledgeTransfer: "How can the technical knowledge behind this solution be effectively transferred?"

};