/**
 * Interactive CLI Mode
 *
 * Prompts user for input via readline.
 * No history, no persistence.
 */

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type { Platform, Tier } from "../../../core/types.js";
import type { CLIInput } from "./types.js";

/**
 * Run interactive mode to collect user input.
 *
 * Prompts for:
 * - Task description
 * - Platform selection
 * - Tier selection
 * - Clipboard preference
 *
 * No input is stored or retained.
 *
 * @returns Complete CLI input ready for processing
 */
export async function runInteractive(): Promise<CLIInput> {
  const rl = readline.createInterface({ input, output });

  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  PromptForge — OVIC/VPDSF Compliant Prompt Generator  ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");
  console.log("COMPLIANCE NOTICE:");
  console.log("• All input will be de-identified");
  console.log("• No data will be stored or retained");
  console.log("• Local execution only");
  console.log("• OVIC / VPDSF mode active\n");

  try {
    // Task description
    const rawInput = await rl.question("Task description:\n> ");
    if (!rawInput.trim()) {
      throw new Error("Task description cannot be empty");
    }

    // Platform selection
    const platformInput = await rl.question(
      "\nTarget platform (claude | claude-code) [claude-code]: "
    );
    const platform = parsePlatform(platformInput.trim() || "claude-code");

    // Tier selection
    const tierInput = await rl.question(
      "\nOrganization tier (government | enterprise | business) [government]: "
    );
    const tier = parseTier(tierInput.trim() || "government");

    // Clipboard preference
    const clipboardInput = await rl.question(
      "\nCopy to clipboard? (y/n) [n]: "
    );
    const copyToClipboard = clipboardInput.trim().toLowerCase() === "y";

    rl.close();

    return {
      rawInput,
      platform,
      tier,
      copyToClipboard
    };
  } catch (error) {
    rl.close();
    throw error;
  }
}

/**
 * Parse platform input.
 *
 * @param input - User input
 * @returns Valid platform
 */
function parsePlatform(input: string): Platform {
  if (input === "claude" || input === "claude-code") {
    return input;
  }
  throw new Error(`Invalid platform: ${input}. Must be: claude | claude-code`);
}

/**
 * Parse tier input.
 *
 * @param input - User input
 * @returns Valid tier
 */
function parseTier(input: string): Tier {
  if (input === "government" || input === "enterprise" || input === "business") {
    return input;
  }
  throw new Error(`Invalid tier: ${input}. Must be: government | enterprise | business`);
}
