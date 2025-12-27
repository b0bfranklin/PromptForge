/**
 * Shared Type Definitions for PromptForge
 *
 * This module exports all core types used across the engine.
 * Centralizing types ensures consistency and prevents drift.
 */

/**
 * Supported AI platforms.
 */
export type Platform = "claude" | "claude-code";

/**
 * Compliance regimes supported by PromptForge.
 *
 * Currently only OVIC/VPDSF (Victorian Government) is supported.
 */
export type ComplianceMode = "OVIC_VPDSF";

/**
 * Organization tiers with different behavioral profiles.
 *
 * - government: Victorian Government context (conservative, audit-safe)
 * - enterprise: Corporate context (structured, risk-aware)
 * - business: General business context (clear, actionable)
 */
export type Tier = "government" | "enterprise" | "business";

/**
 * Input structure for the prompt builder.
 */
export interface PromptRequest {
  /**
   * Raw task description or user input.
   * Will be de-identified before processing.
   */
  readonly rawInput: string;

  /**
   * Target AI platform for the generated prompt.
   */
  readonly platform: Platform;

  /**
   * Organization tier determining behavioral context.
   */
  readonly tier: Tier;

  /**
   * Compliance mode for de-identification and constraints.
   */
  readonly complianceMode: ComplianceMode;
}

/**
 * Result of the prompt build process.
 */
export interface PromptResult {
  /**
   * The final, formatted prompt ready for the target platform.
   */
  readonly prompt: string;

  /**
   * Any warnings generated during processing.
   * (e.g., inference language detected)
   */
  readonly warnings: readonly string[];

  /**
   * Metadata about the transformation.
   */
  readonly metadata: {
    readonly platform: Platform;
    readonly tier: Tier;
    readonly complianceMode: ComplianceMode;
    readonly wasDeIdentified: boolean;
  };
}
