/**
 * PromptForge Web UI
 *
 * Client-side application logic.
 * No persistence, no localStorage, no cookies.
 *
 * All state is ephemeral and discarded on page reload.
 */

import { buildPrompt } from "../../../core/index.js";
import type { Platform, Tier, PromptResult } from "../../../core/types.js";

/**
 * Initialize the application.
 *
 * Sets up event listeners without storing any state.
 */
function initialize(): void {
  const form = document.getElementById("promptForm") as HTMLFormElement;
  const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
  const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;

  if (!form || !clearBtn || !copyBtn) {
    console.error("Required DOM elements not found");
    return;
  }

  // Handle form submission
  form.addEventListener("submit", handleSubmit);

  // Handle clear button
  clearBtn.addEventListener("click", handleClear);

  // Handle copy button
  copyBtn.addEventListener("click", handleCopy);

  // Ensure no data persists
  preventPersistence();
}

/**
 * Handle form submission.
 *
 * Generates prompt and displays result.
 * No data is stored.
 */
function handleSubmit(event: Event): void {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const rawInput = formData.get("taskInput") as string;
  const platform = formData.get("platform") as Platform;
  const tier = formData.get("tier") as Tier;

  if (!rawInput || !rawInput.trim()) {
    alert("Please enter a task description");
    return;
  }

  try {
    // Generate prompt using core engine
    const result = buildPrompt({
      rawInput: rawInput.trim(),
      platform,
      tier,
      complianceMode: "OVIC_VPDSF"
    });

    // Display result
    displayResult(result);
  } catch (error) {
    console.error("Error generating prompt:", error);
    alert("An error occurred while generating the prompt");
  }
}

/**
 * Display the generated prompt result.
 *
 * Shows metadata, warnings, and output.
 * Data is not persisted.
 */
function displayResult(result: PromptResult): void {
  const outputSection = document.getElementById("outputSection");
  const warningsContainer = document.getElementById("warningsContainer");
  const metadataContainer = document.getElementById("metadataContainer");
  const promptOutput = document.getElementById("promptOutput");

  if (!outputSection || !warningsContainer || !metadataContainer || !promptOutput) {
    return;
  }

  // Show output section
  outputSection.classList.add("visible");

  // Display warnings if any
  if (result.warnings.length > 0) {
    warningsContainer.innerHTML = `
      <div class="warnings">
        <h3>⚠️ Compliance Warnings</h3>
        <ul>
          ${result.warnings.map(w => `<li>${escapeHtml(w)}</li>`).join("")}
        </ul>
      </div>
    `;
  } else {
    warningsContainer.innerHTML = "";
  }

  // Display metadata
  metadataContainer.innerHTML = `
    <div class="metadata-item">
      <div class="metadata-label">Platform</div>
      <div>${escapeHtml(result.metadata.platform)}</div>
    </div>
    <div class="metadata-item">
      <div class="metadata-label">Tier</div>
      <div>${escapeHtml(result.metadata.tier)}</div>
    </div>
    <div class="metadata-item">
      <div class="metadata-label">Compliance</div>
      <div>${escapeHtml(result.metadata.complianceMode)}</div>
    </div>
    <div class="metadata-item">
      <div class="metadata-label">De-identified</div>
      <div>${result.metadata.wasDeIdentified ? "Yes" : "No"}</div>
    </div>
  `;

  // Display prompt
  promptOutput.textContent = result.prompt;

  // Scroll to output
  outputSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Handle clear button click.
 *
 * Clears all inputs and output.
 * Ensures data is discarded.
 */
function handleClear(): void {
  const form = document.getElementById("promptForm") as HTMLFormElement;
  const outputSection = document.getElementById("outputSection");
  const promptOutput = document.getElementById("promptOutput");
  const warningsContainer = document.getElementById("warningsContainer");
  const metadataContainer = document.getElementById("metadataContainer");

  if (!form) return;

  // Reset form
  form.reset();

  // Clear output
  if (outputSection) {
    outputSection.classList.remove("visible");
  }

  if (promptOutput) {
    promptOutput.textContent = "";
  }

  if (warningsContainer) {
    warningsContainer.innerHTML = "";
  }

  if (metadataContainer) {
    metadataContainer.innerHTML = "";
  }

  // Focus first input
  const firstInput = form.querySelector("textarea") as HTMLTextAreaElement;
  if (firstInput) {
    firstInput.focus();
  }
}

/**
 * Handle copy to clipboard.
 *
 * Copies the generated prompt to clipboard.
 * This is an explicit user action.
 */
async function handleCopy(): Promise<void> {
  const promptOutput = document.getElementById("promptOutput") as HTMLElement;

  if (!promptOutput || !promptOutput.textContent) {
    return;
  }

  try {
    await navigator.clipboard.writeText(promptOutput.textContent);

    // Visual feedback
    const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "✓ Copied!";
      copyBtn.disabled = true;

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.disabled = false;
      }, 2000);
    }
  } catch (error) {
    console.error("Failed to copy:", error);
    alert("Failed to copy to clipboard");
  }
}

/**
 * Prevent any form of persistence.
 *
 * Ensures no data is stored in localStorage, sessionStorage, or cookies.
 */
function preventPersistence(): void {
  // Disable autocomplete on all inputs
  const inputs = document.querySelectorAll("input, textarea");
  inputs.forEach(input => {
    input.setAttribute("autocomplete", "off");
  });

  // Clear any existing storage (defense in depth)
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    // Storage might be disabled
  }

  // Warn on page unload if there's data in the form
  window.addEventListener("beforeunload", (e) => {
    const taskInput = document.getElementById("taskInput") as HTMLTextAreaElement;
    if (taskInput && taskInput.value.trim()) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}

/**
 * Escape HTML to prevent XSS.
 *
 * @param text - Text to escape
 * @returns Escaped HTML
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
