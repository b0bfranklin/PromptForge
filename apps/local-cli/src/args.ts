/**
 * Argument Parser
 *
 * Minimal command-line argument parsing.
 * No external dependencies.
 */

import type { Platform, Tier } from "../../../core/types.js";
import type { CLIOptions } from "./types.js";

const VERSION = "0.1.0";

const HELP_TEXT = `
PromptForge CLI — OVIC/VPDSF Compliant Prompt Generator

USAGE:
  promptforge [OPTIONS]

OPTIONS:
  -i, --input <text>        Task description (if omitted, enters interactive mode)
  -p, --platform <name>     Target platform: claude | claude-code (default: claude-code)
  -t, --tier <name>         Organization tier: government | enterprise | business (default: government)
  -c, --clipboard           Copy result to clipboard
  -h, --help                Show this help
  -v, --version             Show version

COMPLIANCE:
  All input is de-identified according to OVIC/VPDSF.
  No data is stored, logged, or retained.
  Local execution only.

EXAMPLES:
  # Interactive mode (government tier, Claude Code)
  promptforge

  # Direct input
  promptforge -i "Review contract terms" -p claude -t government

  # With clipboard copy
  promptforge -i "Analyze data" -c

DEFAULTS:
  Platform: claude-code
  Tier: government
  Compliance: OVIC_VPDSF (non-disableable)
`;

/**
 * Parse command-line arguments.
 *
 * Minimal parser, no dependencies.
 *
 * @param args - Process arguments (typically process.argv.slice(2))
 * @returns Parsed options
 */
export function parseArgs(args: readonly string[]): CLIOptions {
  let options: CLIOptions = {
    help: false,
    version: false,
    clipboard: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "-h":
      case "--help":
        return { ...options, help: true };

      case "-v":
      case "--version":
        return { ...options, version: true };

      case "-c":
      case "--clipboard":
        options = { ...options, clipboard: true };
        break;

      case "-i":
      case "--input":
        if (i + 1 >= args.length) {
          throw new Error("Missing value for --input");
        }
        options = { ...options, input: args[++i] };
        break;

      case "-p":
      case "--platform": {
        if (i + 1 >= args.length) {
          throw new Error("Missing value for --platform");
        }
        const platform = args[++i];
        if (platform !== "claude" && platform !== "claude-code") {
          throw new Error(`Invalid platform: ${platform}. Must be: claude | claude-code`);
        }
        options = { ...options, platform: platform as Platform };
        break;
      }

      case "-t":
      case "--tier": {
        if (i + 1 >= args.length) {
          throw new Error("Missing value for --tier");
        }
        const tier = args[++i];
        if (tier !== "government" && tier !== "enterprise" && tier !== "business") {
          throw new Error(`Invalid tier: ${tier}. Must be: government | enterprise | business`);
        }
        options = { ...options, tier: tier as Tier };
        break;
      }

      default:
        throw new Error(`Unknown option: ${arg}. Use --help for usage information.`);
    }
  }

  return options;
}

/**
 * Show help text.
 */
export function showHelp(): void {
  console.log(HELP_TEXT);
}

/**
 * Show version.
 */
export function showVersion(): void {
  console.log(`PromptForge CLI v${VERSION}`);
  console.log("Compliance: OVIC / VPDSF");
  console.log("Mode: Local only");
}
