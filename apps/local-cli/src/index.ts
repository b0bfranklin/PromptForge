#!/usr/bin/env node

/**
 * PromptForge CLI
 *
 * Local-first, OVIC/VPDSF-compliant prompt generator.
 *
 * Entry point for command-line usage.
 * No persistence, no history, no storage.
 */

import { buildPrompt } from "../../../core/index.js";
import { parseArgs, showHelp, showVersion } from "./args.js";
import { runInteractive } from "./interactive.js";
import type { CLIInput } from "./types.js";

/**
 * Main CLI entry point.
 *
 * Execution flow:
 * 1. Parse arguments OR run interactive mode
 * 2. Generate prompt via core engine
 * 3. Output to stdout
 * 4. Optionally copy to clipboard
 * 5. Exit (no data retained)
 */
async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    // Handle help and version
    if (options.help) {
      showHelp();
      process.exit(0);
    }

    if (options.version) {
      showVersion();
      process.exit(0);
    }

    // Gather input (interactive or direct)
    const cliInput = await gatherInput(options);

    // Generate prompt using core engine
    const result = buildPrompt({
      rawInput: cliInput.rawInput,
      platform: cliInput.platform,
      tier: cliInput.tier,
      complianceMode: "OVIC_VPDSF"
    });

    // Display warnings if any
    if (result.warnings.length > 0) {
      console.error("\n⚠️  COMPLIANCE WARNINGS:");
      for (const warning of result.warnings) {
        console.error(`   - ${warning}`);
      }
      console.error("");
    }

    // Display metadata
    console.log("\n" + "─".repeat(60));
    console.log("GENERATED PROMPT");
    console.log("─".repeat(60));
    console.log(`Platform: ${result.metadata.platform}`);
    console.log(`Tier: ${result.metadata.tier}`);
    console.log(`Compliance: ${result.metadata.complianceMode}`);
    console.log(`De-identified: ${result.metadata.wasDeIdentified ? "Yes" : "No"}`);
    console.log("─".repeat(60) + "\n");

    // Output prompt to stdout
    console.log(result.prompt);
    console.log("\n" + "─".repeat(60));

    // Copy to clipboard if requested
    if (cliInput.copyToClipboard) {
      await copyToClipboard(result.prompt);
      console.log("✓ Copied to clipboard");
    }

    console.log("\nData discarded. No information retained.");
    console.log("─".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ Error: ${error.message}\n`);
    } else {
      console.error("\n❌ An unexpected error occurred\n");
    }
    process.exit(1);
  }
}

/**
 * Gather input from arguments or interactive mode.
 *
 * @param options - Parsed CLI options
 * @returns Complete CLI input
 */
async function gatherInput(options: {
  readonly input?: string;
  readonly platform?: string;
  readonly tier?: string;
  readonly clipboard?: boolean;
}): Promise<CLIInput> {
  // If input is provided, use direct mode
  if (options.input) {
    return {
      rawInput: options.input,
      platform: (options.platform as "claude" | "claude-code") || "claude-code",
      tier: (options.tier as "government" | "enterprise" | "business") || "government",
      copyToClipboard: options.clipboard || false
    };
  }

  // Otherwise, run interactive mode
  return await runInteractive();
}

/**
 * Copy text to clipboard.
 *
 * Uses clipboardy for cross-platform support.
 * This is an explicit user action, not automatic storage.
 *
 * @param text - Text to copy
 */
async function copyToClipboard(text: string): Promise<void> {
  try {
    const clipboardy = await import("clipboardy");
    await clipboardy.default.write(text);
  } catch (error) {
    console.warn("⚠️  Could not copy to clipboard (clipboardy not available)");
  }
}

// Execute main function
main();
