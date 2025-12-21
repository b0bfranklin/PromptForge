/**
 * PromptForge — Local-First Compliance-Aware Prompt Generator
 *
 * Public API for building OVIC/VPDSF-compliant prompts
 * for Claude and Claude Code platforms.
 *
 * Core Principle: No storage, no inference, no retention.
 *
 * @example
 * ```typescript
 * import { buildPrompt } from './core';
 *
 * const result = buildPrompt({
 *   rawInput: "Analyze customer feedback from John Smith (john@example.com)",
 *   platform: "claude-code",
 *   tier: "government",
 *   complianceMode: "OVIC_VPDSF"
 * });
 *
 * console.log(result.prompt);
 * // Output includes de-identified content: [PERSON], [EMAIL]
 *
 * if (result.warnings.length > 0) {
 *   console.warn("Compliance warnings:", result.warnings);
 * }
 * ```
 */

// Core builder function
export { buildPrompt, buildPromptString } from "./engine/prompt_builder.js";

// Type exports
export type {
  Platform,
  ComplianceMode,
  Tier,
  PromptRequest,
  PromptResult
} from "./types.js";

// Compliance utilities (for advanced use)
export {
  applyCompliance,
  validateNoInference
} from "./engine/compliance_guard.js";

// Platform adapter (for custom workflows)
export { adaptForPlatform } from "./engine/platform_adapter.js";

// Tier resolver (for custom workflows)
export { resolveTier } from "./engine/tier_resolver.js";

// Storage prohibition marker
export { noStore } from "./memory/no_store.js";
