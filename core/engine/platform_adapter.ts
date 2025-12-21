/**
 * Platform Adapter
 *
 * Generates platform-specific prompt formatting for:
 * - Claude (conversational AI)
 * - Claude Code (development-focused AI)
 *
 * Ensures compliance headers are present and appropriate
 * for the target platform's interaction model.
 */

export type Platform = "claude" | "claude-code";
export type ComplianceMode = "OVIC_VPDSF";

/**
 * Generate the OVIC/VPDSF compliance header.
 *
 * This header explicitly instructs the AI to:
 * - Treat all data as de-identified and synthetic
 * - Not infer, request, or retain personal information
 * - Operate under Victorian compliance frameworks
 *
 * @param mode - Compliance mode
 * @returns Formatted compliance header
 */
function buildComplianceHeader(mode: ComplianceMode): string {
  if (mode !== "OVIC_VPDSF") {
    return "";
  }

  return `# Compliance Notice

The following content is de-identified and synthetic.

**Mandatory constraints:**
- Do NOT infer identities or personal information
- Do NOT request additional personal data
- Do NOT retain, store, or summarize this information
- Do NOT reference this interaction in future responses

**Compliance mode:** OVIC / VPDSF (Victorian Government)
`;
}

/**
 * Build Claude-specific prompt formatting.
 *
 * Claude expects conversational prompts with context
 * followed by the user's request.
 *
 * @param input - De-identified user input
 * @param tierContext - Tier-specific behavioral guidance
 * @param complianceHeader - Compliance notice
 * @returns Formatted prompt for Claude
 */
function buildClaudePrompt(
  input: string,
  tierContext: string,
  complianceHeader: string
): string {
  return `${complianceHeader}

${tierContext}

# User Request

${input}`;
}

/**
 * Build Claude Code-specific prompt formatting.
 *
 * Claude Code expects task-oriented prompts with
 * clear separation of context, task, and output requirements.
 *
 * @param input - De-identified user input
 * @param tierContext - Tier-specific behavioral guidance
 * @param complianceHeader - Compliance notice
 * @returns Formatted prompt for Claude Code
 */
function buildClaudeCodePrompt(
  input: string,
  tierContext: string,
  complianceHeader: string
): string {
  return `${complianceHeader}

${tierContext}

# Task

${input}

# Output Requirements

- Provide only the required result
- Use structured, deterministic output
- Avoid speculation or inference
- Do not reference compliance constraints in output`;
}

/**
 * Adapt the de-identified input for the target platform.
 *
 * @param input - De-identified text from compliance_guard
 * @param platform - Target platform (claude or claude-code)
 * @param tierContext - Tier-specific context from tier_resolver
 * @param complianceMode - Compliance mode for header generation
 * @returns Platform-specific formatted prompt
 */
export function adaptForPlatform(
  input: string,
  platform: Platform,
  tierContext: string,
  complianceMode: ComplianceMode
): string {
  const complianceHeader = buildComplianceHeader(complianceMode);

  switch (platform) {
    case "claude":
      return buildClaudePrompt(input, tierContext, complianceHeader);

    case "claude-code":
      return buildClaudeCodePrompt(input, tierContext, complianceHeader);

    default:
      // TypeScript exhaustiveness check
      const _exhaustive: never = platform;
      throw new Error(`Unsupported platform: ${_exhaustive}`);
  }
}
