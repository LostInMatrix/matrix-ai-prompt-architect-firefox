'use strict';

if (!window.aiPromptHelper) {
    window.aiPromptHelper = {};
}
if (!window.aiPromptHelper._phraseModules) {
    window.aiPromptHelper._phraseModules = {};
}

window.aiPromptHelper._phraseModules.coding = {
    // --- System Instructions (General) ---
    sysGeneralCoding: "# General Programming Guidelines\n" +
        "\n" +
        "**Primary Focus:** Code clarity and maintainability above all else.\n" +
        "\n" +
        "## Core Requirements\n" +
        "- Write single-responsibility functions and classes\n" +
        "- Avoid code repetition \n" +
        "- **Extract complex logic into smaller, focused methods rather than creating large functions**\n" +
        "- **Limit function parameters - extract to classes or objects when parameter count grows**\n" +
        "\n" +
        "## Important Considerations\n" +
        "- Consider edge cases and potential failures\n" +
        "- Explain key implementation decisions when choosing between alternatives\n" +
        "- Follow established patterns and idioms for the specific technology\n" +
        "\n" +
        "## Avoid\n" +
        "- Over-engineering - favor simple, readable solutions over complex abstractions\n" +
        "- Functions with excessive logic or parameters\n" +
        "- Unnecessary complexity that doesn't solve real problems",

    // --- System Instructions (General), Atomic Phrases ---
    sysBalancePractices: "Balance best practices with appropriate complexity. Aim for robust, maintainable solutions.",
    sysStepByStep: "Think step-by-step. Break down complex tasks.",
    sysExplainChoices: "Explain the rationale for key implementation decisions, especially when choosing between alternatives.",
    sysAvoidOverengineering: "Prioritize simplicity. Avoid over-engineering and unnecessary abstractions.",
    sysCriticalThinking: "Think critically. Consider edge cases, potential failures, and future evolution.",
    sysAdhereToBestPractices: "Follow industry best practices and standards for the specific technologies.",
    sysInferDomainAndCritique: "First, analyze the user's request to identify the primary domain of expertise or subject matter involved (e.g., software development with a specific language, creative writing genre, business strategy, scientific analysis, etc.). Clearly state the domain you are adopting. Then, embody the role of a highly skilled, critical, and meticulous expert in that identified domain. Apply the following critical principles rigorously. Your goal is to guide the user to the objectively best outcome within that domain.",
    // --- System Instructions (AI Behavior - For Criticality) ---
    sysPrioritizeQualityOverAgreement: "Primary goal: Deliver optimal, accurate solutions for the user's current task. Prioritize correctness and best practices over simple agreement. Challenge user premises *only if they flaw the immediate task's solution quality*.",
    sysCriticallyEvaluateAllInput: "Critically evaluate all user input *directly relevant to the current request*. Identify flaws, errors, or suboptimal approaches *within this task-specific input* before responding.",
    sysChallengeFlawedInputProactively: "If task-relevant input flaws are found, YOU MUST proactively highlight them, explain why they're problematic *for this task*, and suggest improvements *before proceeding with the flawed request*. Don't execute instructions harmful to the task's success.",
    sysAdoptConstructiveSkepticism: "Apply constructive skepticism to the user's *current request and proposed approach*. Question key assumptions and probe for critical unspoken details *for this task*. Explore better alternatives to achieve the *task's objective*.",
    // --- Conversation Flow (General) ---
    askClarify: "Ask essential clarifying questions only when the answer cannot be reasonably determined from the provided files or context.",
    askMissingInfo: "What information, context, or files are you missing to provide a complete and accurate response?",
    discussPlan: "Outline your understanding of the goal and propose a high-level plan. Do not provide code until we agree on a plan.",
    targetedEdits: "Show only the necessary code edits with clear instructions on exactly what to modify and where, without reproducing unchanged code. Provide changes using a find/replace method i.e. 'Find this code: (code snippet in MD) and replace with this code: (code snippet in MD)'",
    suggestAlternatives: "What alternative approaches might be worth considering for this task?",
    codeOnly: "Provide only the code, without any inline comments. If explanations are necessary provide them outside of the code block(s).",
    //implemented: "All provided code has been implemented.",
    continue: "All provided code has been implemented. Continue with next steps.",
    generateSummary: "Generate an exhaustive and meticulous report of our discussion up to this point.",
    summarizeForContext: "Include the initial goals, key topics discussed, significant decisions made, code implemented (if any), outstanding questions, and the current objective. This report should serve as a self-contained context document suitable for resuming the conversation from scratch.",

    // Guide the AI on how to read the summary/report
    reportInterpretation: "This is a STATUS REPORT documenting completed work, not a requirements document. When you see 'implementation phase pending,' this means implementing USAGE of already-completed structural changes, not creating the changes themselves.",
    reconciliationGuidance: "When report content conflicts with provided code files, treat the code as ground truth. The report may reflect an earlier state or use imprecise status language.",
    resumptionContext: "Treat this as a HANDOFF document showing accomplished work and the immediate next actionable step, not a project plan for future work.",

    // --- Code Style & Implementation ---
    minimalist: "Provide the most minimalist implementation satisfying requirements. Avoid over-engineering.",
    addDebugCode: "Insert relevant debug code (logging, etc.) to diagnose the issue.",
    avoidNesting: "Refactor to minimize nesting depth. Use early returns and guard clauses. Create new functions as appropriate.",
    createTests: "Generate unit/feature tests for key scenarios and edge cases.",
    optimizeQueries: "Optimize database queries for performance and reduced server load.",
    cleanControlFlow: "Improve control flow clarity using early returns, guard clauses, and extracted methods. Maintain single abstraction level.",
    critiquePatternUsage: "Critique the use of design patterns (appropriateness, correctness).",
    suggestRefactoring: "Suggest specific refactorings to improve code (readability, structure, performance). Identify code smells.",
    suggestIdiomaticCode: "Suggest changes to make the code more idiomatic for the language/framework.",
    analyzeSecurityOWASP: "Analyze code for security vulnerabilities (e.g., OWASP Top 10).",
    reviewInputValidation: "Review input validation and sanitization for security weaknesses.",
    reviewAuthentication: "Review authentication/authorization mechanisms for security flaws.",
    diffOnly: "Provide code changes strictly in diff format.",



    // --- Language-Specific Standards ---
    sysPHP: "# PHP Language Guidelines\n" +
        "\n" +
        "**Primary Focus:** Use modern PHP 8.3+ features with strict typing.\n" +
        "\n" +
        "## Core Requirements\n" +
        "- **Always declare strict types and explicit return types for all methods**\n" +
        "- **Use modern PHP syntax: enums, readonly properties, union types, match expressions**\n" +
        "- Follow PSR-12 coding standards\n" +
        "- Avoid deprecated functions and legacy patterns\n" +
        "\n" +
        "## Propose When Appropriate\n" +
        "- Named arguments for clarity\n" +
        "- Null coalescing and null coalescing assignment operators\n" +
        "- Array destructuring and spread operator\n" +
        "- Anonymous classes for simple implementations\n" +
        "\n" +
        "## Avoid\n" +
        "- Missing type declarations\n" +
        "- Legacy array syntax when modern alternatives exist\n" +
        "- Deprecated functions (create_function, each, etc.)\n" +
        "- Magic methods when typed alternatives are available",

    sysJavaScript: "sysJavaScript: \"# JavaScript Language Guidelines\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"**Primary Focus:** Use modern ES2022+ features with proper async handling and modular design.\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"## Core Requirements\\n\" +\n" +
        "    \"- **Use ES modules (import/export) over CommonJS when possible**\\n\" +\n" +
        "    \"- **Prefer async/await over Promise chains for readability**\\n\" +\n" +
        "    \"- **Use const/let appropriately - avoid var**\\n\" +\n" +
        "    \"- Apply destructuring for cleaner object/array access\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"## Propose When Appropriate\\n\" +\n" +
        "    \"- Optional chaining (?.) and nullish coalescing (??)\\n\" +\n" +
        "    \"- Array methods (map, filter, reduce) over traditional loops\\n\" +\n" +
        "    \"- Template literals for string composition\\n\" +\n" +
        "    \"- Object shorthand syntax and computed properties\\n\" +\n" +
        "    \"- JSDoc for type hints when TypeScript isn't available\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"## Avoid\\n\" +\n" +
        "    \"- Callback hell - use async/await or Promise.all()\\n\" +\n" +
        "    \"- Global variables and function declarations in global scope\\n\" +\n" +
        "    \"- Legacy browser workarounds unless specifically needed\\n\" +\n" +
        "    \"- Excessive DOM manipulation - batch operations when possible\"",

    useModernSyntax: "Use only modern PHP 8.2+ syntax and features, avoiding deprecated functions and patterns.",
    useSupportedVersions: "Use only features/packages supported in latest stable dependency versions.",
    followPSR12: "Format PHP code according to PSR-12 standards.",
    modernJavaScript: "Use modern JavaScript (ES2022+) and current best practices.",
    modernPHP: "Use PHP 8.2+ features including readonly properties, enums, union types, match expressions, and named arguments while avoiding deprecated functions.",

    // --- API Design Patterns ---
    apiRestful: "Design RESTful APIs with proper resource naming, HTTP methods, and status codes that follow REST principles.",
    apiVersioning: "Implement API versioning strategy to maintain backward compatibility while allowing evolution.",
    apiAuthentication: "Design secure API authentication using appropriate mechanisms (OAuth, JWT, API keys) with proper token handling.",
    apiDocumentation: "Create comprehensive API documentation with endpoints, parameters, response formats, and examples.",
    apiErrorHandling: "Implement consistent API error handling with meaningful status codes and error messages.",
    apiRateLimiting: "Design API rate limiting and throttling to prevent abuse and ensure service availability.",
    apiCaching: "Implement effective API caching strategies to improve performance and reduce server load.",
    apiGraphQL: "Design GraphQL APIs with well-structured schemas, resolvers, and appropriate query complexity management.",

    // --- Framework-Specific Guidance ---
    sysLaravel: "# Laravel Framework Guidelines\n" +
        "\n" +
        "**Primary Focus:** Leverage Laravel conventions and patterns appropriately.\n" +
        "\n" +
        "## Core Requirements\n" +
        "- **Leverage Laravel collections and helpers where appropriate**\n" +
        "- Follow Laravel naming conventions\n" +
        "- Use Laravel's built-in features before building custom solutions\n" +
        "\n" +
        "## Propose When Appropriate\n" +
        "- **Form Requests for validation when 3+ rules are needed**\n" +
        "- Invokable single action controllers\n" +
        "- Pipeline pattern\n" +
        "- Events for decoupling\n" +
        "- Service classes for complex business logic\n" +
        "\n" +
        "## Avoid\n" +
        "- Inline validation for complex rule sets\n" +
        "- Basic PHP array functions when collections are better\n" +
        "- Magic strings for states, types, or keys\n" +
        "- Reinventing Laravel functionality\n" +
        "- Fighting Laravel conventions without justification",

    vueComposition: "Structure this using Vue 3 Composition API with proper reactivity and lifecycle management.",
    sysLaravelFormRequests: "Implement Form Requests: For all input validation, decoupling logic from controllers.",
    sysLaravelDTOs: "Utilize Data Transfer Objects (DTOs): For structured, type-safe data transfer between layers.",
    sysLaravelApiResources: "Employ API Resources: To transform data (Doctrine entities, DTOs) into standardized JSON API responses.",
    sysLaravelServiceLayerDoctrine: "Establish a Service Layer: For core business logic, orchestrating Doctrine interactions and remaining HTTP-agnostic.",
    sysLaravelDoctrineRepositoryInterfaces: "Define Repository Interfaces (Doctrine): For Doctrine entities, bind implementations in the service container to enhance testability and abstraction.",
    sysLaravelDependencyInjection: "Leverage Dependency Injection: For resolving services, Doctrine's EntityManager, and repositories.",
    sysLaravelCacheProcessedData: "Cache Processed Data: Service outputs, DTOs, or full API responses, using Cache::remember().",
    sysLaravelCacheTags: "Use Cache Tags: For granular invalidation of related cached items.",
    sysLaravelQueueOperations: "Offload to Queues: Long-running data operations (e.g., report generation, batch updates).",
    sysLaravelFilesystemAbstraction: "Utilize Filesystem Abstraction: For all file storage operations (uploads, generated files).",
    sysLaravelStrongTyping: "Enforce Strong Typing: PHP type hints in services, DTOs, and repositories.",
    sysLaravelConfigManagement: "Manage Configuration: Via .env (environment specifics) and config/ (application settings).",
    sysLaravelCustomExceptions: "Define Custom Exceptions: Domain-specific exceptions; use Laravel's handler for responses/logging.",
    sysLaravelContextualLogging: "Implement Contextual Logging: Using Log facade, especially in services and data layers.",
    sysLaravelGatesPoliciesDoctrine: "Use Gates and Policies: For authorization, adaptable to Doctrine entities or DTOs.",
    sysLaravelCsrfProtection: "Ensure CSRF Protection: Active for all state-changing web routes.",
    sysLaravelEscapeBladeOutput: "Escape Blade Output: Ensure {{ }} (default escaping) for dynamic data to prevent XSS.",
    sysLaravelRateLimiting: "Implement Rate Limiting: On API endpoints and sensitive routes.",
    sysLaravelTestingDoctrine: "Write Comprehensive Tests: Unit tests for services/DTOs (mocking Doctrine), HTTP/Integration tests for endpoints.",
    sysLaravelEventsDoctrine: "Use Laravel Events: For decoupled actions post-Doctrine operations (e.g., dispatch EntityUpdatedEvent).",

    // --- Language Expert Phrases ---
    phpBestPractices: "Apply PHP best practices including SOLID principles, type safety, and proper error handling. Leverage PHP 8.x features appropriately.",
    phpPerformance: "Optimize PHP code for performance considering memory usage, execution time, and proper use of language constructs.",
    phpTesting: "Implement proper PHP testing strategies using PHPUnit with appropriate mocking and test isolation.",
    phpSecurity: "Apply PHP security best practices to prevent common vulnerabilities like SQL injection, XSS, CSRF, and insecure deserialization.",

    jsBestPractices: "Follow modern JavaScript best practices including ES modules, proper async/await usage, and functional programming patterns where appropriate.",
    jsPerformance: "Optimize JavaScript for performance with attention to DOM manipulation, event handling, memory management, and proper bundling strategies.",
    jsTesting: "Implement comprehensive JavaScript testing using Jest/Vitest with appropriate mocking and test isolation.",
    jsModules: "Structure JavaScript code using modular patterns with clean dependency management and appropriate bundling considerations.",

    pythonBestPractices: "Follow Python best practices including PEP 8 style guidelines, type hints, and idiomatic Python patterns.",
    pythonPerformance: "Optimize Python code for performance with proper data structures, algorithm choices, and consideration of interpreter behavior.",
    pythonPackageManagement: "Use proper Python package management with virtual environments, requirements files, and dependency handling.",
    pythonTesting: "Implement Python testing with pytest, including appropriate fixtures, mocks, and parameterized tests.",

    sysPython: "sysPython: \"# Python Language Guidelines\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"**Primary Focus:** Write idiomatic Python 3.9+ with type hints and clear data flow.\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"## Core Requirements\\n\" +\n" +
        "    \"- **Always include type hints for function parameters and return values**\\n\" +\n" +
        "    \"- **Follow PEP 8 style guidelines consistently**\\n\" +\n" +
        "    \"- **Use list/dict comprehensions where they improve readability**\\n\" +\n" +
        "    \"- Leverage built-in functions and standard library before external packages\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"## Propose When Appropriate\\n\" +\n" +
        "    \"- Dataclasses for structured data over plain dictionaries\\n\" +\n" +
        "    \"- Context managers (with statements) for resource handling\\n\" +\n" +
        "    \"- f-strings for string formatting\\n\" +\n" +
        "    \"- Pathlib for file path operations\\n\" +\n" +
        "    \"- Enum classes for constants and states\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"## Avoid\\n\" +\n" +
        "    \"- Bare except clauses - catch specific exceptions\\n\" +\n" +
        "    \"- Mutable default arguments (def func(items=[]))\\n\" +\n" +
        "    \"- String concatenation in loops - use join() or f-strings\\n\" +\n" +
        "    \"- from module import * - use explicit imports\"",

    // --- Framework Expert Phrases ---

    laravelArchitecture: "Use Dependency Injection, Repositories for data abstraction (esp. with ORMs like Doctrine), and aim for loose coupling/high cohesion.",
    laravelPatterns: "Use recommended Laravel patterns/features: Service Providers, Facades, Policies, and Pipeline (`Illuminate\\Pipeline\\Pipeline`) for multi-step tasks.",
    laravelUseHelpers: "Use Laravel helpers (e.g., `str`, `arr`, `optional`, `route`, `config`) when they are a clear, idiomatic alternative to vanilla PHP.",

    vueArchitecture: "Structure Vue applications with proper component design, props validation, and emit contracts.",
    vueState: "Implement Vue state management using the most appropriate approach for the project's complexity, with proper reactivity and state isolation.",
    vueStatePinia: "Implement Vue state management using Pinia with proper store design, composable stores, and type safety.",
    vueStateVuex: "Implement Vue state management using Vuex with proper modules, mutations, and actions following flux architecture patterns.",
    vuePerformance: "Optimize Vue applications focusing on component rendering, computed property usage, and lazy loading strategies.",
    vueLifecycle: "Manage Vue component lifecycle correctly with proper setup and cleanup of side effects and resource management.",

    inertiaLaravelIntegration: "Integrate Inertia.js with Laravel following best practices for controllers, middleware, and error handling.",
    inertiaVueIntegration: "Connect Inertia.js with Vue components effectively, managing props, shared data, and navigation appropriately.",
    inertiaForms: "Implement form handling in Inertia.js applications with proper validation, error handling, and user feedback.",

    archLaravelCodeStructuringGuidance: "Structure PHP/Laravel code for clarity & maintainability (apply SRP):\n- Actions/Single Action Controllers, services for complex/reusable business logic & data layer interaction.\n- DTOs: For type-safe data transfer between layers.\n- Enums (PHP 8.1+): For fixed sets of named values (improves type safety).\n- Traits: For sharing methods across classes (horizontal code reuse).",
    sysLaravelAvoidLooseStrings: "For values representing states, types, or keys, avoid 'loose strings' (magic strings). Instead, use PHP Enums, Class Constants, or dedicated configuration values (e.g., from `config/` files) to enhance type safety, readability, and maintainability.",

}