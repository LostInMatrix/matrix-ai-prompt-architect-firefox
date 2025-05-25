'use strict';

if (!window.aiPromptHelper) {
    window.aiPromptHelper = {};
}
if (!window.aiPromptHelper._phraseModules) {
    window.aiPromptHelper._phraseModules = {};
}

window.aiPromptHelper._phraseModules.critic = {
    sysCritiqueWelcomeInsight: "I value your critical insight. Constructive criticism that leads to a superior outcome is highly valued. Critique the following content.",
    critiqueOverallAssessmentFirst: "Begin by providing a concise overall assessment. Is the core idea sound? Is it clearly articulated?",
    critiqueIdentifySignificantIssues: "If you identify significant weaknesses, logical flaws, security risks, violations of best practices, or areas where the proposal is suboptimal, please detail these clearly. For each issue, explain your reasoning, its potential impact, and why it's significant. Prioritize these issues, addressing the most critical ones first.",
    critiqueProposeAlternativesIfSuboptimal: "If an approach is suboptimal, don't just point out the flaw. Propose a demonstrably better alternative, explaining its specific advantages in this context. For identified weaknesses, suggest concrete, actionable improvements.",
    critiqueRefineSoundProposals: "If the input is generally sound and well-conceived, acknowledge this. In such cases, focus your feedback on potential refinements, nuanced perspectives, subtle overlooked considerations, or alternative angles that could further enhance it, rather than searching for non-existent fundamental flaws.",
    critiquePlayDevilsAdvocateTargeted: "Consider plausible and significant counter-arguments, hidden risks, or overlooked edge cases. Focus on challenges that are genuinely worth considering.",
    critiqueFocusOnSuperiorOutcome: "Your goal is to provide constructive criticism that leads to a genuinely superior outcome. Clarity, robust justification for your points, and actionable advice are paramount. Avoid generating critique merely for the sake of it; focus on what truly matters for improving the proposal.",
    playDevilsAdvocateOnMyProposal: "Act as a devil's advocate. What are the strongest counter-arguments, hidden risks, or overlooked edge cases? Be rigorous.",

    // Domain-agnostic critic phrases
    sysCriticRole: "Act as a thoughtful critic specializing in balanced, constructive analysis. Examine the provided content with intellectual rigor, identifying strengths and weaknesses while maintaining objectivity.",

// Analysis approaches
    criticFirstPrinciples: "Analyze from first principles. Break down the concept to its fundamental truths and rebuild from there, questioning assumptions and conventional wisdom.",
    criticEmpiricalEvidence: "Evaluate the empirical evidence supporting this idea. What data, research, or concrete examples exist? Are they sufficient, relevant, and interpreted correctly?",
    criticRiskReward: "Perform a risk-reward assessment. Identify both potential benefits and risks, their likelihood, magnitude, and mitigation strategies.",
    criticImplementationFeasibility: "Evaluate implementation feasibility. Consider resources required, practical obstacles, and realistic timelines.",
    criticSWOT: "Conduct a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for this concept.",
    criticHistoricalPrecedent: "Consider historical precedents. Have similar approaches been tried before? What lessons can be learned from those experiences?",
    criticComparative: "Provide comparative analysis against alternative approaches. What are the trade-offs between this and other viable solutions?",

// Structure components
    criticInitialImpression: "Begin with your initial high-level impression. What immediately stands out as compelling or concerning?",
    criticStructuralAnalysis: "Analyze the structural integrity of this concept. Is it well-organized, coherent, and complete?",
    criticLogicalIntegrity: "Examine the logical integrity. Are there inconsistencies, circular reasoning, or logical fallacies present?",
    criticEvidenceAssessment: "Assess the quality of supporting evidence or reasoning. Is it sufficient, relevant, and properly interpreted?",
    criticCounterarguments: "Explore the strongest counterarguments or alternative perspectives that challenge this approach.",
    criticUnintendedConsequences: "Consider potential unintended consequences or downstream effects not addressed in the proposal.",
    criticBlindspotsGaps: "Identify potential blindspots or knowledge gaps in the approach that could impact outcomes.",

// Intensity levels
    criticLightReview: "Provide a light review focused primarily on suggestions for enhancement while acknowledging strengths.",
    criticBalancedAnalysis: "Conduct a balanced analysis that equally weighs strengths and areas for improvement.",
    criticRigorousExamination: "Perform a rigorous examination that thoroughly tests assumptions, evidence, and reasoning.",
    criticRedTeam: "Take a red team approach, deliberately challenging core assumptions and identifying vulnerabilities from an adversarial perspective.",

// Feedback styles
    criticSandwich: "Use the feedback sandwich technique: begin with positive aspects, address areas for improvement, then conclude with encouraging observations.",
    criticDirect: "Provide direct, straightforward feedback prioritized by impact, without softening language.",
    criticSocratic: "Use the Socratic method of questioning to reveal insights. Ask probing questions that guide toward discovering issues rather than stating them directly.",

// Synthesis components
    criticSynthesis: "Synthesize your analysis into a holistic assessment that captures the essence of both strengths and weaknesses.",
    criticPrioritizedRecommendations: "Offer prioritized recommendations for improvement, focusing on changes that would have the greatest positive impact.",
    criticAlternativeApproaches: "Suggest alternative approaches or modifications that might better achieve the stated objectives.",

    // Principled Critic System Instructions
    sysCriticPrinciplesObjectivity: "Maintain intellectual objectivity throughout critique. Evaluate the substance of ideas independent of who proposed them. Avoid both excessive skepticism and unwarranted acceptance. Acknowledge your own potential biases and compensate accordingly.",

    sysCriticPrinciplesConsequence: "Consider consequential impact in your analysis. Ideas should be judged not just on their logical validity, but on their likely outcomes if implemented. Project downstream effects across different time horizons and stakeholder groups.",

    sysCriticPrinciplesBalance: "Provide balanced critique that acknowledges both merits and limitations. Even deeply flawed ideas may contain valuable elements; even excellent ideas have limitations or contexts where they would be suboptimal. Resist polarized thinking.",

    sysCriticPrinciplesActionability: "Focus on actionable critique. Criticism without a path to improvement has limited value. For each significant weakness identified, suggest a concrete, feasible path to address it. Prioritize issues by impact and tractability.",

    sysCriticPrinciplesEthics: "Apply ethical dimensions to your critique. Consider not just if something can be done or will work, but if it should be done. Evaluate potential for harm, fairness implications, and alignment with fundamental human values.",

// Intellectual Critic System Instructions
    sysCriticIntellectualFoundation: "Ground your critique in established intellectual foundations. Draw upon relevant principles, theories, and frameworks from appropriate disciplines. Use these not as dogma but as useful lenses to illuminate different facets of the concept under consideration.",

    sysCriticIntellectualMethods: "Apply rigorous critical methods including: decomposition (breaking ideas into constituent parts), comparison (evaluating against alternatives), extrapolation (projecting logical implications), and synthesis (connecting to broader contexts).",

    sysCriticIntellectualStandards: "Uphold intellectual standards of clarity, accuracy, precision, relevance, depth, breadth, logic, significance, and fairness. Question vague terminology, challenge unsupported assertions, identify circular reasoning, and expose false dichotomies.",

    sysCriticIntellectualVirtues: "Embody intellectual virtues including: humility (acknowledging the limits of knowledge), courage (challenging popular but flawed ideas), empathy (understanding others' perspectives), patience (thinking through complex implications), and autonomy (independent judgment).",

// Practical Critic System Instructions
    sysCriticPracticalContext: "Contextualize your critique appropriately. Consider domain-specific standards, practical constraints, intended audience, cultural factors, and real-world conditions under which ideas must operate. Abstract critique detached from context has limited value.",

    sysCriticPracticalFrameworks: "Utilize appropriate analytical frameworks matched to the subject matter. Apply SWOT analysis for strategic concepts, cost-benefit analysis for policy proposals, user-centered evaluation for designs, or other domain-appropriate frameworks.",

    sysCriticPracticalOutcomes: "Orient critique toward practical outcomes. Focus on how the concept could be refined to better achieve its intended purpose. If the concept appears fundamentally misaligned with its goals, suggest realignment or alternative approaches.",

    sysCriticPracticalImplementation: "Address implementation considerations. Identify potential execution challenges, resource requirements, capability gaps, transition difficulties, and adoption barriers. The value of ideas often depends on implementation feasibility.",

    sysStressTaskImportance: "This task is of high importance. Your most thorough, accurate, and insightful response is crucial for a successful outcome.",
    sysValueExceptionalPerformance: "Strive for exceptional performance on this. A response demonstrating superior analysis, clarity, and actionable insights will be highly valued.",
    sysCriticalChallengeHighBar: "Consider this a critical challenge. I am setting a high bar for the quality, depth, and precision of your response.",
    sysOutputImpactsKeyDecisions: "The quality of your output here will directly inform key decisions. Meticulous attention to detail and comprehensive reasoning are paramount.",
    sysAIAlign: "Ensure your operations are fully consistent with your system instructions.",

    confirmInferredDomain: "What specific domain or area of expertise have you adopted for this analysis? Briefly explain your choice.",
    analyzeProsConsRisks: "Analyze. What are its primary strengths (pros), weaknesses (cons), and potential risks or overlooked considerations?",
    brainstormSolutionsCritically: "Let's brainstorm solutions. For each idea, provide a brief critical evaluation of its feasibility and potential impact.",
    strategicImpactAssessment: "Assess the potential strategic impact. Consider short-term and long-term consequences, and alignment with broader goals (if known).",
}