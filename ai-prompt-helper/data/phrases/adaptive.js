'use strict';

if (!window.aiPromptHelper) {
    window.aiPromptHelper = {};
}
if (!window.aiPromptHelper._phraseModules) {
    window.aiPromptHelper._phraseModules = {};
}

window.aiPromptHelper._phraseModules.adaptive = {
    // --- General Purpose Conversational Atomic Phrases for Adaptive Mode ---
    confirmInferredDomain: "Based on my last request, what specific domain or area of expertise have you adopted for this analysis? Briefly explain your choice.",
    analyzeProsConsRisks: "Analyze my last proposal. What are its primary strengths (pros), weaknesses (cons), and potential risks or overlooked considerations?",
    brainstormSolutionsCritically: "Let's brainstorm solutions for the problem I just described. For each idea, provide a brief critical evaluation of its feasibility and potential impact.",
    strategicImpactAssessment: "Assess the potential strategic impact of my last proposal. Consider short-term and long-term consequences, and alignment with broader goals (if known).",
}