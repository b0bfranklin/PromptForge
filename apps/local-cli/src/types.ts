/**
 * CLI-specific types
 *
 * Minimal types for command-line interface.
 * No persistence, no configuration.
 */

import type { Platform, Tier } from "../../../core/types.js";

export interface CLIOptions {
  readonly input?: string;
  readonly platform?: Platform;
  readonly tier?: Tier;
  readonly clipboard?: boolean;
  readonly help?: boolean;
  readonly version?: boolean;
}

export interface CLIInput {
  readonly rawInput: string;
  readonly platform: Platform;
  readonly tier: Tier;
  readonly copyToClipboard: boolean;
}
