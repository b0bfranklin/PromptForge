/**
 * Prompt Builder — Core Engine
 *
 * Orchestrates the complete prompt generation pipeline:
 * 1. Validation (optional inference check)
 * 2. De-identification (OVIC/VPDSF compliance)
 * 3. Tier context resolution
 * 4. Platform-specific formatting
 *
 * This is the primary entry point for PromptForge.
 */

import { applyCompliance, validateNoInference } from "./compliance_guard.js";
import { adaptForPlatform } from "./platform_adapter.js";
import { resolveTier } from "./tier_resolver.js";
import type { PromptRequest, PromptResult } from "../types.js";

/**
 * Build a compliant, platform-specific prompt from user input.
 *
 * This function:
 * - Validates input for prohibited inference language (warnings only)
 * - Applies OVIC/VPDSF de-identification
 * - Adds tier-appropriate behavioral context
 * - Formats for the target platform
 *
 * @param request - Structured prompt request
 * @returns Complete prompt result with warnings and metadata
 */
export function buildPrompt(request: PromptRequest): PromptResult {
  // Validate for prohibited inference language
  const warnings = validateNoInference(request.rawInput);

  // Apply OVIC/VPDSF de-identification
  const compliantInput = applyCompliance(
    request.rawInput,
    request.complianceMode
  );

  // Determine if de-identification occurred
  const wasDeIdentified = compliantInput !== request.rawInput;

  // Resolve tier-specific context
  const tierContext = resolveTier(request.tier);

  // Generate platform-specific formatted prompt
  const prompt = adaptForPlatform(
    compliantInput,
    request.platform,
    tierContext,
    request.complianceMode
  );

  return {
    prompt,
    warnings,
    metadata: {
      platform: request.platform,
      tier: request.tier,
      complianceMode: request.complianceMode,
      wasDeIdentified
    }
  };
}

/**
 * Legacy interface: returns only the prompt string.
 *
 * Use buildPrompt() for full result with warnings.
 *
 * @deprecated Use buildPrompt() instead
 */
export function buildPromptString(request: PromptRequest): string {
  return buildPrompt(request).prompt;
}
