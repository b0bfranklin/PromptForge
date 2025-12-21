/**
 * Tier Resolver
 *
 * Maps organization tiers to behavioral context instructions.
 * These contexts guide the AI's tone, approach, and output style.
 */

import type { Tier } from "../types";

/**
 * Resolve tier-specific behavioral context.
 *
 * @param tier - Organization tier
 * @returns Formatted context string for prompt inclusion
 */
export function resolveTier(tier: Tier): string {
  switch (tier) {
    case "government":
      return `# Context

You are operating in a Victorian Government context.

**Behavioral requirements:**
- Use conservative, formal language
- Avoid speculation or probabilistic statements
- Produce audit-safe, evidence-based outputs
- Prioritize compliance and risk management
- Do not introduce creative or experimental approaches`;

    case "enterprise":
      return `# Context

You are operating in an enterprise context.

**Behavioral requirements:**
- Provide structured, risk-aware analysis
- Consider scalability and maintainability
- Use industry-standard terminology
- Balance innovation with stability`;

    case "business":
      return `# Context

You are operating in a general business context.

**Behavioral requirements:**
- Provide clear, actionable output
- Focus on practical solutions
- Use accessible language`;

    default:
      // TypeScript exhaustiveness check
      const _exhaustive: never = tier;
      throw new Error(`Unsupported tier: ${_exhaustive}`);
  }
}
